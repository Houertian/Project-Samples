import json
import boto3
import os
import uuid
import base64
import pathlib
import datatier
import auth
import api_utils

from configparser import ConfigParser

def lambda_handler(event, context):
  try:
    print("**STARTING**")
    print("**lambda: final_musics**")

    method = event["httpMethod"]
    print("method:", method)
    
    #
    # setup AWS based on config file
    #
    config_file = 'config.ini'
    os.environ['AWS_SHARED_CREDENTIALS_FILE'] = config_file
    
    configur = ConfigParser()
    configur.read(config_file)

    #
    # configure for S3 access
    #
    s3_profile = 's3readwrite'
    boto3.setup_default_session(profile_name=s3_profile)
    
    bucketname = configur.get('s3', 'bucket_name')
    
    print("bucketname:",bucketname)
    
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucketname)
    
    #
    # configure for RDS access
    #
    rds_endpoint = configur.get('rds', 'endpoint')
    rds_portnum = int(configur.get('rds', 'port_number'))
    rds_username = configur.get('rds', 'user_name')
    rds_pwd = configur.get('rds', 'user_pwd')
    rds_dbname = configur.get('rds', 'db_name')

    #
    # listid from event: could be a parameter
    # or could be part of URL path ("pathParameters")
    #
    body = json.loads(event["body"])
    listid = body["listid"]
    print("listid:", listid)
    # if "listid" in event:
    #   listid = event["listid"]
    # elif "pathParameters" in event:
    #   if "listid" in event["pathParameters"]:
    #     listid = event["pathParameters"]["listid"]
    #   else:
    #     return api_utils.error(400, "no listid in pathParameters")
    # else:
    #   return api_utils.error(400, "no listid in event")
        
    print("listid:", listid)

    #
    # get the access token from the request headers,
    # then get the user ID from the token
    #
    print("**Accessing request headers to get authenticated user info**")

    if "headers" not in event:
      return api_utils.error(400, "no headers in request")
    
    headers = event["headers"]

    token = auth.get_token_from_header(headers)

    if token is None:
      return api_utils.error(401, "no bearer token in headers")
      
    try:
      user_id = auth.get_user_from_token(token, "mysecret")
    except Exception as e:
      return api_utils.error(401, "invalid access token")

    # CHANGE THIS
    userid = user_id
    print("userid:", userid)

    #
    # open connection to the database
    #
    print("**Opening connection**")
    
    dbConn = datatier.get_dbConn(rds_endpoint, rds_portnum, rds_username, rds_pwd, rds_dbname)

    print("**Checking listid status**")

    sql = "SELECT * FROM musiclists WHERE listid = %s;"
    
    row = datatier.retrieve_one_row(dbConn, sql, [listid])
    
    if row == ():  # no such list
      print("**No such list, returning...**")
      return api_utils.error(404, "no such list")

    #
    # GET
    #
    if method == "GET":
      
      #
      # retrieve all the music lists that user have admin
      #
      print("**Retrieving lists (admin)**")
      
      admin_sql = "SELECT listid FROM musiclists WHERE adminuserid = %s;"
      
      admin_rows = datatier.retrieve_all_rows(dbConn, admin_sql, [userid])
      
      for row in admin_rows:
        print(row)

      #
      # retrieve all the music lists that user have access
      #
      print("**Retrieving lists (access)**")
      
      access_sql = "SELECT musiclists.listid FROM musiclists JOIN listaccess ON musiclists.listid = listaccess.listid WHERE listaccess.accessuserid = %s;"
      
      access_rows = datatier.retrieve_all_rows(dbConn, access_sql, [userid])
        
      access_rows = [item for row in access_rows for item in row]
      print("access_rows:",access_rows)
  
      if int(listid) not in access_rows:
        return api_utils.error(403, "user does not have access to the list")
    
      
      #
      # retrieve all the music in the list
      #
      print("**Retrieving musics**")
      
      musics_sql = "SELECT musics.* FROM musics JOIN musicinlist ON musics.musicid = musicinlist.musicid WHERE musicinlist.listid = %s;"

      music_rows = datatier.retrieve_all_rows(dbConn, musics_sql, [listid])

      for row in music_rows:
        print(row)

      #
      # respond in an HTTP-like way, i.e. with a status
      # code and body in JSON format
      #
      print("**DONE, returning rows**")
      
      return api_utils.success(200, music_rows)

    #
    # POST
    #
    if method == "POST":
      #
      # read information from the event body
      #
      print("**Accessing request body**")

      if "body" not in event:
        return api_utils.error(400, "no body in request")
      
      body = json.loads(event["body"])

      if "musicfile" not in body or "musicname" not in body or "artist" not in body or "albumname" not in body or "albumart" not in body:
        return api_utils.error(400, "missing credentials in body")
      
      musicfile_datastr = body["musicfile"]
      musicname = body["musicname"]
      artist = body["artist"]
      albumname = body["albumname"]
      albumart_datastr = body["albumart"]
      
      #
      # check user admin
      #

      #
      # retrieve all the music lists that user have admin
      #
      print("**Retrieving lists (admin)**")
      
      admin_sql = "SELECT listid FROM musiclists WHERE adminuserid = %s;"
      
      admin_rows = datatier.retrieve_all_rows(dbConn, admin_sql, [userid])
      admin_rows = [item for row in admin_rows for item in row]
      print("admin_rows:",admin_rows)
  
      if int(listid) not in admin_rows:
        return api_utils.error(403, "user does not have admin to the list")
      #
      # retrieve the music in the list
      #
      print("**Retrieving musics**")
      
      sql_existing_music = "SELECT musics.musicname FROM musics JOIN musicinlist ON musics.musicid = musicinlist.musicid WHERE musicinlist.listid = %s;"

      existing_musics = datatier.retrieve_all_rows(dbConn, sql_existing_music, [listid])

      if musicname in existing_musics:
        print("**Music already exsits in the list**")
        return api_utils.error(409, "music already exists in the list")

      sql_check_music = "SELECT musicid FROM musics WHERE musicname = %s;"
      existing_music = datatier.retrieve_one_row(dbConn, sql_check_music, [musicname])

      if existing_music is not ():
        print("**Music already exsits in musics**")
        musicid = existing_music[0]
      else:
        print("**Creating new music**")

        sql_check_album = "SELECT albumid FROM albums WHERE albumname = %s;"
        existing_album = datatier.retrieve_one_row(dbConn, sql_check_album, [albumname])

        albumid = 0

        if existing_album is not ():
          albumid = existing_album[0]
        else:

          base64_bytes = albumart_datastr.encode()  # string -> base64 bytes
          bytes = base64.b64decode(base64_bytes)    # base64 bytes -> raw bytes

          #
          # write raw bytes to local filesystem for upload
          #
          print("**Writing album local data file**")
          
          album_local_filename = "/tmp/album_data.jpg"
          
          outfile = open(album_local_filename, "wb")
          outfile.write(bytes)
          outfile.close()

          #
          # generate unique filename in preparation for the S3 upload
          #
          print("**Uploading album local file to S3**")
          
          basename = pathlib.Path(albumname).stem
          extension = pathlib.Path(albumname).suffix
          
          # if extension != ".jpg" :
          #   return api_utils.error(400, "expecting filename to have .jpg extension")
          
          album_bucketkey = "albums/" + basename + "-" + str(uuid.uuid4()) + ".jpg"
          
          print("S3 bucketkey:", album_bucketkey)

          sql_insert_album = "INSERT INTO albums (albumname, albumart) VALUES (%s, %s);"

          datatier.perform_action(dbConn, sql_insert_album, [albumname, album_bucketkey])

          #
          # grab the albumid that was auto-generated by mysql
          #
          sql = "SELECT LAST_INSERT_ID();"

          row = datatier.retrieve_one_row(dbConn, sql)

          albumid = row[0]

          #
          # upload album art to S3
          #
          print("**Uploading album data file to S3**")

          bucket.upload_file(album_local_filename,
                             album_bucketkey, 
                             ExtraArgs={
                               'ACL': 'public-read',
                               'ContentType': 'application/jpg'
                             })
   
        if albumid == 0:
          return api_utils.error(403, "error with albumid")

        print("albumid:", albumid)

        base64_bytes = musicfile_datastr.encode()   # string -> base64 bytes
        bytes = base64.b64decode(base64_bytes)      # base64 bytes -> raw bytes

        #
        # write raw bytes to local filesystem for upload
        #
        print("**Writing music local data file**")
        
        local_filename = "/tmp/music_data.mp3"
        
        outfile = open(local_filename, "wb")
        outfile.write(bytes)
        outfile.close()
        
        #
        # generate unique filename in preparation for the S3 upload
        #
        print("**Uploading music local file to S3**")
        
        basename = pathlib.Path(musicname).stem
        extension = pathlib.Path(musicname).suffix
        
        # if extension != ".mp3" :
        #   return api_utils.error(400, "expecting filename to have .mp3 extension")
        
        music_bucketkey = "musics/" + basename + "-" + str(uuid.uuid4()) + ".mp3"
        
        print("S3 bucketkey:", music_bucketkey)

        sql_insert_music = "INSERT INTO musics (musicfile, musicname, artist, albumid) VALUES (%s, %s, %s, %s);"
    
        datatier.perform_action(dbConn, sql_insert_music, [music_bucketkey, musicname, artist, albumid])

        #
        # grab the musicid that was auto-generated by mysql
        #
        sql = "SELECT LAST_INSERT_ID();"

        row = datatier.retrieve_one_row(dbConn, sql)

        musicid = row[0]

        #
        # upload album art to S3
        #
        print("**Uploading music data file to S3**")

        bucket.upload_file(local_filename,
                            music_bucketkey, 
                            ExtraArgs={
                              'ACL': 'public-read',
                              'ContentType': 'application/mp3'
                            })

      print("musicid:", musicid)

      sql_add_music_to_list = "INSERT INTO musicinlist (listid, musicid) VALUES (%s, %s);"

      datatier.perform_action(dbConn, sql_add_music_to_list, [listid, musicid])

      #
      # retrieve all the music in the list
      #
      print("**Retrieving musics**")
      
      musics_sql = "SELECT musics.* FROM musics JOIN musicinlist ON musics.musicid = musicinlist.musicid WHERE musicinlist.listid = %s;"

      music_rows = datatier.retrieve_all_rows(dbConn, musics_sql, [listid])

      for row in music_rows:
        print(row)

      #
      # respond in an HTTP-like way, i.e. with a status
      # code and body in JSON format
      #
      print("**DONE, returning rows**")
      
      return api_utils.success(200, music_rows)

    #
    # DELETE
    #
    if method == "DELETE":
      #
      # read the adduserid and listid from the event body
      #
      print("**Accessing request body**")

      if "body" not in event:
        return api_utils.error(400, "no body in request")
      
      body = json.loads(event["body"])

      if "deletemusicid" not in body:
        return api_utils.error(400, "missing credentials in body")
      
      deletemusicid = body["deletemusicid"]

      #
      # retrieve all the music lists that user have admin
      #
      print("**Retrieving lists (admin)**")
      
      admin_sql = "SELECT listid FROM musiclists WHERE adminuserid = %s;"
      
      admin_rows = datatier.retrieve_all_rows(dbConn, admin_sql, [userid])

      admin_rows = [item for row in admin_rows for item in row]
      print("admin_rows:",admin_rows)
  
      if int(listid) not in admin_rows:
        return api_utils.error(403, "user does not have admin to the list")
      sql_existing_access = "SELECT * FROM musicinlist WHERE listid = %s AND musicid = %s;"

      existing_access = datatier.retrieve_one_row(dbConn, sql_existing_access, [listid, deletemusicid])

      if existing_access is ():
        return api_utils.error(409, "music doesn't exist in the list")
      
      print("**Deleting music**")

      sql_delete = "DELETE FROM musicinlist WHERE musicid = %s AND listid = %s;"

      datatier.perform_action(dbConn, sql_delete, [deletemusicid, listid])
      
      #
      # retrieve all the music in the list
      #
      print("**Retrieving musics**")
      
      musics_sql = "SELECT musics.* FROM musics JOIN musicinlist ON musics.musicid = musicinlist.musicid WHERE musicinlist.listid = %s;"

      music_rows = datatier.retrieve_all_rows(dbConn, musics_sql, [listid])

      for row in music_rows:
        print(row)

      #
      # respond in an HTTP-like way, i.e. with a status
      # code and body in JSON format
      #
      print("**DONE, returning rows**")
      
      return api_utils.success(200, music_rows)
    
  except Exception as err:
    print("**ERROR**")
    print(str(err))

    return api_utils.error(500, str(err))

CREATE DATABASE IF NOT EXISTS musicapp;

USE musicapp;

DROP TABLE IF EXISTS listaccess;
DROP TABLE IF EXISTS musicinlist;
DROP TABLE IF EXISTS musiclists;
DROP TABLE IF EXISTS musics;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    userid       int not null AUTO_INCREMENT,
    username     varchar(64) not null,
    pwdhash      varchar(256) not null,
    PRIMARY KEY  (userid),
    UNIQUE       (username)
);

ALTER TABLE users AUTO_INCREMENT = 80001;  -- starting value


CREATE TABLE albums
(
    albumid     int not null AUTO_INCREMENT,
    albumname   varchar(256) not null,  -- album name
    albumart    varchar(256) not null,  -- album art filename       
    PRIMARY KEY (albumid),
    UNIQUE      (albumname)
);

ALTER TABLE albums AUTO_INCREMENT = 3001;  -- starting value


CREATE TABLE musics
(
    musicid     int not null AUTO_INCREMENT,
    musicfile   varchar(256) not null,  -- filename in the bucket
    musicname   varchar(256) not null,  -- music name
    artist      varchar(256) not null,  -- artist name
    albumid     int not null,           -- album id          
    PRIMARY KEY (musicid),
    FOREIGN KEY (albumid) REFERENCES albums(albumid),
    UNIQUE      (musicname)
);

ALTER TABLE musics AUTO_INCREMENT = 1001;  -- starting value

CREATE TABLE musiclists
(
    listid          int not null AUTO_INCREMENT,
    adminuserid     int not null,
    listname        varchar(256) not null,  -- list title
    PRIMARY KEY (listid)
);

ALTER TABLE musiclists AUTO_INCREMENT = 2001;  -- starting value

-- Many-to-Many junction table
CREATE TABLE musicinlist
(
    listid      int not null,
    musicid     int not null,
    PRIMARY KEY (listid, musicid),
    FOREIGN KEY (listid) REFERENCES musiclists (listid),
    FOREIGN KEY (musicid) REFERENCES musics (musicid)
);

-- Many-to-Many junction table
CREATE TABLE listaccess
(
    listid          int not null,
    accessuserid    int not null,
    PRIMARY KEY (listid, accessuserid),
    FOREIGN KEY (listid) REFERENCES musiclists (listid),
    FOREIGN KEY (accessuserid) REFERENCES users (userid)
);

--
-- Insert some users to start with:
-- 
-- PWD hashing: https://phppasswordhash.com/
--
INSERT INTO users(username, pwdhash)  -- pwd = abc123!!
            values('p_sarkar', '$2y$10$/8B5evVyaHF.hxVx0i6dUe2JpW89EZno/VISnsiD1xSh6ZQsNMtXK');

INSERT INTO users(username, pwdhash)  -- pwd = abc456!!
            values('e_ricci', '$2y$10$F.FBSF4zlas/RpHAxqsuF.YbryKNr53AcKBR3CbP2KsgZyMxOI2z2');

INSERT INTO users(username, pwdhash)  -- pwd = abc789!!
            values('l_chen', '$2y$10$GmIzRsGKP7bd9MqH.mErmuKvZQ013kPfkKbeUAHxar5bn1vu9.sdK');

--
-- creating user accounts for database access:
--
-- ref: https://dev.mysql.com/doc/refman/8.0/en/create-user.html
--

DROP USER IF EXISTS 'musicapp-read-only';
DROP USER IF EXISTS 'musicapp-read-write';

CREATE USER 'musicapp-read-only' IDENTIFIED BY 'abc123!!';
CREATE USER 'musicapp-read-write' IDENTIFIED BY 'def456!!';

GRANT SELECT, SHOW VIEW ON musicapp.* 
      TO 'musicapp-read-only';
GRANT SELECT, SHOW VIEW, INSERT, UPDATE, DELETE, DROP, CREATE, ALTER ON musicapp.* 
      TO 'musicapp-read-write';
      
FLUSH PRIVILEGES;

--
-- done
--


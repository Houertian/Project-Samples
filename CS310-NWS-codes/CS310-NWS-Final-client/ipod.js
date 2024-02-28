// Create your global variables below:
var tracklist = ["Let It Happen", "Nangs", "The Moment", "Yes I'm Changing", "Eventually", "Gossip", "The Less I Know The Better", "Past Life", "Disciples", "'Cause I'm A Man"];
const apiGatewayUrl = 'https://dute42ik62.execute-api.us-east-2.amazonaws.com/test';
function init() {};

function secondsToMs(d) {
    d = Number(d);

    var min = Math.floor(d / 60);
    var sec = Math.floor(d % 60);

    return `0${min}`.slice(-1) + ":" + `00${sec}`.slice(-2);
}

// Function to create an album element
function createAlbumElement(album,counter) {
  const albumWrapper = document.createElement("div");
  albumWrapper.classList.add("albums-album-wrapper");

  const albumArt = document.createElement("div");
  albumArt.classList.add("albums-album-art");

  const albumLink = document.createElement("a");
  albumLink.href = "songs.html";
  albumLink.onclick = function() {
      // Set a session variable with the song name
      sessionStorage.setItem("playlistname", album.name);
      sessionStorage.setItem("playlistid", album.id);
      sessionStorage.setItem("accesstype", album.accessLevel);
      sessionStorage.setItem("currentPlayingIdx", counter);
  };

  const albumImage = document.createElement("img");
  albumImage.src = album.imageSrc;

  albumLink.appendChild(albumImage);
  albumArt.appendChild(albumLink);

  const albumName = document.createElement("div");
  albumName.classList.add("albums-album-name");
  albumName.innerHTML = `<p>${album.name}</p>`;

  const artistName = document.createElement("div");
  artistName.classList.add("albums-artist-name");
  artistName.innerHTML = `<p>${album.accessLevel}</p>`;

  albumWrapper.appendChild(albumArt);
  albumWrapper.appendChild(albumName);
  albumWrapper.appendChild(artistName);

  return albumWrapper;
}

// Function to populate albums
function populateAlbums(albums) {
  const albumsContainer = document.getElementById("albumsContainer");

  // Clear existing content
  albumsContainer.innerHTML = "";

  // Loop through the albums and create elements for each
  var counter = 0;
  for (const album of albums) {
      const albumElement = createAlbumElement(album, counter);
      albumsContainer.appendChild(albumElement);
      counter++;
  }
}

function populateSongsList(songs) {
  const songsList = document.getElementById("songsList");

  // Clear existing list items
  songsList.innerHTML = "";

  // Limit the number of songs to a maximum of 10
  const maxSongs = Math.min(songs.length, 10);
  sessionStorage.setItem("playlistlengthcur", maxSongs);
  sessionStorage.setItem("currentPlaylist", JSON.stringify(songs));

  for (let i = 0; i < maxSongs; i++) {
      const songName = songs[i]["songname"];
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "player.html"; // Set the href to player.html
      link.textContent = songName;
      link.onclick = function() {
          // Set a session variable with the song name
          sessionStorage.setItem("playsongname", songName);
          sessionStorage.setItem("playsongid", songs[i]["songid"]);
          sessionStorage.setItem("playsongartist", songs[i]["artist"]);
          sessionStorage.setItem("playsongalbumid", songs[i]["albumid"]);
          sessionStorage.setItem("currentPlaylist", JSON.stringify(songs));
          window.location.href = "player.html";
      };
      listItem.appendChild(link);
      songsList.appendChild(listItem);
  }
}
console.log(window.location.href);
if (window.location.href.includes("login.html")){
  console.log(window.location.href);
  document.getElementById("loginBtn").addEventListener("click", function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username == null || username == "") {
      alert("No username entered");
      return false;
    }
    if (password == null || password == "") {
      alert("No password entered");
      return false;
    }
    let apiGatewayAuth = apiGatewayUrl + '/auth';

    // Data to send in the POST request
    const data = {
        "username": username,
        "password": password
    };

    async function fetchData(datas) {
      try {
          const response = await fetch(apiGatewayAuth, {
              method: 'POST',
              body: JSON.stringify(datas),
              headers: { 'Content-Type': 'application/json' }
          });
  
          // console.log('Status Code:', response.status); // Logs the status code
  
          const data = await response.json(); // Parses the response body as JSON
          // console.log('Success:', data); // Handle your data here
          
          if (await !response.ok) {
            alert(data.message);
            return false;
          } else {
            return data;
          }
      } catch (error) {
          console.error('Error:', error); // Handle errors here
      }}

      fetchData(data).then(function(result) {
        console.log(result);
        if (result.access_token) {
          sessionStorage.setItem("username", result.access_token);
          window.location.href = "albums.html";
        }
      });
      
  });

  document.getElementById("RegisterBtn").addEventListener("click", function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username == null || username == "") {
      alert("No username entered");
      return false;
    }
    if (password == null || password == "") {
      alert("No password entered");
      return false;
    }
    let apiGatewayAddUser = apiGatewayUrl + '/add_user';

    // Data to send in the POST request
    const datadsss = {
        "username": username,
        "password": password
    };

    async function fetchData() {
      try {
          const response = await fetch(apiGatewayAddUser, {
              method: 'POST',
              body: JSON.stringify(datadsss),
              headers: { 'Content-Type': 'application/json' }
          });
  
          // console.log('Status Code:', response.status); // Logs the status code
  
          const data = await response.json(); // Parses the response body as JSON
          // console.log('Success:', data); // Handle your data here
          
          if (await !response.ok) {
            alert(data.message);
            return false;
          } else {
            return data;
          }
      } catch (error) {
          console.error('Error:', error); // Handle errors here
      }}

      fetchData().then(function(result) {
        console.log(result);
        if (result) {
          alert("User created");
          window.location.href = "login.html";
        }
      });
      
  });
  // Function to simulate checking login credentials
 
} 

if (window.location.href.includes("albums.html")){
  var accessToken = sessionStorage.getItem("username");
  console.log(window.location.href);
  console.log(accessToken);
  document.getElementById("logoutBtn").addEventListener("click", function() {
    sessionStorage.removeItem("username");
    window.location.href = "login.html";
  });
  let apiGatewayAuth = apiGatewayUrl + '/music-lists';

    // Data to send in the POST request
    // const data = {
    //     "username": username,
    //     "password": password
    // };

  async function fetchData() {
    try {
        const response = await fetch(apiGatewayAuth, {
            method: 'GET',
            body: JSON.stringify(),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
          }
        });

        // console.log('Status Code:', response.status); // Logs the status code

        const data = await response.json(); // Parses the response body as JSON
        // console.log('Success:', data); // Handle your data here
        
        if (await !response.ok) {
          // alert(data.message);
          return false;
        } else {
          return data;
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors here
    }}

  fetchData().then(function(result) {
    console.log(result.admin_list_name);
    console.log(result.access_list_name);
    var albums = [];
    for (var i = 0; i < result.admin_list_name.length; i++) {
      var album = {
        name: result.admin_list_name[i],
        accessLevel: "Admin",
        imageSrc: "images/currents.jpg",
        id: result.admin_list_id[i]
      };
      albums.push(album);
    }
    for (var i = 0; i < result.access_list_name.length; i++) {
      var album = {
        name: result.access_list_name[i],
        accessLevel: "Access",
        imageSrc: "images/currents.jpg",
        id: result.access_list_id[i]
      };
      albums.push(album);
    }
    sessionStorage.setItem("playlists", JSON.stringify(albums));
    console.log(albums.length);
    if (albums.length == 4) {
      document.getElementById("addPlaylistBtn").innerText = "Playlist Maxed";
      document.getElementById("addPlaylistBtn").style.backgroundColor = "grey";
    }
    document.getElementById("addPlaylistBtn").addEventListener("click", function() {
      if (albums.length < 4)  {
        window.location.href = "addplaylist.html";
      } 
    });
    populateAlbums(albums);
    var albumList = document.getElementsByClassName("album");
  });

}

if (window.location.href.includes("addplaylist.html")){
  console.log(window.location.href);
  document.getElementById("addPlaylistBtn").addEventListener("click", function() {
    var playlistname = document.getElementById("playlistName").value;
    sessionStorage.setItem("playlistName", playlistname);
    var userid = sessionStorage.getItem("username");

      
    let apiGatewayAuth = apiGatewayUrl + '/add-list';

    // Data to send in the POST request
    const postdata = {
        "listname": playlistname,
    };

  async function fetchData() {
    try {
        const response = await fetch(apiGatewayAuth, {
            method: 'POST',
            body: JSON.stringify(postdata),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userid}` // Add the token in the Authorization header
          }
        });

        // console.log('Status Code:', response.status); // Logs the status code

        const data = await response.json(); // Parses the response body as JSON
        // console.log('Success:', data); // Handle your data here
        
        if (await !response.ok) {
          // alert(data.message);
          return false;
        } else {
          return data;
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors here
    }}

  fetchData().then(function(result) {
    console.log(result.listid);
    window.location.href = "albums.html";});

  });
} 

if (window.location.href.includes("songs.html")){
  console.log(window.location.href);
  var username = sessionStorage.getItem("username");
  var albumname = sessionStorage.getItem("playlistname");
  var albumid = sessionStorage.getItem("playlistid");
  var accesstype = sessionStorage.getItem("accesstype");
  var accessToken = sessionStorage.getItem("username");
  console.log(albumname);
  console.log(albumid);
  console.log(accesstype);
  document.getElementById("playlistname").innerHTML = albumname;
  document.getElementById("accesstype").innerHTML = accesstype;
  console.log(username);

  
  let apiGatewaygetsongs = apiGatewayUrl + '/musics';

  async function fetchData() {
    try {
        const response = await fetch(apiGatewaygetsongs, {
            method: 'POST',
            body: JSON.stringify({
              "actualType": "GET",
              'listid': albumid,}),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
          }
        });

        // console.log('Status Code:', response.status); // Logs the status code

        const data = await response.json(); // Parses the response body as JSON
        // console.log('Success:', data); // Handle your data here
        
        if (await !response.ok) {
          // alert(data.message);
          return false;
        } else {
          return data;
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors here
        window.location.href = "albums.html";
    }}

  fetchData().then(function(result) {
    console.log(result);
    var albums = [];
    for (var i = 0; i < result.length; i++) {
      var row = result[i];
      var album = {
        "songname": row[2],
        "songid": row[0],
        "artist": row[3],
        "albumid": row[4],
      };
      albums.push(album);
    }
    populateSongsList(albums);
  });


  const songs = [
    "Let It Happen",
    "Nangs",
    "The Moment",
    "Yes I'm Changing",
    "Eventually",
    "Gossip",
    "The Less I Know The Better",
    "Past Life",
    "Disciples",
    "'Cause I'm A Man"
];
  // populateSongsList(songs);
  
  document.getElementById("AddSongToList").addEventListener("click", function() {
    window.location.href = "addsong.html";
  });

  document.getElementById("AddAccessToList").addEventListener("click", function() {
    const username = prompt('Please enter the username to add access:');
    console.log(username);
    if (username == null || username == "") {
      alert("No username entered");
      // return false;
    }else{
      let apiGatewayaddAddAccess = apiGatewayUrl + '/add_access';
      var listinfo = {
        "addusername": username,
        "listid": albumid
      };
      
      async function addUserAccess() {
        try {
            const response = await fetch(apiGatewayaddAddAccess, {
                method: 'POST',
                body: JSON.stringify(listinfo),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
              }
            });

            // console.log('Status Code:', response.status); // Logs the status code

            const data = await response.json(); // Parses the response body as JSON
            // console.log('Success:', data); // Handle your data here
            
            if (await !response.ok) {
              // alert(data.message);
              return data;
            } else {
              return data;
            }
        } catch (error) {
            console.error('Error:', error); // Handle errors here
        }}

        addUserAccess().then(function(result) {
          console.log(result);
          alert(result.message);
        });
    }
  });

  document.getElementById("DeleteSongHere").addEventListener("click", function() {
    var songidxde = prompt('Please enter the index of song to be deleted:');
    var numberofsong = sessionStorage.getItem("playlistlengthcur");
    songidxde = songidxde - 1;
    console.log(songidxde);
    if (songidxde < 0 || songidxde >= numberofsong) {
      alert("Invalid index, must be between 1 and " + numberofsong);
      // return false;
    }else{
      var currentSongLists = JSON.parse(sessionStorage.getItem("currentPlaylist"));
      console.log(currentSongLists);
      var songid = currentSongLists[songidxde].songid;
      let apiGatewayaddAddAccess = apiGatewayUrl + '/musics';
      var listinfo = {
        "addusername": username,
        "deletemusicid": songid,
        "actualType": "DELETE",
        "listid": albumid
      };
      
      async function deleteSongHere() {
        try {
            const response = await fetch(apiGatewayaddAddAccess, {
                method: 'DELETE',
                body: JSON.stringify(listinfo),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
              }
            });

            // console.log('Status Code:', response.status); // Logs the status code

            const data = await response.json(); // Parses the response body as JSON
            // console.log('Success:', data); // Handle your data here
            
            if (await !response.ok) {
              // alert(data.message);
              return data;
            } else {
              return data;
            }
        } catch (error) {
            console.error('Error:', error); // Handle errors here
            alert("Delete failed, please try again later");
            return false;
        }}

        deleteSongHere().then(function(result) {
          console.log(result);
          if (result != false) {
            alert("successfully deleted");
          }
          window.location.href = "songs.html";
        });
    }
  });

  const deleteButton = document.getElementById('deleteListButton');
  if (accesstype != "Admin") {
    deleteListButton.innerText = "Delect Access";}
  // Add a click event listener to the button
  deleteButton.addEventListener('click', function() {
      // Show a confirmation dialog
      if (accesstype != "Admin") {
        const userConfirmed = confirm('Are you sure you want to delete access to this list?');

        // Check if user clicked 'OK'
        if (userConfirmed) {
            // User clicked 'OK', proceed with list deletion
            console.log('List will be deleted.'); // Replace with your deletion logic
            
            let apiGatewaydeleteList = apiGatewayUrl + '/delete-access';
  
            var listinfo = {
              "listid": albumid
            };
            
            async function deleteListAccess() {
              try {
                  const response = await fetch(apiGatewaydeleteList, {
                      method: 'POST',
                      body: JSON.stringify(listinfo),
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
                    }
                  });
  
                  // console.log('Status Code:', response.status); // Logs the status code
  
                  const data = await response.json(); // Parses the response body as JSON
                  // console.log('Success:', data); // Handle your data here
                  
                  if (await !response.ok) {
                    // alert(data.message);
                    return false;
                  } else {
                    return data;
                  }
              } catch (error) {
                  console.error('Error:', error); // Handle errors here
              }}
  
              deleteListAccess().then(function(result) {
                console.log(result);
                window.location.href = "albums.html";
              });
        } else {
            // User clicked 'Cancel', do nothing
            console.log('List deletion cancelled.');
        }
      }else{
        const userConfirmed = confirm('Are you sure you want to delete this list?');

        // Check if user clicked 'OK'
        if (userConfirmed) {
            // User clicked 'OK', proceed with list deletion
            console.log('List will be deleted.'); // Replace with your deletion logic
            
            let apiGatewaydeleteList = apiGatewayUrl + '/delete-list';
  
            var listinfo = {
              "listid": albumid
            };
            
            async function deleteList() {
              try {
                  const response = await fetch(apiGatewaydeleteList, {
                      method: 'POST',
                      body: JSON.stringify(listinfo),
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
                    }
                  });
  
                  // console.log('Status Code:', response.status); // Logs the status code
  
                  const data = await response.json(); // Parses the response body as JSON
                  // console.log('Success:', data); // Handle your data here
                  
                  if (await !response.ok) {
                    // alert(data.message);
                    return false;
                  } else {
                    return data;
                  }
              } catch (error) {
                  console.error('Error:', error); // Handle errors here
              }}
  
              deleteList().then(function(result) {
                console.log(result);
                window.location.href = "albums.html";
              });
        } else {
            // User clicked 'Cancel', do nothing
            console.log('List deletion cancelled.');
        }
      }
  });
}

if (window.location.href.includes("addsong.html")){
  console.log(window.location.href);
  var username = sessionStorage.getItem("username");
  var playlistname = sessionStorage.getItem("playlistname");
  var playlistid = sessionStorage.getItem("playlistid");
  var accesstype = sessionStorage.getItem("accesstype");
  var accessToken = sessionStorage.getItem("username");
  console.log(playlistname);
  console.log(playlistid);
  console.log(accesstype);
  document.getElementById("playlistnamehere").innerHTML = playlistname;

  document.getElementById("AddSongToListBtn").addEventListener("click", async function() {
    var songname = document.getElementById("songNameIn").value;
    var songartist = document.getElementById("songArtistIn").value;
    var songalbum = document.getElementById("songAlbumIn").value;
    var songimage = document.getElementById("coverInput").files[0];
    var songfile = document.getElementById("musicInput").files[0];
    console.log(songname);
    console.log(songartist);
    console.log(songalbum);
    console.log(songimage);
    console.log(songfile);
    console.log(username);
    console.log(albumid);
    console.log(accesstype);
    console.log(accessToken);
    let apiGatewayaddSong = apiGatewayUrl + '/musics';
    
    if (songfile.type === "audio/mpeg") {
        console.log("File is an MP3.");
        
        var base64EncodedSong = await encodeFile(songfile);
        var base64EncodedImage = await encodeFile(songimage);

        var musicpackage = {
          "actualType": "POST",
          "musicfile": base64EncodedSong,
          "musicname": songname,
          "artist": songartist,
          "albumname": songalbum,
          "albumart": base64EncodedImage,
          "listid": playlistid
        };
        
        async function addMusic() {
          try {
              const response = await fetch(apiGatewayaddSong, {
                  method: 'POST',
                  body: JSON.stringify(musicpackage),
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
                }
              });

              // console.log('Status Code:', response.status); // Logs the status code

              const data = await response.json(); // Parses the response body as JSON
              // console.log('Success:', data); // Handle your data here
              
              if (await !response.ok) {
                alert(data.message);
                return data;
              } else {
                return data;
              }
          } catch (error) {
              console.error('Error:', error); // Handle errors here
              alert("Upload failed, please try again later");
          }}

          addMusic().then(function(result) {
            console.log(result);
            alert("Upload successful");
          });
      
    } else {
      console.error("File is not an MP3.");
    }
  });
}

if (window.location.href.includes("player.html")){
  var username = sessionStorage.getItem("username");
  var songname = sessionStorage.getItem("playsongname");
  var songid = sessionStorage.getItem("playsongid");
  var playlistid = sessionStorage.getItem("playlistid");
  var accesstype = sessionStorage.getItem("accesstype");
  var accessToken = sessionStorage.getItem("username");
  console.log(window.location.href);
  console.log(username);
  console.log(songname);
  console.log(songid);
  console.log(playlistid);
  document.getElementById("player-song-name").innerHTML = songname;

  let apiGatewaygetsongs = apiGatewayUrl + '/download-music';
  
  var musicpackage = {
    "musicid": songid,
    "listid": playlistid
  };
  
  async function getsong() {
    try {
        const response = await fetch(apiGatewaygetsongs, {
            method: 'POST',
            body: JSON.stringify(musicpackage),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}` // Add the token in the Authorization header
          }
        });

        // console.log('Status Code:', response.status); // Logs the status code

        const data = await response.json(); // Parses the response body as JSON
        // console.log('Success:', data); // Handle your data here
        
        if (await !response.ok) {
          alert(data.message);
          return data;
        } else {
          return data;
        }
    } catch (error) {
        console.error('Error:', error); // Handle errors here
        window.location.href = "player.html";
    }}

    getsong().then(function(result) {
      console.log(result);
      // alert(result.message);
      var artistName = result["artist"];
      var albumName = result["album name"];
      var songName = result["music name"];
      document.getElementById("player-song-name").innerHTML = songName;
      document.getElementById("player-song-artist").innerHTML = " - " + artistName;
      document.getElementById("player-song-album").innerHTML = albumName;
      // const audio = new Audio('thissong.mp3');
      var base64String = result["music data"];


      // Decode Base64 string to a Blob
      const fileBlob = base64ToBlob(base64String, 'audio/mpeg'); // change the MIME type as per your file type
  
      // You can now use this Blob as per your requirement
      // For example, to create an object URL to play the audio
      const objectURL = URL.createObjectURL(fileBlob);
      
      const audio = new Audio(objectURL);

      var base64String = result["album data"];
      const imageBlob = base64ToBlob(base64String, 'image/jpeg');

      // Create an object URL for the Blob and set it as the src of an img element
      const imageUrl = URL.createObjectURL(imageBlob);
      document.getElementById('albumsimage').src = imageUrl;
      // Function to handle play/pause button
      let isPlaying = false;

      function switchPlay() {
          if (isPlaying) {
              audio.pause();
              document.getElementById('playPause').textContent = 'play_arrow';
          } else {
              audio.play();
              document.getElementById('playPause').textContent = 'pause';
          }
          isPlaying = !isPlaying;
        }
        audio.addEventListener('loadedmetadata', function() {
          const totalTime = audio.duration;
          const minutes = Math.floor(totalTime / 60);
          const seconds = Math.floor(totalTime % 60);
          const formattedTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
          document.getElementById('time-total').textContent = formattedTime;
          document.getElementById('player-time').max = totalTime;
      });
      document.getElementById('switchPlay()').addEventListener('click', switchPlay);

      // Function to update time-elapsed while playing
      audio.addEventListener('timeupdate', function() {
          const currentTime = audio.currentTime;
          const minutes = Math.floor(currentTime / 60);
          const seconds = Math.floor(currentTime % 60);
          const formattedTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
          document.getElementById('time-elapsed').textContent = formattedTime;
          document.getElementById('player-time').value = currentTime;
      });
      
      // Function to handle seeking
      document.getElementById('player-time').addEventListener('input', function() {
          const seekTime = this.value;
          audio.currentTime = seekTime;
      });
      
      function nextSong() {
        var currentSongLists = JSON.parse(sessionStorage.getItem("currentPlaylist"));
        var counter = 0;
        for (var i = 0; i < currentSongLists.length; i++) {
          if (currentSongLists[i].songname == songName) {
            counter = i;
          }
        }
        console.log(counter);
        counter = counter + 1;
        if (counter == currentSongLists.length){
          counter = 0;
        }
        var nextsonginfo = currentSongLists[counter];
        // console.log(currentSongLists[2]);
        var nextSongidx = nextsonginfo.songid;
        var nextSongname = nextsonginfo.songname;
        console.log(nextSongname);
        console.log(nextSongidx);
        sessionStorage.setItem("playsongname", nextSongname);
        sessionStorage.setItem("playsongid", nextSongidx);
        // var songname = sessionStorage.getItem("playsongname");
        // var songid = sessionStorage.getItem("playsongid");
        window.location.href = "player.html";
      }
      
      document.getElementById('nextSong()').addEventListener('click', nextSong);
      
      function prevSong() {
        var currentSongLists = JSON.parse(sessionStorage.getItem("currentPlaylist"));
        var counter = 0;
        for (var i = 0; i < currentSongLists.length; i++) {
          if (currentSongLists[i].songname == songName) {
            counter = i;
          }
        }
        console.log(counter);
        counter = counter - 1;
        if (counter == -1){
          counter = currentSongLists.length-1;
        }
        var nextsonginfo = currentSongLists[counter];
        // console.log(currentSongLists[2]);
        var nextSongidx = nextsonginfo.songid;
        var nextSongname = nextsonginfo.songname;
        console.log(nextSongname);
        console.log(nextSongidx);
        sessionStorage.setItem("playsongname", nextSongname);
        sessionStorage.setItem("playsongid", nextSongidx);
        // var songname = sessionStorage.getItem("playsongname");
        // var songid = sessionStorage.getItem("playsongid");
        window.location.href = "player.html";
      }
      document.getElementById('prevSong()').addEventListener('click', prevSong);
    });
  

}

function encodeFile(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
          const base64Encoded = event.target.result.split(',')[1]; // Remove the data URL part
          resolve(base64Encoded);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
  });
}


function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: mimeType});
}
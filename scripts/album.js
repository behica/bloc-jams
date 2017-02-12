var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21' },
        { title: 'Magenta', duration: '2:15' }
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumPJTen = {
    title: 'Ten',
    artist: 'Pearl Jam',
    label: 'Epic',
    year: '1991',
    albumArtUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/PearlJam-Ten2.jpg',
    songs: [
        { title: 'Once', duration: '3:51' },
        { title: 'Even Flow', duration: '4:53' },
        { title: 'Alive', duration: '5:41'},
        { title: 'Why Go', duration: '3:20' },
        { title: 'Black', duration: '5:43'}
    ]
};

var albumsArray = [albumPicasso, albumMarconi, albumPJTen];

var albumStart = 1;

 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

var setCurrentAlbum = function(album) {
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // #2
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
 };

var switchAlbum = function() {
    if(albumStart === 1){
    setCurrentAlbum(albumsArray[albumStart]);
    albumStart = 2;
    } else if(albumStart === 2){
        setCurrentAlbum(albumsArray[albumStart]);
        albumStart = 0;
    } else if(albumStart === 0){
        setCurrentAlbum(albumsArray[albumStart]);
        albumStart = 1;
    }    
};

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
 };

document.getElementsByClassName('album-cover-art')[0].addEventListener('click', switchAlbum);
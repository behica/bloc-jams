 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     
     var clickHandler = function() {
         var songNumber = parseInt($(this).attr('data-song-number'));
       if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	   if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);
		//Replacing with setSong(); //currentlyPlayingSongNumber = songNumber;
        setSong(songNumber);
        currentSoundFile.play();
        
        //Update clickHandler() to set the CSS of the volume seek bar to equal the currentVolume.
        $('.volume .fill').width(currentVolume + '%');
        $('.volume .thumb').css({left: currentVolume + '%'});
        
        
        updateSeekBarWhileSongPlays();
        updatePlayerBarSong();
        
           
	}  else if (currentlyPlayingSongNumber === songNumber) {
		if(currentSoundFile.isPaused()){
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
        } else {
            currentSoundFile.pause();
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }
        // Switch from Pause -> Play button to pause currently playing song.
		//$(this).html(playButtonTemplate);
        //$('.main-controls .play-pause').html(playerBarPlayButton);
		//currentlyPlayingSongNumber = null;
        //currentSongFromAlbum = null;
	}
         
};
     
     var onHover = function(event){
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         if (songNumber !== currentlyPlayingSongNumber){
             songNumberCell.html(playButtonTemplate);
         }
     };
     
     var offHover = function(event){
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         if (songNumber !== currentlyPlayingSongNumber){
             songNumberCell.html(songNumber);
         }
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };
     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        console.log(seekBarFillRatio);
        if($(this).parent().attr('class') === 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if($(this).parent().attr('class') === 'seek-control'){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var updatePlayerBarSong = function() {
    // When play button is clicked, update '.song-name' with the [songs] array value [title, duration]
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    // same for artist; currentAlbum.artist
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    // combine both to title - artist for mobile view
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    //Currently playing song number
    var prevPlayingSongNumber = currentlyPlayingSongNumber;
    console.log(prevPlayingSongNumber);
    //Currently playing song index
    console.log(trackIndex(currentAlbum, currentSongFromAlbum));
    //Get current index of the playing song
    var songIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    //Increase the index by 1
    songIndex++;
    
    //reset index if song index is > song list length !! Why is currentAlbum.songs.length === 5? Shouldn't it be 4?
    if(currentlyPlayingSongNumber === currentAlbum.songs.length){
        songIndex = 0;
    }
    
    //set a new current song to currentSongFromAlbum
    currentSongFromAlbum = currentAlbum.songs[songIndex];
    
    //set a current song number to the new song playing
    setSong(songIndex + 1);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    //Update player bar to new song
    updatePlayerBarSong();
    
    //set previously playing song button to song number
    getSongNumberCell(prevPlayingSongNumber).html(prevPlayingSongNumber);
    
    //set currently playing song number to pause button
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
};

var previousSong = function() {
    //console.log("previous clicked!")
    //Currently playing song number
    var prevPlayingSongNumber = currentlyPlayingSongNumber;
    console.log(prevPlayingSongNumber);
    //Currently playing song index
    console.log(trackIndex(currentAlbum, currentSongFromAlbum));
    //Get current index of the playing song
    var songIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    //reset index if song index is > song list length !! Why is currentAlbum.songs.length === 5? Shouldn't it be 4?
    if(songIndex === 0){
        songIndex = 4;
    } else {
    //Increase the index by 1
    songIndex--;
    }
    
    
    //set a new current song to currentSongFromAlbum
    currentSongFromAlbum = currentAlbum.songs[songIndex];
    
    //set a current song number to the new song playing
    setSong(songIndex + 1);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    //Update player bar to new song
    updatePlayerBarSong();
    
    //set previously playing song button to song number
    getSongNumberCell(prevPlayingSongNumber).html(prevPlayingSongNumber);
    
    //set currently playing song number to pause button
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
}

var setSong = function(songNumber) {
    if(currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
     });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if(currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

// Elements to which we'll be adding listeners
//var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
//var songRows = document.getElementsByClassName('album-view-song-item');

// Album button template
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     
 });
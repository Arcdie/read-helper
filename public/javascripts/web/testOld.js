/* global
functions, makeRequest,
objects,
*/

/* Constants */

/* Jquery variables */

// let player;
var video = document.querySelector('.sth');
const tracks = video.textTracks[0];
// tracks.mode = 'hidden'; // must occur before cues is retrieved
const cues = tracks.cues;

// Object.keys(cues).forEach(key => {
//   const cue = cues[key];
//   cue.text = `<a href="/">${cue.text}</a>`;
// });

var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function isFullScreen() {
  return (document.fullScreenElement && document.fullScreenElement !== null)
    || document.mozFullScreen
    || document.webkitIsFullScreen;
}

function toggleFullScreen(element) {
  if (isFullScreen())
    closeFullscreen();
  else
    openFullscreen();
}

$(document).ready(async () => {
  const width = $(window).width();
  const height = $(window).height();

  $('.container').height(height);

  $(window).on('resize', () => {
    const newWidth = $(window).width();
    const newHeight = $(window).height();
    $('.container').css({
      width: newWidth,
      height: newHeight,
    });
  });

  $('.text')
    .on('click', function () {
      toggleFullScreen();
    });

  /*
  var replaceText = function (text) {
    $('.test p').html(text);
  },

    showText = function () {
      $('.test p').show();
    },

    hideText = function () {
      $('.test p').hide();
    },

    cueEnter = function () {
      replaceText(this.text);
      showText();
    },

    cueExit = function () {
      hideText();
    },

    videoLoaded = function (e) {
      for (var i in cues) {
        var cue = cues[i];
        cue.onenter = cueEnter;
        cue.onexit = cueExit;
      }
    },

    playVideo = function (e) {
      video.play();
    };


  video.addEventListener('loadedmetadata', videoLoaded);
  video.addEventListener('load', playVideo);
  video.load();
  */

  // /*
  /*
  

  $('.container').css({
    width,
    // height,
  });
  // */

  /*
  player = videojs('video', {
    controls: true,
    autoplay: true,
    crossorigin: 'anonymous',
    width: '80%',
  });
  // */
});

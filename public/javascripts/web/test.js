/* global
functions, makeRequest,
objects,
*/

const URL_TRANSLATE_PHRASE = '/api/phrase-translations/translate-phrase';

const getWindowSize = () => [$(window).width(), $(window).height()];

/* Jquery variables */
const $container = $('.container');
const $videoContainer = $('.video-container');
const $video = $('video');
const $subscriptions = $('.subscriptions');
const $subscriptionsText = $subscriptions.find('p');
const $addPhrase = $('.add-phrase');

/* Constants */
const DEFAULT_CONTAINER_WIDTH = $container.width();

const video = $video.get(0);
const specialSymbols = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const isTouchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints;

/* Variables */
let phraseArr = [];

let [width, height] = getWindowSize();
const tracks = $video.get(0).textTracks[0];
tracks.mode = 'hidden';

$(document).ready(async () => {
  $subscriptions.hide();
  $container.height(height);

  video
    .addEventListener('loadedmetadata', () => {
      for (const i in tracks.cues) {
        const cue = tracks.cues[i];

        cue.onenter = function () {
          const coveredArr = this.text
            .split(' ')
            .map(w => w && `<span>${w}</span>`);

          $subscriptionsText.html(coveredArr.join(' '));
          $subscriptions.show();
        };

        cue.onexit = () => {
          $subscriptions.hide();
        };
      }
    });

  video.addEventListener('load', function () { this.play(); });

  video.load();

  $(window).on('resize', () => {
    [width, height] = getWindowSize();

    const isFullScreenEnabled = isFullScreen();

    if (!isFullScreenEnabled) {
      $videoContainer
        .width(DEFAULT_CONTAINER_WIDTH);

      $container
        .removeClass('fullscreen');
    } else {
      $videoContainer
        .width(width);

      $container
        .addClass('fullscreen');
    }

    $container.height(height);
  });

  $(document)
    .on('keypress', async e => {
      if (e.keyCode === 102) {
        // F
        toggleFullScreen();
      }
    });

  $addPhrase
    .on('click', 'button.close', () => {
      $addPhrase.removeClass('is_active');
    });

  const eventName = isTouchScreen ? 'dblclick' : 'mouseup';

  if (!isTouchScreen) {
    $videoContainer
      .on(eventName, '.subscriptions span', async (e) => {
        const $target = $(e.target);
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);

        let text = range.toString() || $target.text();

        if (!text) {
          return true;
        }

        const sentence = text.split(' ');
        const lWords = sentence.length;

        if (lWords > 5) {
          return true;
        }

        if (e.target.localName === 'span') {
          const wordText = $target.text().trim();
          const choosenWord = sentence[lWords - 1].trim();

          if (wordText !== choosenWord) {
            sentence[lWords - 1] = wordText;
            text = sentence.join(' ');
          }
        }

        text = text.replace(/[.,]/g, '');

        const translations = await translatePhrase(text);
        const translation = translations ? translations[0] : '';

        const {
          clientX,
          clientY,
        } = e;

        $addPhrase.find('span.phrase').text(text);
        $addPhrase.find('span.translation').text(translation);

        $addPhrase
          .css({
            left: clientX - ($addPhrase.width() / 2),
            top: clientY - 200,
          })
          .addClass('is_active');
      });
  } else {
    $videoContainer
      .on('touchend', 'span', async function (e) {
        const $this = $(this);

        if (!$this.hasClass('is_working')) {
          $this.addClass('is_working');

          phraseArr.push({
            $elem: $this,
            index: $this.index(),
            text: $this.text().trim(),
          });

          return true;
        }

        const text = phraseArr
          .sort((a, b) => a.index > b.index ? 1 : -1)
          .map(e => e.text.replace(/[.,]/g, ''))
          .join(' ')
          .trim();

        if (!text) {
          refuseChoice();
          return true;
        }

        const lWords = phraseArr.length;

        if (lWords > 5) {
          refuseChoice();
          return true;
        }

        const translations = await translatePhrase(text);
        const translation = translations ? translations[0] : '';

        $addPhrase.find('span.phrase').text(text);
        $addPhrase.find('span.translation').text(translation);

        $addPhrase
          .css({
            left: e.changedTouches[0].pageX - ($addPhrase.width() / 2),
            top: e.changedTouches[0].pageY - 200,
          })
          .addClass('is_active');
      });
  }
});

const translatePhrase = async phrase => {
  const resultTranslate = await makeRequest({
    method: 'POST',
    url: URL_TRANSLATE_PHRASE,

    body: {
      phrase: phrase.trim(),
    },
  });

  if (!resultTranslate || !resultTranslate.status) {
    alert(resultTranslate.message || `Cant makeRequest ${URL_TRANSLATE_PHRASE}`);
    return false;
  }

  return resultTranslate.result || [];
};

const refuseChoice = () => {
  phraseArr = [];

  $addPhrase.removeClass('is_active');

  $videoContainer
    .find('span.is_working')
    .removeClass('is_working');
};

const toggleFullScreen = () => !isFullScreen() ? openFullScreen() : closeFullScreen();

const isFullScreen = () => (document.fullScreenElement && document.fullScreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;

const openFullScreen = () => {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

const closeFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
};

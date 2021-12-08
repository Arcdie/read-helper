/* global
functions, makeRequest,
objects,
*/

/* Constants */

const URL_SAVE_USER_PHRASE = '/api/user-phrases';
const URL_TRANSLATE_PHRASE = '/api/quizlet/translate-phrase';

/* JQuery */
const $text = $('.text');
const $events = $('.events');

const $addPhrase = $('.add-phrase');

$(document).ready(async () => {
  $text
    .on('click', async (e) => {
      const text = autoSelectText();

      if (text) {
        // const translations = await translatePhrase(text);
        // const translation = translations ? translations[0] : '';
        const translation = 'Ева, не стучи';

        const {
          clientX,
          clientY,
        } = e;

        $addPhrase.find('span.phrase').text(text);
        $addPhrase.find('span.translation').text(translation);

        $addPhrase
          .css({
            left: clientX - ($addPhrase.width() / 2),
            top: clientY + 20,
          })
          .addClass('is_active');
      }
    })
    .on('touchend', () => {
      console.log('touchend');
      const sel = window.getSelection();

      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);

        if (range.toString()) {
          const selParentEl = range.commonAncestorContainer;

          if (selParentEl.nodeType === 3) {
            alert(`touchend: ${sel.toString()}`);
          }
        }
      }
    });

  $addPhrase
    .on('click', 'button.close', () => {
      $addPhrase.removeClass('is_active');
    })
    .on('click', 'button.save', async () => {
      const phrase = $addPhrase.find('.phrase').text().trim();
      const translation = $addPhrase.find('.translation').text().trim();

      let isGreenLight = true;

      if (!phrase) {
        isGreenLight = false;
        alert('No phrase');
      }

      if (!translation) {
        isGreenLight = false;
        alert('No translation');
      }

      if (!isGreenLight) {
        return false;
      }

      $addPhrase.removeClass('is_active');

      /*
      const resultAddUserPhrase = await makeRequest({
        method: 'POST',
        url: URL_SAVE_USER_PHRASE,

        body: {
          phrase,
          translation,
        },
      });

      if (!resultAddUserPhrase || !resultAddUserPhrase.status) {
        alert(resultAddUserPhrase.message || `Cant makeRequest ${URL_SAVE_USER_PHRASE}`);
        return false;
      }
      */
    });
});

const autoSelectText = () => {
  const s = window.getSelection();
  const range = s.getRangeAt(0);
  const node = s.anchorNode;

  while (range.toString().indexOf(' ') !== 0) {
    if (!range.startOffset) {
      break;
    }

    range.setStart(node, range.startOffset - 1);
  }

  range.setStart(node, range.startOffset + 1);

  while (
    range.toString().indexOf(' ') === -1 &&
    range.toString().trim() !== '' &&
    range.endOffset + 1 < s.baseNode.wholeText.length
  ) {
    range.setEnd(node, range.endOffset + 1);
  }

  // remove extra space
  range.setEnd(node, range.endOffset - 1);

  // remove last selection if is not letter or number
  const lastChar = range.toString().charAt(range.toString().length - 1);
  if (!/^[a-zA-Z0-9]*$/.test(lastChar)) {
    range.setEnd(node, range.endOffset - 1);
  }

  return range.toString().trim();
};

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

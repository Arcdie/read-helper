/* global
functions, makeRequest,
objects, PDFViewerApplication,
*/

/* Constants */

const URL_GET_BOOK_BY_ID = '/api/books';
const URL_SAVE_USER_PHRASE = '/api/user-phrases';
const URL_TRANSLATE_PHRASE = '/api/quizlet/translate-phrase';

/* JQuery */

const $addPhrase = $('.add-phrase');
const $readBookContainer = $('.read-book-legacy');

$(document).ready(async () => {
  try {
    const bookId = location.pathname.split('/')[2];

    const resultGetBook = await makeRequest({
      method: 'GET',
      url: `${URL_GET_BOOK_BY_ID}/${bookId}`,
    });

    if (!resultGetBook || !resultGetBook.status) {
      alert(resultGetBook.message || `Cant makeRequest ${URL_GET_BOOK_BY_ID}`);
      return false;
    }

    const bookDoc = resultGetBook.result;
    const pathToFile = `/books/${bookDoc._id}/book-file.pdf`;

    await PDFViewerApplication.open(pathToFile);

    // PDFViewerApplication.pdfLinkService.goToPage(2);
    // PDFViewerApplication.pdfViewer.currentPageNumber

    document.title = `Book ${bookDoc.name}`;

    $readBookContainer
      .on('click', async (e) => {
        const text = autoSelectText();

        if (text) {
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
              top: clientY + 20,
            })
            .addClass('is_active');
        }
      });
      /*
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
      */

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
      });
  } catch (err) {
    alert(err.message);
  }
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

const processPage = pageIndex => {
  // console.log('processPage', pageIndex);
  const $page = $readBookContainer.find('.page').eq(pageIndex);

  if ($page.hasClass('is_processed')) {
    return true;
  }

  const $rows = $page.find('span[role="presentation"]');

  $rows.each((index, span) => {
    const $span = $(span);
    // console.log('$span', $span);

    const text = $span.text();
    const arrWords = text.split(' ');

    let newStr = '';

    arrWords.forEach(word => {
      let validWord = word;

      if (!word || [',', '.', '-', ' '].includes(word)) {
        newStr += word;
        return true;
      }

      const lWord = validWord.length;

      if (validWord[lWord - 1] === ',') {
        validWord = validWord.substring(0, lWord - 1);
      }

      newStr += `<q>${validWord}</q>`;
    });

    // console.log('newStr', newStr);

    $span.html(newStr);
  });
};

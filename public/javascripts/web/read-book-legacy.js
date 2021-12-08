/* global
functions, makeRequest,
objects, PDFViewerApplication,
*/

/* Constants */

const URL_GET_BOOK_BY_ID = '/api/books';
const URL_GET_USER_PHRASES = '/api/user-phrases';
const URL_SAVE_USER_PHRASE = '/api/user-phrases';
const URL_TRANSLATE_PHRASE = '/api/phrase-translations/translate-phrase';

let bookDoc;
let phraseArr = [];
let userPhrases = [];
const processedPages = [];

/* JQuery */

const $addPhrase = $('.add-phrase');
const $readBookContainer = $('.read-book-legacy');

const isTouchScreen = 'ontouchstart' in window || navigator.msMaxTouchPoints;

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

    const resultGetUserPhrases = await makeRequest({
      method: 'GET',
      url: URL_GET_USER_PHRASES,
      query: {
        bookId: resultGetBook.result._id,
      },
    });

    if (!resultGetUserPhrases || !resultGetUserPhrases.status) {
      alert(resultGetBook.message || `Cant makeRequest ${URL_GET_USER_PHRASES}`);
      return false;
    }

    bookDoc = resultGetBook.result;
    userPhrases = resultGetUserPhrases.result;
    const pathToFile = `/books/${bookDoc._id}/book-file.pdf`;

    await PDFViewerApplication.open(pathToFile);

    // PDFViewerApplication.pdfLinkService.goToPage(2);
    // PDFViewerApplication.pdfViewer.currentPageNumber

    PDFViewerApplication.pdfOutlineViewer.eventBus._on('pagerendered', () => {
      const currentPage = PDFViewerApplication.pdfViewer.currentPageNumber;

      setTimeout(() => {
        processPage(currentPage - 1);
      }, 2000);
    });

    PDFViewerApplication.pdfOutlineViewer.eventBus._on('pagechanging', evt => {
      const { pageNumber } = evt;

      const doesPageNumberProcessed = processedPages.includes(pageNumber - 1);

      if (!doesPageNumberProcessed) {
        processPage(pageNumber - 1);
      }
    });

    document.title = `Book ${bookDoc.name}`;

    const eventName = isTouchScreen ? 'dblclick' : 'mouseup';

    $readBookContainer
      .on('click', e => {
        if (!['a', 'span'].includes(e.target.localName)) {
          refuseChoice();
        }
      });

    if (!isTouchScreen) {
      $readBookContainer
        .on(eventName, 'span', async function (e) {
          const $this = $(this);

          if ($this.attr('class')) {
            return true;
          }

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

          if (e.target.localName === 'a') {
            const wordText = $target.text().trim();
            const choosenWord = sentence[lWords - 1].trim();

            if (wordText !== choosenWord) {
              sentence[lWords - 1] = wordText;
              text = sentence.join(' ');
            }
          }

          text = text.replace(/[.,]/g, '');

          // const translation = 'Ева, не стучи';
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
        });
    } else {
      $readBookContainer
        .on('touchend', 'span a', async function (e) {
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

          const translation = 'Ева, не стучи';
          // const translations = await translatePhrase(text);
          // const translation = translations ? translations[0] : '';

          $addPhrase.find('span.phrase').text(text);
          $addPhrase.find('span.translation').text(translation);

          $addPhrase
            .css({
              left: e.changedTouches[0].pageX - ($addPhrase.width() / 2),
              top: e.changedTouches[0].pageY + 20,
            })
            .addClass('is_active');
        });
    }

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
          refuseChoice();
          return false;
        }

        $addPhrase.removeClass('is_active');

        const resultAddUserPhrase = await makeRequest({
          method: 'POST',
          url: URL_SAVE_USER_PHRASE,

          body: {
            phrase,
            translation,
            bookId: bookDoc._id,
          },
        });

        if (!resultAddUserPhrase || !resultAddUserPhrase.status) {
          refuseChoice();
          alert(resultAddUserPhrase.message || `Cant makeRequest ${URL_SAVE_USER_PHRASE}`);
          return false;
        }

        phraseArr.forEach(word => {
          word.$elem.addClass('is_vocabulary');
        });

        refuseChoice();
      });
  } catch (err) {
    alert(err.message);
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

  $readBookContainer
    .find('a.is_working')
    .removeClass('is_working');
};

const processPage = pageIndex => {
  const $page = $readBookContainer.find('.page').eq(pageIndex);

  if (processedPages.includes(pageIndex)) {
    return true;
  }

  const $rows = $page.find('span[role="presentation"]');

  $rows.each((index, span) => {
    const $span = $(span);
    const text = $span.text();
    const arrWords = text.split(' ');

    let newText = '';

    arrWords.forEach(word => {
      const isVocabulary = userPhrases.some(bound => bound.phrase === word) ? 'is_vocabulary' : '';
      newText += `<a class="${isVocabulary}">${word}</a> `;
    });

    $span.html(newText);
  });

  processedPages.push(pageIndex);
};

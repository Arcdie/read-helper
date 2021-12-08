/* global
functions, makeRequest,
objects, PDFViewerApplication,
*/

/* Constants */

const URL_GET_BOOK_BY_ID = '/api/books';
const URL_SAVE_USER_PHRASE = '/api/user-phrases';
const URL_TRANSLATE_PHRASE = '/api/phrase-translations/translate-phrase';

const processedPages = [];

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

    PDFViewerApplication.pdfOutlineViewer.eventBus._on('pagerendered', () => {
      setTimeout(() => {
        const currentPage = PDFViewerApplication.pdfViewer.currentPageNumber;
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

    $readBookContainer
      .on('click', e => {
        if (!['a', 'span'].includes(e.target.localName)) {
          $addPhrase.removeClass('is_active');
        }
      })
      .on('click', 'span a', async function (e) {
        const text = $(this).text();

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
      .on('touchend', (e) => {
        const sel = window.getSelection();

        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);

          if (range.toString()) {
            const selParentEl = range.commonAncestorContainer;

            if (selParentEl.nodeType === 3) {
              const text = sel.toString();

              if (!text) {
                return true;
              }

              const lWords = text.split(' ');

              if (lWords > 5) {
                return true;
              }

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
      newText += `<a>${word}</a> `;
    });

    $span.html(newText);
  });

  processedPages.push(pageIndex);
};

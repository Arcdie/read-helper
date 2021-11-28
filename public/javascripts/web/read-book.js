/* global
functions, makeRequest,
objects, PDFViewerApplication,
*/

/* Constants */

const URL_GET_BOOK_BY_ID = '/api/books';
const URL_SEND_MESSAGE = '/api/test/message';

const processedPages = [];

/* JQuery */

const $readBookContainer = $('.read-book');

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

    /*
    PDFViewerApplication.pdfOutlineViewer.eventBus._on('pagerendered', () => {
      setTimeout(() => {
        const currentPage = PDFViewerApplication.pdfViewer.currentPageNumber;
        // processPage(currentPage - 1);
      }, 3000);
    });

    PDFViewerApplication.pdfOutlineViewer.eventBus._on('pagechanging', evt => {
      const { pageNumber } = evt;

      const doesPageNumberProcessed = processedPages.includes(pageNumber);

      if (!doesPageNumberProcessed) {
        // processPage(pageNumber - 1);
      }
    });
    */

    /*
    $readBookContainer
      .on('click', () => {
        autoSelectText();

        const selectedText = window.getSelection();
        console.log('selectedText.str', selectedText.toString());
      });
    */
  } catch (err) {
    alert(err.message);
  }
});

const autoSelectText = () => {
  const s = window.getSelection();
  const range = s.getRangeAt(0);
  const node = s.anchorNode;

  while (range.toString().indexOf(' ') !== 0) {
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

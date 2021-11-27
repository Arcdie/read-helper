/* global
functions, makeRequest,
objects,
*/

/* Constants */

const URL_GET_BOOKS = '/api/books';

const BOOKS_ON_SHELF = 5;

/* JQuery */

const $bookshelfContainer = $('.bookshelf-container');

$(document).ready(async () => {
  const resultGetBooks = await makeRequest({
    method: 'GET',
    url: URL_GET_BOOKS,
  });

  if (!resultGetBooks || !resultGetBooks.status) {
    alert(resultGetBooks.message || `Cant makeRequest ${URL_GET_BOOKS}`);
    return false;
  }

  const booksDocs = resultGetBooks.result;
  const lBooks = booksDocs.length;

  const numberShelfs = lBooks / BOOKS_ON_SHELF;
  const queues = getQueue(booksDocs, BOOKS_ON_SHELF);

  let appendStr = '';

  for (let i = 0; i < numberShelfs; i += 1) {
    const targetQueue = queues[i];

    let appendBooksStr = '';

    targetQueue.forEach(bookDoc => {
      appendBooksStr += `<a class="book" href="/books/${bookDoc._id}">
        <img src="${bookDoc.path_to_book}/book-cover-image.png" alt="harry-potter" />
        <p>${bookDoc.name}</p>
      </div>`;
    });

    appendStr += `<div class="shelf">${appendBooksStr}</div>`;
  }

  $bookshelfContainer.append(appendStr);

  const lBooksInLastQueue = queues[queues.length - 1].length;

  const addBookElement = '<a class="add-book" href="/books/add"><img src="/images/add.png" alt="png"></a>';

  if (lBooksInLastQueue < BOOKS_ON_SHELF) {
    $bookshelfContainer.find('.shelf').last().append(addBookElement);
  } else {
    $bookshelfContainer.append(`<div class="shelf">${addBookElement}</div>`);
  }
});

const getQueue = (arr, limiter) => {
  const queues = [];
  const lArr = arr.length;

  let targetIndex = 0;
  const numberIterations = Math.ceil(lArr / limiter);

  for (let i = 0; i < numberIterations; i += 1) {
    const newQueue = [];

    let conditionValue = limiter;

    if (i === (numberIterations - 1)) {
      conditionValue = lArr - targetIndex;
    }

    for (let j = 0; j < conditionValue; j += 1) {
      newQueue.push(arr[targetIndex]);
      targetIndex += 1;
    }

    queues.push(newQueue);
  }

  return queues;
};

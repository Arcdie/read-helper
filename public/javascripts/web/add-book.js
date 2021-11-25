/* global
functions,
objects,
*/

/* Constants */

const URL_SAVE_BOOK = '/api/books';

let bookFile = false;
let bookCoverImage = false;

/* JQuery */
const $bookName = $('.book-name');
const $bookFile = $('.book-file');
const $bookCover = $('.book-cover');

$(document).ready(async () => {
  $bookCover
    .on('change', e => {
      const reader = new FileReader();
      const file = e.target.files[0];
      e.preventDefault();

      reader.onloadend = () => {
        bookCoverImage = file;
      };

      reader.readAsDataURL(file);
    });

  $bookFile
    .on('change', e => {
      const reader = new FileReader();
      const file = e.target.files[0];
      e.preventDefault();

      reader.onloadend = () => {
        bookFile = file;
      };

      reader.readAsDataURL(file);
    });

  $('#save-book')
    .on('click', async () => {
      const bookName = $bookName.val();

      let isGreenLight = true;

      if (!bookName) {
        alert('Book name is required');
        isGreenLight = false;
      }

      if (!bookFile) {
        alert('Please choose book file');
        isGreenLight = false;
      }

      if (!bookCoverImage) {
        alert('Please choose cover image for book');
        isGreenLight = false;
      }

      if (!isGreenLight) {
        return false;
      }

      const formData = new FormData();

      const requestData = {
        bookName,
        bookFile,
        bookCoverImage,
      };

      for (const key in requestData) {
        formData.append(key, requestData[key]);
      }

      let resultSaveBook = await fetch(URL_SAVE_BOOK, {
        method: 'POST',
        body: formData,
      });

      resultSaveBook = await resultSaveBook.json();

      if (!resultSaveBook || !resultSaveBook.status) {
        alert(resultSaveBook.message || `Cant makeRequest ${URL_SAVE_BOOK}`);
        return false;
      }

      location.href = '/';
    });
});

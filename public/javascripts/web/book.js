/* global
functions, makeRequest, copyToClipboard, saveAs
objects,
*/

/* Constants */

const URL_GET_USER_PHRASES = '/api/user-phrases';
const URL_REMOVE_USER_PHRASES = '/api/user-phrases';
const URL_CHANGE_ACTIVE_STATUS_USER_PHRASES = '/api/user-phrases/active';

/* Variables */

const bookId = location.pathname.split('/')[2];

/* JQuery */

const $words = $('.words');
const $navigation = $('.navigation');

$(document).ready(async () => {
  const resultGetPhrases = await makeRequest({
    method: 'GET',
    url: URL_GET_USER_PHRASES,
    query: {
      bookId,
    },
  });

  if (!resultGetPhrases || !resultGetPhrases.status) {
    alert(resultGetPhrases.message || `Cant makeRequest ${URL_GET_USER_PHRASES}`);
    return false;
  }

  const userPhrases = resultGetPhrases.result;

  renderWords(userPhrases);

  $navigation
    .find('button.convert')
    .on('click', async () => {
      let text = '';

      const userPhraseIds = [];

      $words.find('.word').each((index, e) => {
        const $word = $(e);

        const userPhraseId = $word.data('id');
        const isActive = $word.find('.settings input[type="checkbox"]').prop('checked');

        if (isActive) {
          const $inputs = $word.find('.text input[type="text"]');

          const word = $inputs[0].value;
          const translation = $inputs[1].value;

          if (!text) {
            text += `${word}\t${translation}`;
          } else {
            text += `\n${word}\t${translation}`;
          }

          userPhraseIds.push(userPhraseId);
        }
      });

      if (userPhraseIds.length) {
        const resultChangeActiveStatus = await makeRequest({
          method: 'PUT',
          url: URL_CHANGE_ACTIVE_STATUS_USER_PHRASES,

          body: {
            isActive: false,
            userPhraseIds,
          },
        });

        if (!resultChangeActiveStatus || !resultChangeActiveStatus.status) {
          alert(resultChangeActiveStatus.message || `Cant makeRequest ${URL_CHANGE_ACTIVE_STATUS_USER_PHRASES}`);
          return false;
        }

        const file = new File(
          [text],
          'text-for-quizlet.txt',
          { type: 'text/plain;charset=utf-8' },
        );

        saveAs(file);
      }
    });

  $words
    .on('click', 'button.remove', async function () {
      const $word = $(this).closest('.word');
      const phraseId = $word.data('id');

      const resultRemove = await makeRequest({
        method: 'DELETE',
        url: `${URL_REMOVE_USER_PHRASES}/${phraseId}`,
      });

      if (!resultRemove || !resultRemove.status) {
        alert(resultRemove.message || `Cant makeRequest ${URL_REMOVE_USER_PHRASES}`);
        return false;
      }

      $word.remove();
    })
    .on('click', 'input[type="checkbox"]', async function () {
      const $word = $(this).closest('.word');
      const isActive = $(this).prop('checked');
      const userPhraseId = $word.data('id');

      if (isActive) {
        $word.addClass('active');
      } else {
        $word.removeClass('active');
      }

      const resultChangeActiveStatus = await makeRequest({
        method: 'PUT',
        url: URL_CHANGE_ACTIVE_STATUS_USER_PHRASES,

        body: {
          isActive,
          userPhraseIds: [userPhraseId],
        },
      });

      if (!resultChangeActiveStatus || !resultChangeActiveStatus.status) {
        alert(resultChangeActiveStatus.message || `Cant makeRequest ${URL_CHANGE_ACTIVE_STATUS_USER_PHRASES}`);
        return false;
      }
    });
});

const renderWords = (userPhrases = []) => {
  let appendStr = '';

  userPhrases.forEach(userPhrase => {
    appendStr += `<div
      data-id="${userPhrase._id}"
      class="word ${userPhrase.is_active ? 'active' : ''}"
    >
      <div class="text">
        <input type="text" placeholder="Eng" value="${userPhrase.phrase}">
        <span>-></span>
        <input type="text" placeholder="Rus" value="${userPhrase.phrase_translation}">
      </div>

      <div class="settings">
        <input type="checkbox" ${userPhrase.is_active && 'checked="checked"'}>
        <button class="remove">x</button>
      </div>
    </div>`;
  });

  $words.empty().append(appendStr);
};

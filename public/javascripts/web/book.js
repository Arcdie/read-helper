/* global
functions, makeRequest, copyToClipboard
objects,
*/

/* Constants */

const URL_GET_USER_PHRASES = '/api/user-phrases';
const URL_REMOVE_USER_PHRASES = '/api/user-phrases';

/* JQuery */

const $words = $('.words');
const $navigation = $('.navigation');

$(document).ready(async () => {
  const resultGetPhrases = await makeRequest({
    method: 'GET',
    url: URL_GET_USER_PHRASES,
  });

  if (!resultGetPhrases || !resultGetPhrases.status) {
    alert(resultGetPhrases.message || `Cant makeRequest ${URL_GET_USER_PHRASES}`);
    return false;
  }

  const userPhrases = resultGetPhrases.result;

  userPhrases.forEach(userPhrase => {
    userPhrase.is_active = true;
  });

  renderWords(userPhrases);

  $navigation
    .find('button.convert')
    .on('click', () => {
      let text = '';

      $words.find('.word').each((index, e) => {
        const $word = $(e);

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
        }
      });

      const file = new File(
        [text],
        'text-for-quizlet.txt',
        { type: 'text/plain;charset=utf-8' },
      );

      saveAs(file);
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
    });
});

const renderWords = (userPhrases = []) => {
  let appendStr = '';

  userPhrases.forEach(userPhrase => {
    appendStr += `<div class="word" data-id="${userPhrase._id}">
      <div class="text">
        <input type="text" placeholder="Eng" value="${userPhrase.phrase}">
        <span>-></span>
        <input type="text" placeholder="Rus" value="${userPhrase.phrase_translation}">
      </div>

      <div class="settings">
        <input type="checkbox" checked="checked">
        <button class="remove">x</button>
      </div>
    </div>`;
  });

  $words.empty().append(appendStr);
};

/* global
functions, makeRequest,
objects,
*/

/* Constants */

const URL_LOGIN = '/auth/login';

/* JQuery */
const $name = $('#name');
const $login = $('#login');

$(document).ready(async () => {
  $login
    .on('click', async () => {
      const name = $name.val();

      if (!name) {
        $name.css({ borderColor: 'red' });
        alert('Name is required');
        return false;
      }

      const resultLogin = await makeRequest({
        method: 'POST',
        url: URL_LOGIN,
        body: {
          name,
        },
      });

      if (!resultLogin || !resultLogin.status) {
        alert(resultLogin.message || `Cant makeRequest ${URL_LOGIN}`);
        return false;
      }

      location.href = '/';
    });
});

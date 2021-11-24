/* global
functions, makeRequest,
objects,
*/

/* Constants */

const URL_REGISTRATION = '/auth/registration';

/* JQuery */
const $name = $('#name');
const $registration = $('#registration');

$(document).ready(async () => {
  $registration
    .on('click', async () => {
      const name = $name.val();

      if (!name) {
        $name.css({ borderColor: 'red' });
        alert('Name is required');
        return false;
      }

      const resultRegistration = await makeRequest({
        method: 'POST',
        url: URL_REGISTRATION,
        body: {
          name,
        },
      });

      if (!resultRegistration || !resultRegistration.status) {
        alert(resultRegistration.message || `Cant makeRequest ${URL_REGISTRATION}`);
        return false;
      }

      location.href = '/';
    });
});

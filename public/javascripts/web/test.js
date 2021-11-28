/* global
functions,
objects,
*/

/* Constants */

/* JQuery */
const $events = $('.events');

$(document).ready(async () => {
  $('.text')
    .on('tap', () => {
      const text = autoSelectText();
      $events.append(`<span>${text}</span>`);

      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }

      // const selectedText = window.getSelection();
      // alert(selectedText.toString());
    });
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

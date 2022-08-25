var html = require('html-entities');



exports.html_decode = (text) => {
  return html.decode(text);
};

exports.removeStripSpaces = (text) => {
  return text?.replace(/^\s+|\s+$/g, '');
};

exports.extract_text_between = (
  text,
  start,
  end,
  removeHtml = true,
  removeT = false,
  removeRN = false,
  removeN = false,
) => {
  const regex = new RegExp(`(?<=${start})(.*?)(?=${end})`, 'gs');
  const results = String(text).match(regex);
  //remove html
  if (results && results.length) {
    try {
      let result = results[0].toString();
      if (removeHtml) result = result.toString().replace(/<[^>]*>/g, '');

      if (removeT) result = result.toString().replace(/\t/g, '').replace(/\s+/g, ' ');
      if (removeRN) result = result.toString().replace(/\r\n/g, '').replace(/\s+/g, ' ');
      if (removeN) result = result.toString().replace(/\n/g, '').replace(/\s+/g, ' ');
      return result;
    } catch (e) {
      return null;
    }
  } else return null;
};
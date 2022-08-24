var html = require('html-entities');



exports.html_decode = (text) => {
    return html.decode(text);
  };

  exports.removeStripSpaces = (text) => {
    return text.replace(/^\s+|\s+$/g, '');
  };
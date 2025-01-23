const Handlebars = require('handlebars');

// Registrar el helper 'helperMissing' globalmente
Handlebars.registerHelper('helperMissing', function () {
  if (arguments.length === 1) {
    return undefined;
  } else {
    throw new Error('Missing helper: "' + arguments[arguments.length - 1].name + '"');
  }
});

module.exports = Handlebars;

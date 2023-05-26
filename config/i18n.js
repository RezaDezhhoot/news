const { I18n } = require('i18n');
const path = require('path');
const appDir = path.dirname(require.main.filename);

const i18n = new I18n({
    header: 'accept-language',
    queryParameter: 'lang',
    locales: ['en','fa'],
    defaultLocale: 'en',
    directory: path.join(appDir,'langs'),

});

module.exports = i18n;
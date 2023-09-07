const Yup = require('yup');
const I18n = require('../../../../../config/i18n');

const schema = Yup.object().shape({
    full_name: Yup.string().required(I18n.__("validation.required",I18n.__('fields.name'))).max(255,I18n.__("validation.max",I18n.__('fields.name'),255)),
    city: Yup.string().max(255,I18n.__("validation.max",I18n.__('fields.city'),255)),
    role: Yup.mixed().required(I18n.__("validation.required",I18n.__('fields.role'))).oneOf(['admin','user','administrator'],I18n.__("validation.matches",I18n.__('admin.fields.role'))),
    status: Yup.mixed().required(I18n.__("validation.required",I18n.__('admin.fields.status')))
        .oneOf(['0','1'],I18n.__("validation.matches",I18n.__('admin.fields.status'))),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(3 * 1024 * 1024,I18n.__("validation.max_size",I18n.__('fields.image'),3)),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],I18n.__("validation.matches",I18n.__('admin.fields.image'))),
    }),
});

module.exports = schema;
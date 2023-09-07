const Yup = require('yup');

module.exports = (res) => {
    return Yup.object().shape({
        full_name: Yup.string().required(res.__("validation.required",res.__('fields.name'))).max(255,res.__("validation.max",res.__('fields.name'),255)),
        city: Yup.string().max(255,res.__("validation.max",res.__('fields.city'),255)),
        image: Yup.object().shape({
            name: Yup.string(),
            size: Yup.number().max(3 * 1024 * 1024,res.__("validation.max_size",res.__('fields.image'),3)),
            // mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
        }),
        password: Yup.string().min(6,res.__("validation.min",res.__('fields.password'),6)).max(240,res.__("validation.max",res.__('fields.name'),240)).required(res.__("validation.required",res.__('fields.password'))),
        floatingConfirmation: Yup.string().required(res.__("validation.required",res.__('fields.floating_confirmation'))).oneOf([Yup.ref('password'),null],res.__("validation.matches",res.__('fields.password'))),
    });
};
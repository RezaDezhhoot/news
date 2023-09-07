const Yup = require('yup');
const {validPhone} = require('../../../../../Base/Constants/Regex');

module.exports = (res) => {
    return Yup.object().shape({
        phone: Yup.string().required(res.__("validation.required",res.__('fields.phone'))).matches(validPhone,{
            message: res.__("validation.pattern",res.__('fields.phone'))
        }),
        password: Yup.string().required(res.__("validation.required",res.__('fields.password'))),
    });
};
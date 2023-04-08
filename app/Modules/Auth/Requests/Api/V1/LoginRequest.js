const Yup = require('yup');
const {validPhone} = require('../../../../../Base/Constants/Regex');
const schema = Yup.object().shape({
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches(validPhone),
    password: Yup.string().required('رمز عبور الزامی می باشد'),
});

module.exports = schema;
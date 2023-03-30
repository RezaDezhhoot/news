const Yup = require('yup');
const schema = Yup.object().shape({
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches(/(0|\\+?\\d{2})(\\d{7,8})/),
    password: Yup.string().min(4).max(240).required('رمز عبور الزامی می باشد'),
});

module.exports = schema;
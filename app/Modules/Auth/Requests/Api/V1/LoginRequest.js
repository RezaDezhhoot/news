const Yup = require('yup');
const schema = Yup.object().shape({
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches('^(\\98?)?{?(0?9[0-9]{9,9}}?)$'),
    password: Yup.string().required('رمز عبور الزامی می باشد'),
});

module.exports = schema;
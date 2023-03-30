const Yup = require('yup');
const schema = Yup.object().shape({
    phone: Yup.string().matches('^(\\98?)?{?(0?9[0-9]{9,9}}?)$').required('شماره همراه الزامی می باشد'),
    code: Yup.number().required('کد تایید الزامی می باشد'),
});

module.exports = schema;
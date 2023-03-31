const Yup = require('yup');
const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches('^(\\98?)?{?(0?9[0-9]{9,9}}?)$'),
    password: Yup.string().min(6,'حداقل طول برای رمز عبور 6 حرف می باشد').max(240).required('رمز عبور الزامی می باشد'),
    email: Yup.string().email('ادرس ایمیل نامعتبر می باشد'),
    floatingConfirmation: Yup.string().required().oneOf([Yup.ref('password'),null],"رمز عبور وارد شده معتبر نمی باشد"),
});

module.exports = schema;
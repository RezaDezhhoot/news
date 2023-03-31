const Yup = require('yup');
const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches('^(\\98?)?{?(0?9[0-9]{9,9}}?)$'),
    email: Yup.string().email('ادرس ایمیل نامعتبر می باشد'),
    role: Yup.mixed().required('فیلذ نقش الزامی می باشد').oneOf(['admin','user'],'نقش انتخاب شده نامعتبر می باشد'),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 3,'حداکثر حجم تصویر 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    })
});

module.exports = schema;
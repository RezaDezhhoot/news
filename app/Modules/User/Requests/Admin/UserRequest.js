const Yup = require('yup');
const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    city: Yup.string().required('شهر الزامی می باشد').max(255,'حداکثر طول برای شهر رعایت نشده است'),
    role: Yup.mixed().required('فیلذ نقش الزامی می باشد').oneOf(['admin','user','administrator'],'نقش انتخاب شده نامعتبر می باشد'),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 3,'حداکثر حجم تصویر 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    })
});

module.exports = schema;
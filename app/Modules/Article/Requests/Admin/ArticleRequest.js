const Yup = require('yup');
const schema = Yup.object().shape({
    title: Yup.string().required('عنوان الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    description: Yup.string().required('متن اصلی الزامی می باشد'),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 50,'حداکثر حجم تصویر 50 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    }),
    video: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 100,'حداکثر حجم ویدئو 100 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['video/mp4','video/x-msvideo','video/x-flv','video/x-ms-wmv'],'ویدئو ارسالی نامعتر'),
    }),
});

module.exports = schema;
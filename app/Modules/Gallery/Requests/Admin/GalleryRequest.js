const Yup = require('yup');
const {VIDEO, IMAGE} = require("../../Enums/Priority");
const schema = Yup.object().shape({
    title: Yup.string().required('عنوان الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    category: Yup.string(),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    priority: Yup.mixed().required('فیلذ نمایش الزامی می باشد').oneOf([VIDEO,IMAGE],'نمایش انتخاب شده نامعتبر می باشد'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 3,'حداکثر حجم تصویر 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    }),
    video: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 100,'حداکثر حجم ویدئو 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['video/mp4','video/x-msvideo','video/x-flv','video/x-ms-wmv'],'ویدئو ارسالی نامعتر'),
    }),
});

module.exports = schema;
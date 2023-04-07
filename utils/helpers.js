const jwt = require("jsonwebtoken");
const moment = require('jalali-moment');
const path = require("path");
const appDir = path.dirname(require.main.filename);
const fs = require('fs');
const sharp = require("sharp");
const multer = require('multer');
const User = require('../app/Modules/User/Models/User');

module.exports.normalizeIranianPhoneNumber = (phone) => {
    return phone.startsWith('0') || phone.startsWith('98') ? phone : '0' + phone;
}

module.exports.getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.getErrors = (exception) => {
    const errorArr = [];
    let status = 500;
    if (typeof exception.inner !== "undefined") {
        exception.inner.forEach(e => {
            errorArr.push({
                filed: e.path,
                message: e.message
            });
        });
        status = 422;
    } else {
        errorArr.push({
            filed: 'unKnow',
            message: exception
        });
    }

    return {
        errors: errorArr,
        status
    };
}

module.exports.makeToken = (user) => {
    return jwt.sign({
            user: { _id: user._id.toString(), phone: user.phone }
        }, process.env.JWT_SECRET
    );
}

exports.formatDate = date => {
    return moment(date).locale("fa").format("D MMM YYYY");
}

exports.abort = (code,res) => {
    return res.render(`errors/${code}.ejs`,{
        layout: path.join(appDir,'resources','views','layouts','error'),
    });
}

exports.upload = async (file , filename , folder , with_delete_old = false , old= null) => {
    const uploadPath = `${appDir}/public/storage/${folder}`;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
    }
    if (with_delete_old && old) {
        fs.unlink(`${uploadPath}/${old}`,async (err) => {
            if (err) console.log(err);
            await sharp(file.data).png({
                quality: 60,
            }).toFile(`${uploadPath}/${filename}`).catch(err => {
                console.log(err);
            });
        });
    } else {
        await sharp(file.data).png({
            quality: 60,
        }).toFile(`${uploadPath}/${filename}`).catch(err => {
            console.log(err);
        });
    }
}

exports.asset = (file) => {
    return `${process.env.APP_URL}/storage/${file}`;
}

exports.findUserByToken = async (data) => {
    const token = data.token.split(" ")[1];

    if (token) {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.userId);
        return user;
    } else {
        return false;
    }

}
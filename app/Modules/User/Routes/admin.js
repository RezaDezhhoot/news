const {Router} = require('express');
const {admin} = require('../../Auth/Middlewares/Admin');
const UserController = require('../Controllers/Admin/UserController');

const router = new Router('').use(admin);

router.get('/',UserController.index);

router.get('/edit/:id',UserController.edit);

router.post('/update/:id',UserController.update);

router.get('/delete/:id',UserController.destroy);

exports.routerUserAdmin = router;
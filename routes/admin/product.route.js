const multer = require('multer');
const express = require('express');
const controller = require('../../controllers/admin/product.controller');
const router = express.Router();

const upload = multer();

const uploadCloudMiddleware = require('../../middlewares/admin/uploadCloud.middleware');

const productValidate = require('../../validates/admin/product.validate');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloudMiddleware.Upload,
    productValidate.createPost,
    controller.createPOST
);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    productValidate.createPost,
    controller.editPatch
);

router.get(
    '/detail/:id',
    controller.detail
)


module.exports = router;
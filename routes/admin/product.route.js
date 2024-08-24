const multer = require('multer');
const express = require('express');
const controller = require('../../controllers/admin/product.controller');
const router = express.Router();
const storageMulter = require('../../helpers/storageMulter');
const upload = multer({ storage : storageMulter()  });

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.deleteItem)

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    controller.createPOST
);

module.exports = router;
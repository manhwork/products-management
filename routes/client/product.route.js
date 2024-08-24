const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/product.controller');

router.get('/', controller.index );

router.get('/detail', (req, res) => {
    res.send("Detail");
})

router.get('/delete', (req, res) => {
    res.send("Delete");
})

router.get('/items', (req, res) => {
    res.send("items");
})

module.exports = router;
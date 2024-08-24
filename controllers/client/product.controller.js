const Product = require('../../models/product.model');


// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: false
    }).sort({position : -1});

    products.forEach(item => {
        item.priceNew = (item.price * (1 - item.discountPercentage / 100));
    })

    res.render('client/pages/products/index', {
        pageTitle: "Danh sach san pham",
        products: products
    });
}
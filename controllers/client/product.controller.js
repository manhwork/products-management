const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({ position: -1 });

    const newProducts = productsHelper.newPrice(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts,
    });
};

// [GET] /products/:slug

module.exports.detail = async (req, res) => {
    console.log(req.params.slug);

    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
        };

        const product = await Product.findOne(find);

        res.render("client/pages/products/detail", {
            pageTitle: req.params.slug,
            product: product,
            status: "active",
        });
    } catch (error) {
        res.redirect(`/products`);
    }
};

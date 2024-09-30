const ProductCategory = require("../../models/products-category.model");
const phanCapHelper = require("../../helpers/phanCap");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] /
module.exports.index = async (req, res) => {
    find = {
        deleted: false,
        featured: "1",
        status: "active",
    };
    let productsFeatured = await Product.find(find).limit(6);
    productsFeatured = productsHelper.newPrice(productsFeatured);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        productsFeatured: productsFeatured,
    });
};

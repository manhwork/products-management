const ProductCategory = require("../../models/products-category.model");
const phanCapHelper = require("../../helpers/phanCap");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] /
module.exports.index = async (req, res) => {
    // Hiện thị sản phẩm nổi bật
    find = {
        deleted: false,
        featured: "1",
        status: "active",
    };
    let productsFeatured = await Product.find(find).limit(6);
    productsFeatured = productsHelper.newPrice(productsFeatured);
    // End Hiện thị sản phẩm nổi bật

    // Hiển thị sản phẩm mới nhất
    const newProducts = await Product.find({
        deleted: false,
        status: "active",
    })
        .sort({ position: "desc" })
        .limit(6)
        .lean();

    const newProductsNew = productsHelper.newPrice(newProducts);
    // End Hiển thị sản phẩm mới nhất
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: productsFeatured,
        newProducts: newProductsNew,
    });
};

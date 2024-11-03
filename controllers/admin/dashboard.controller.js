const ProductCategory = require("../../models/products-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/accounts.model");
const User = require("../../models/users.model");

// [GET] /admin/dashboard

module.exports.dashboard = async (req, res) => {
    const statistic = {
        orders: {},
        categoryProduct: {
            total: 0,
            active: await ProductCategory.countDocuments({
                deleted: false,
                status: "active",
            }),
            inactive: parseInt(this.total) - parseInt(this.active),
        },
        products: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        accounts: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };

    // categoryProduct
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false,
    });
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        deleted: false,
        active: "active",
    });
    statistic.categoryProduct.inactive =
        statistic.categoryProduct.total - statistic.categoryProduct.active;

    // products
    statistic.products.total = await Product.countDocuments({ deleted: false });
    statistic.products.active = await Product.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.products.inactive =
        statistic.products.total - statistic.products.active;

    // accounts
    statistic.accounts.total = await Account.countDocuments({ deleted: false });
    statistic.accounts.active = await Account.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.accounts.inactive =
        statistic.accounts.total - statistic.accounts.active;

    // user
    statistic.user.total = await User.countDocuments({ deleted: false });
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.user.inactive = statistic.user.total - statistic.user.active;

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tong quan",
        statistic: statistic,
    });
};

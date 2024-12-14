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
            active: 0,
            inactive: 0,
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

    const [
        categoryProductTotal,
        categoryProductActive,
        productsTotal,
        productsActive,
        accountsTotal,
        accountsActive,
        userTotal,
        userActive,
    ] = await Promise.all([
        ProductCategory.countDocuments({ deleted: false }),
        ProductCategory.countDocuments({ deleted: false, status: "active" }),
        Product.countDocuments({ deleted: false }),
        Product.countDocuments({ deleted: false, status: "active" }),
        Account.countDocuments({ deleted: false }),
        Account.countDocuments({ deleted: false, status: "active" }),
        User.countDocuments({ deleted: false }),
        User.countDocuments({ deleted: false, status: "active" }),
    ]);

    statistic.categoryProduct.total = categoryProductTotal;
    statistic.categoryProduct.active = categoryProductActive;
    statistic.categoryProduct.inactive =
        categoryProductTotal - categoryProductActive;

    statistic.products.total = productsTotal;
    statistic.products.active = productsActive;
    statistic.products.inactive = productsTotal - productsActive;

    statistic.accounts.total = accountsTotal;
    statistic.accounts.active = accountsActive;
    statistic.accounts.inactive = accountsTotal - accountsActive;

    statistic.user.total = userTotal;
    statistic.user.active = userActive;
    statistic.user.inactive = userTotal - userActive;

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic,
    });
};

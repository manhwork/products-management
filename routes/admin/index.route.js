const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const path_admin = systemConfig.prefixAdmin;

    app.use(path_admin + "/dashboard", dashboardRoutes);
    app.use(path_admin + "/products", productRoutes);
    app.use(path_admin + "/products-category", productsCategoryRoutes);
    app.use(path_admin + "/roles", rolesRoutes);
    app.use(path_admin + "/accounts", accountsRoutes);
};

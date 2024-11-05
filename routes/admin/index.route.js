// Routes
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./products-category.route");
const rolesRoutes = require("./roles.route");
const accountsRoutes = require("./accounts.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingsRoutes = require("./settingRoute");
// MiddleWare
const authRequire = require("../../middlewares/admin/auth.require.validate");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const path_admin = systemConfig.prefixAdmin;

    app.use(
        path_admin + "/dashboard",
        authRequire.authRequire,
        dashboardRoutes
    );
    app.use(path_admin + "/products", authRequire.authRequire, productRoutes);
    app.use(
        path_admin + "/products-category",
        authRequire.authRequire,
        productsCategoryRoutes
    );
    app.use(path_admin + "/roles", authRequire.authRequire, rolesRoutes);
    app.use(path_admin + "/accounts", authRequire.authRequire, accountsRoutes);
    app.use(path_admin + "/auth", authRoutes);
    app.use(
        path_admin + "/my-account",
        authRequire.authRequire,
        myAccountRoutes
    );
    app.use(path_admin + "/settings", authRequire.authRequire, settingsRoutes);
};

const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    const path_admin = systemConfig.prefixAdmin;

    app.use(path_admin + '/dashboard',dashboardRoutes);
    app.use(path_admin + '/products',productRoutes);
}
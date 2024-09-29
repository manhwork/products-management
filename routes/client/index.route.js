const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    // ta có thể sử dụng để tất cả các routes đề có middleware đó
    app.use(categoryMiddleWare.categoryMiddleWare);

    app.use("/", homeRoutes);

    app.use("/products", productsRoutes);
};

// Router 
const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");

// middleware
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
    // ta có thể sử dụng để tất cả các routes đề có middleware đó
    app.use(categoryMiddleWare.categoryMiddleWare);

    app.use(cartMiddleWare.cartId);

    app.use("/", homeRoutes);

    app.use("/products", productsRoutes);

    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);
};

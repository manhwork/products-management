// Router
const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutroutes = require("./checkout.route");
const userRoutes = require("./user.route");

// middleware
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const userMiddlerWare = require("../../middlewares/client/userMiddleware");

module.exports = (app) => {
    // ta có thể sử dụng để tất cả các routes đều có middleware đó
    app.use(categoryMiddleWare.categoryMiddleWare);

    app.use(cartMiddleWare.cartId);

    app.use(userMiddlerWare.userInfo);

    app.use("/", homeRoutes);

    app.use("/products", productsRoutes);

    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutroutes);

    app.use("/user", userRoutes);
};

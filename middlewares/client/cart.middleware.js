const Cart = require("../../models/cart.model.js");

module.exports.cartId = async (req, res, next) => {
    // console.log(req.cookies.cartId);

    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        // console.log(cart)
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
    }

    next();
}
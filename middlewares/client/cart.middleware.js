const Cart = require("../../models/cart.model.js");

module.exports.cartId = async (req, res, next) => {
    // console.log(req.cookies.cartId);

    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();
        // console.log(cart)
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        })

        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);


        res.locals.miniCart = cart;
        // console.log(cart);
    }

    next();
}
const { parse } = require("dotenv");
const Cart = require("../../models/cart.model");


// [GET] /cart/productId

module.exports.index = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    // console.log(cartId);
    // console.log(productId);
    // console.log(quantity);


    const cart = await Cart.findOne({
        _id: cartId,
    })

    const cartProducts = cart.products.map(item => item.product_id);
    // console.log(cartProducts);
    if (cartProducts.includes(productId)) {
        const index = cartProducts.indexOf(productId);
        // console.log(index);
        const newQuantity = quantity + parseInt(cart.products[index].quantity);


        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            'products.$.quantity': newQuantity,
        })
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
        };
        await Cart.updateOne({
            _id: cartId,
        }, {
            $push: {
                products: objectCart,
            }
        })
    }



    req.flash("success", "Thêm giỏ hàng thành công !");

    res.redirect("back");
}
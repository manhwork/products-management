const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
// [GET] /checkout

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId,
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            let productInfo = await Product.findOne({
                _id: item.product_id,
            });
            item.productInfo = productInfo;
            item.productInfo.priceNew =
                item.productInfo.price *
                (1 - item.productInfo.discountPercentage / 100);
        }
        const totalPrice = cart.products.reduce(
            (sum, item) => sum + item.quantity * item.productInfo.priceNew,
            0
        );
        cart.totalPrice = totalPrice;
    }

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        record: cart,
    });
};

// [POST] /checkout/order

module.exports.orderPost = async (req, res) => {
    const userInfo = req.body;
    const cart_id = req.cookies.cartId;
    let products = [];
    const cart = await Cart.findOne({
        _id: cart_id,
    });
    for (const item of cart.products) {
        const product = await Product.findOne({
            _id: item.product_id,
            deleted: false,
            stock: { $gt: 0 },
        });
        const objectProduct = {
            product_id: item.product_id,
            price: product.price,
            discountPercentage: product.discountPercentage,
            quantity: item.quantity,
        };
        products.push(objectProduct);
    }

    const data = {
        cart_id: cart_id,
        userInfo: userInfo,
        products: products,
    };

    const order = new Order(data);
    await order.save();

    await Cart.updateOne(
        {
            _id: cart_id,
        },
        {
            products: [],
        }
    );

    req.flash("success", "Đặt hàng thành công ");
    res.redirect(`/checkout/order/success/${order.id}`);
};

// [GET] /checkout/order/success/:id

module.exports.orderSuccess = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId,
    });

    if (order.products.length > 0) {
        for (const item of order.products) {
            let productInfo = await Product.findOne({
                _id: item.product_id,
            });
            item.productInfo = productInfo;
            item.productInfo.priceNew =
                item.productInfo.price *
                (1 - item.productInfo.discountPercentage / 100);
        }
        const totalPrice = order.products.reduce(
            (sum, item) => sum + item.quantity * item.productInfo.priceNew,
            0
        );
        order.totalPrice = totalPrice;
    }

    res.render("client/pages/checkout/checkoutSuccess.pug", {
        order: order,
        pageTitle: "Đặt hàng thành công",
    });
};

const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
// [GET] /cart

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

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        record: cart,
    });
};

// [POST] /cart/add/productId

module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId,
    });
    // Khi thêm một sản phẩm đã có trong giỏ hàng thì cập nhật thêm số lượng
    const cartProducts = cart.products.map((item) => item.product_id);
    // console.log(cartProducts);
    if (cartProducts.includes(productId)) {
        const index = cartProducts.indexOf(productId);
        const newQuantity = quantity + parseInt(cart.products[index].quantity);

        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId,
            },
            {
                "products.$.quantity": newQuantity, // $ trên dòng này là là toán tử định vị (positional operator) trong MongoDB, được sử dụng để chỉ mục phần tử trong mảng products mà điều kiện trên đã khớp.
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity,
        };
        await Cart.updateOne(
            {
                _id: cartId,
            },
            {
                $push: {
                    products: objectCart,
                },
            }
        );
    }

    req.flash("success", "Thêm giỏ hàng thành công !");

    res.redirect("back");
};

// [GET] /cart/delete/:id

module.exports.delete = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({
            _id: cartId,
        });
        if (cart.products.length > 0) {
            await Cart.updateOne(
                {
                    _id: cartId,
                },
                {
                    $pull: { products: { product_id: req.params.id } },
                }
            );
            req.flash("success", "Bạn đã xoá thành công sản phẩm !");
            res.redirect(`back`);
        } else {
            req.flash("error", "Lỗi");
            res.redirect(`/cart`);
        }
    } catch (error) {
        req.flash("error", "Xoá thất bại sản phẩm ");
        res.redirect(`/cart`);
    }
};

// [GET] /cart/update/productId/quantity

module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const quantity = req.params.quantity;
    const productId = req.params.productId;

    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId,
        },
        {
            "products.$.quantity": quantity,
        }
    );

    req.flash("success", "Đã cập nhật số lượng");
    res.redirect("back");
};

module.exports.newPrice = (products) => {
    products.forEach((item) => {
        item.priceNew = item.price * (1 - item.discountPercentage / 100);
    });
    return products;
};

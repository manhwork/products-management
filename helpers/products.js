module.exports.newPrice = (products) => {
    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage / 100);
    }
    return products;
};

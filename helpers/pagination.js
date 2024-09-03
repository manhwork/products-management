module.exports = (objectPagiantion, req, countProducts) => {
  if (req.query.page) {
    objectPagiantion.currentPage = parseInt(req.query.page);
  }

  objectPagiantion.countProducts = countProducts;
  objectPagiantion.productsSkip =
    (objectPagiantion.currentPage - 1) * objectPagiantion.productsLimit;
  objectPagiantion.totalpages = Math.ceil(
    countProducts / objectPagiantion.productsLimit
  );
  return objectPagiantion;
};

const ProductCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find).sort({ position: -1 });

  res.render("admin/pages/products-category/index", {
    pageTitle: "Products Category",
    records: records,
  });
};

// [GET] /admin/products-category/create

module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Products Category Create",
  });
};

// [POST] /admin/products-category/create

module.exports.createPOST = async (req, res) => {
  if (req.body.position == "") {
    // Tìm ra vị trí lớn nhất
    const maxPosition = await ProductCategory.find({
      deleted: false,
    })
      .sort({ position: -1 })
      .limit(1);
    req.body.position = parseInt(maxPosition[0].position) + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  req.flash("success", `Tạo sản phẩm thành công !`);

  res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
};

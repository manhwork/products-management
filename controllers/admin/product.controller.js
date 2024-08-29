const Product = require('../../models/product.model');
const statusFilterHelper = require('../../helpers/statusFilter');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');
const systemConfig = require('../../config/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {

    // Status filter
    const find = {
        deleted: false
    };

    statusFilter = statusFilterHelper(req);

    if (req.query.status) {
        find.status = req.query.status;
    }

    // End Status filter

    // Search
    const objectSearch = searchHelper(req);

    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    // End search 

    // Pagination 
    const countProducts = await Product.countDocuments(find);

    let objectPagiantion = paginationHelper({
        productsLimit: 5,
        currentPage: 1,
    }, req, countProducts);

    // Sort
    const selectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
        selectSort[req.query.sortKey] = req.query.sortValue;
        // Thêm vào object selectSort
    }
    else {
        selectSort.position = -1;
    }
    // End Sort


    const products = await Product.find(find)
        .sort(selectSort)
        .limit(objectPagiantion.productsLimit)
        .skip(objectPagiantion.productsSkip);
    // End Pagination


    res.render('admin/pages/product/index', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        statusFilter: statusFilter,
        keyword: objectSearch.keyword,
        objectPagiantion: objectPagiantion
    });
};

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật thành công !");

    res.redirect('back');
}


// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');


    switch (type) {
        case 'active':
            await Product.updateMany({ _id: { $in: ids } }, { status: 'active' })
            req.flash("success", `Cập nhật trạng thái hoạt động thành công ${ids.length} sản phẩm !`);
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids } }, { status: 'inactive' })
            req.flash("success", `Cập nhật trạng thái dừng hoạt động thành công ${ids.length} sản phẩm !`);
            break;
        case 'delete':
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            })
            req.flash("success", `Xoá thành công ${ids.length} sản phẩm !`);
            break;
        case 'change-position':
            ids.forEach(async element => {
                const [id, position] = element.split('-');
                await Product.updateOne({ _id: id }, { position: position });
            });
            req.flash("success", `Cập nhật thành công vị trí ${ids.length} sản phẩm !`);
            break;
        default:
            break;
    }


    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });

    res.redirect('back');
}

// [GET] /admin/products/create

module.exports.create = async (req, res) => {
    res.render('admin/pages/product/create');
}

// [POST] /admin/products/create

module.exports.createPOST = async (req, res) => {

    if (req.body) {

        if (req.body.price) {
            req.body.price = parseInt(req.body.price);
        }

        if (req.body.discountPercentage) {
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
        }

        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock);
        }


        if (req.body.position == "") {
            const maxPosition = await Product.countDocuments({ deleted: false });
            req.body.position = maxPosition + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }

        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`
        // }


        // console.log(req.body);

        const product = new Product(req.body);
        await product.save();

        req.flash("success", `Tạo sản phẩm thành công !`);

        res.redirect(`${systemConfig.prefixAdmin}/products/`);

    }
}


// [GET] /admin/products/edit 

module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }

        const product = await Product.findOne(find);

        res.render(
            'admin/pages/product/edit',
            {
                product: product,
            }
        );
    }
    catch (error) {

        req.flash('error', 'Vui lòng chọn lại sản phẩm cần sửa !')

        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}


// [PATCH] /admin/products/edit 

module.exports.editPatch = async (req, res) => {

    // console.log(req.body);

    req.body.price = parseInt(req.body.price);

    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    req.body.stock = parseInt(req.body.stock);


    if (req.body.position == "") {
        const maxPosition = await Product.countDocuments({ deleted: false });
        req.body.position = maxPosition + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        await Product.updateOne({ _id: req.params.id }, req.body);

        req.flash('success', 'Cập nhật sản phẩm thành công!')

    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại !')
    }

    res.redirect(`back`);
}




// [GET] /admin/products/detail 

module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }

        const product = await Product.findOne(find);

        res.render(
            'admin/pages/product/detail',
            {
                product: product,
            }
        );
    }
    catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}
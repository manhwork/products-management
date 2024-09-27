const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const md5 = require("md5");
const Role = require("../../models/roles.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false,
    }).select("-password -token");

    for (const record of records) {
        record.role = await Role.findOne({
            deleted: false,
            _id: record.role_id,
        });
    }

    for (const item of records) {
        if (item.createdBy) {
            const user = await Account.findOne({
                _id: item.createdBy.account_id,
            });
            if (user) {
                item.fullNameAcc = user.fullName;
                // console.log(user);
            }
        }
        if (item.updatedBy) {
            const userUpdate = item.updatedBy[item.updatedBy.length - 1];
            item.userUpdate = userUpdate;
            const data = await Account.findOne({
                id: item.updatedBy.account_id,
            });
            item.fullNameUpdate = data.fullName;
        }
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Quản lý tài khoản",
        records: records,
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const emailExist = await Account.findOne({
            deleted: false,
            email: req.body.email,
        });
        if (emailExist) {
            req.flash("success", `Email ${req.body.email} đã tồn tại !`);
            res.redirect("back");
        } else {
            const createdBy = {};
            createdBy.account_id = res.locals.user.id;
            // console.log(createdBy);
            req.body.createdBy = createdBy;
            // console.log(req.body);
            const records = new Account(req.body);
            await records.save();
            req.flash("success", `Tạo tài khoản thành công !`);
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        req.flash("error", `Tạo tài khoản thất bại !`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const roles = await Role.find({
            deleted: false,
        });

        const data = await Account.findOne({
            _id: req.params.id,
            deleted: false,
        });
        // console.log(data);
        res.render("admin/pages/accounts/edit.pug", {
            pageTitle: "Sửa tài khoản",
            roles: roles,
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id,
    };
    try {
        const emailExist = await Account.findOne({
            deleted: false,
            email: req.body.email,
            _id: { $ne: req.params.id },
        });
        if (emailExist) {
            req.flash("error", `Đã tồn tại email ${req.body.email} !`);
            res.redirect("back");
        } else {
            if (!req.body.password) {
                delete req.body.password;
            } else {
                req.body.password = md5(req.body.password);
            }
            const updatedBy = {
                account_id: res.locals.user.id,
            };
            await Account.updateOne(find, {
                ...req.body,
                $push: { updatedBy: updatedBy },
            });
            req.flash(
                "success",
                `Cập nhật tài khoản ${req.body.email} thành công`
            );
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", `Cập nhật tài khoản ${req.body.email} thất bại !`);
        res.redirect("back");
    }
};

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const user = await Account.findOne({ _id: req.params.id });

        await Account.updateOne(
            {
                _id: req.params.id,
            },
            {
                deleted: true,
                // deletedAt: new Date(),
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                },
            }
        );
        req.flash("success", `Xóa thành công tài khoản ${user.email} `);
        res.redirect("back");
    } catch (error) {
        req.flash("error", `Xóa không thành công tài khoản ${user.email}`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

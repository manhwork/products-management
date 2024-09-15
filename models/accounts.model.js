const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const generate = require("../helpers/generate");

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: generate.generateRandomString(20),
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Account = mongoose.model("Account", roleSchema, "accounts");

module.exports = Account;

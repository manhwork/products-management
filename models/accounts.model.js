const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const generate = require("../helpers/generate");

mongoose.plugin(slug);

const accountSchema = new mongoose.Schema(
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
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        // deletedAt: Date,
        createdBy: {
            account_id: String,
            createdAt: {
                type: Date,
                default: new Date(),
            },
        },
        role_id: String,
        deletedBy: {
            account_id: String,
            deletedAt: Date,
        },
        updatedBy: [
            {
                account_id: String,
                updatedAt: {
                    type: Date,
                    default: new Date(),
                },
            },
        ],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;

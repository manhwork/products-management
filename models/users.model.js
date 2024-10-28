const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const generate = require("../helpers/generate");

mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        tokenUser: {
            type: String,
            default: generate.generateRandomString(20),
        },
        phone: String,
        avatar: String,
        status: {
            type: String,
            default: "active",
        },
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

const User = mongoose.model("User", userSchema, "users");

module.exports = User;

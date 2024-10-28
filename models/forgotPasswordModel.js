const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            // expires: 11,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

const ForgotPassword = mongoose.model(
    "ForgotPassword",
    forgotPasswordSchema,
    "forgotpassword"
);

module.exports = ForgotPassword;

const Chat = require("../../models/chatModel");
const User = require("../../models/users.model");
// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const currentUser = res.locals.user;
    // Kết nối Socket.IO
    _io.once("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);
        // Bắt sự kiện bên Client
        socket.on("CLIENT_SEND_MESSAGE", async (message) => {
            // Lưu vào CSDL
            const chat = new Chat({
                user_id: userId,
                content: message,
            });
            await chat.save();
            // Trả lại data ra Client
            _io.emit("SERVER_SEND_MESSAGE", {
                content: message,
                user: currentUser,
            });
        });
    });
    // End Socket.IO
    const chats = await Chat.find({
        deleted: false,
    });
    for (const chat of chats) {
        const user = await User.findOne({
            _id: chat.user_id,
        });
        chat.infoUser = user;
    }
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    });
};

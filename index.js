const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const moment = require("moment");
const database = require("./config/database");
const systemConfig = require("./config/system");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

require("dotenv").config();

const app = express();
const server = createServer(app);
const io = new Server(server);

// Middleware cho ứng dụng
app.use(cookieParser("CXHVASJFHGAISDJFHG")); // Middleware để phân tích cú pháp cookie với khóa bí mật
app.use(session({ cookie: { maxAge: 60000 } })); // Middleware để quản lý session với thời gian sống của cookie là 60 giây
app.use(flash()); // Middleware để hiển thị các thông báo flash
app.use(methodOverride("_method")); // Middleware để hỗ trợ phương thức HTTP PUT và DELETE trong các trình duyệt không hỗ trợ
app.use(bodyParser.urlencoded({ extended: false })); // Middleware để phân tích cú pháp body của yêu cầu HTTP
app.use(express.static(`${__dirname}/public`)); // Middleware để phục vụ các tệp tĩnh từ thư mục 'public'
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
); // Middleware để phục vụ TinyMCE từ thư mục node_modules

// Thiết lập các biến cục bộ cho ứng dụng
app.locals.moment = moment; // Thiết lập biến moment để sử dụng trong các view Pug
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Thiết lập tiền tố admin cho các route

// Cấu hình view engine
app.set("views", `${__dirname}/views`); // Thiết lập thư mục chứa các view
app.set("view engine", "pug"); // Thiết lập view engine là Pug

// Kết nối Socket.IO
io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
});

// Kết nối cơ sở dữ liệu
database.connect();

// Thiết lập các route
route(app); // Route cho client
routeAdmin(app); // Route cho admin

// Route bắt tất cả các đường dẫn chưa được định nghĩa (404)
app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
        pageTitle: "404 Not Found",
    });
});

// Khởi động server
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

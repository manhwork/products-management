const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

require("dotenv").config();
const database = require("./config/database");

const app = express();
let moment = require("moment"); // require
app.locals.moment = moment;
app.use(cookieParser("CXHVASJFHGAISDJFHG"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

const systemConfig = require("./config/system");
app.use(methodOverride("_method"));

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
database.connect();

app.use(bodyParser.urlencoded({ extended: false }));

// app local variables
// biến toàn cục tức là file pug nào cx dùng được
app.locals.prefixAdmin = systemConfig.prefixAdmin;

const port = process.env.PORT;

console.log(__dirname);

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

// Tiny MCE
// https://www.tiny.cloud/docs/tinymce/latest/expressjs-pm/
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End Tiny MCE
// Routes
route(app);
routeAdmin(app);
// * tức là các đường dẫn còn lại
app.get("*", (req, res) => {
    res.render("client/pages/error/404", {
        pageTitle: "404 Not Found",
    });
});
app.listen(port, () => {
    console.log(`Server is running! with ${port}`);
});

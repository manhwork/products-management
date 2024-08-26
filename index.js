const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();
const database = require('./config/database');


const app = express()

app.use(cookieParser('CXHVASJFHGAISDJFHG'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());



const systemConfig = require('./config/system');
app.use(methodOverride('_method'));

const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')
database.connect();



app.use(bodyParser.urlencoded({ extended: false }))

// app local variables
// biến toàn cục tức là file pug nào cx dùng được
app.locals.prefixAdmin = systemConfig.prefixAdmin;

const port = process.env.PORT;

console.log(__dirname);

app.set('views', `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

route(app);
routeAdmin(app);

app.listen(port, () => {
    console.log(`Server is running! with ${port}`);
})

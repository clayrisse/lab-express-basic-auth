require('dotenv').config();

//live advise dfrom ARIADNA CLaudia: 
//CHEEEEECK UN PACKAGE.JSON IF YOU HAVE ALL THIS FIRST


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// session requirements
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// require database configuration
require('./configs/db.config');


// Middleware Setup
// I-2
app.use(session({
    secret: "basic-auth-secret",
    cookie: {
        maxAge: 60000 //1seg
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 //1day
    }),
    resave: true,
    saveUninitialized: true
}))



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// Routes.  Dear CL You need to pay attention to this
var auth = require("./routes/auth.routes")
//must be different than index
// app.use("/auth", auth);
app.use("/", auth);

const index = require('./routes/index.routes');
app.use('/', index);


module.exports = app;

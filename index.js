const express = require('express');

const port = 8001;

const path = require('path');

const app = express();

// const db = require('./config/mongoose');
const mongoose = require('mongoose');
const url = `mongodb+srv://ecmascript10:Ecmapas123@cluster0.9ujexzq.mongodb.net/adminPanel6`;

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
    })
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })




const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const session = require('express-session');

const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');


app.set('view engine','ejs');

app.set('views', path.join(__dirname,'views'));

app.use(expressLayout);
app.set('layout admin_login', false);
app.set('layout forget_password', false);
app.set('layout userPanel/user_home', false);
app.set('layout userPanel/Blog_single', false);
app.set('layout otp', false);
app.set('layout updatePassword', false);

app.use(express.urlencoded());

app.use(express.static('assets'));
app.use(express.static('user_assets'));
app.use('/uploads',express.static(path.join(__dirname,"uploads")));


app.use(cookieParser());


app.use(session({
    name : "RNW",
    secret : "CODE",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 10000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMiddleware.setFlash);

app.use('/', require('./routes/adminRoutes/index'));


app.listen(port, function(err){
    if(err){
        console.log("something wrong");
        return false;
    }
    console.log("server is start on port:",port);
})
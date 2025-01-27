const express = require('express');
const morgan = require('morgan'); // Added morgan for logging
const path = require('path');    
const ejs = require('ejs')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

mongoose.connect("mongodb://localhost:27017/blogify")
.then((e)=> console.log("MongoDB Connected"))

const Blog = require('./models/blog')

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const app = express();
const PORT = 8080; // Changed port to 8080

app.set("view engine","ejs")
app.set("views", path.resolve( "views"));

//middleware
app.use(morgan('dev')); // Use morgan to log requests
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
    return res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
})

app.use('/user',userRoute) 
// If any request start with /user then use `userRoute`
app.use('/blog',blogRoute) 

app.listen(PORT , ()=>console.log(`Server started at PORT:${PORT}`));

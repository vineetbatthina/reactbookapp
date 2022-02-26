//import express module 
var express = require('express');
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true,
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    console.log("User in / is : " + req.session.user);
    if (req.session.user) {
        res.redirect('/home');
    } else
        res.render('login',{
            errorMessage: ''
        });
});

app.get('/login', function (req, res) {
    //check if user session exits
    console.log("User in / is : " + req.session.user);
    if (req.session.user) {
        res.redirect('/home');
    } else
        res.render('login',{
            errorMessage: ''
        });
});

app.post('/login', function (req, res) {
    console.log("User in /login is : " + req.session.user);
    if (req.session.user) {
        res.redirect('/home');
    } else {
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                req.session.save();
                res.redirect('/home');
            }
            else{
                res.render('login',{
                    errorMessage: 'Please Enter Valid credentials'
                });
            }
        });
    }

});

app.get('/home', function (req, res) {
    console.log("User in /home is : " + req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    console.log("User in /create is : " + req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create',{
            errorMessage : ''
        });
    }
});

app.post('/create', function (req, res) {
    console.log("Inside Create POST Request");
    var bookID = req.body.bookID;
    var title = req.body.title;
    var author = req.body.author;
    if(!bookIdExists(bookID)){
        console.log("inside if of createBook Post");
        var bookItem = {
            BookID : bookID,
            Title: title,
            Author: author
        }
        books.push(bookItem);
        res.render('home', {
            books: books
        });
    }
    else{
        console.log("inside else of createBook Post");
        var alert = "Id exists";
        res.render('create', {
            errorMessage : alert
        })
    }
});

app.get('/delete', function (req, res) {
    console.log("User in /delete is : " + req.session.user);
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete',{
            errorMessage: ''
        });
    }
});

app.post('/delete', function (req, res) {
    console.log("Inside delete POST Request");
    var deleteBookID = req.body.deleteBookID;
    if(bookIdExists(deleteBookID)){
        console.log("inside if of delete Post");
        console.log(books);
        books = books.filter((value) =>{
            console.log("List of books Id is : " + value.BookID + " current Book Id is : "+ deleteBookID);
            return value.BookID!==deleteBookID;
        });
        console.log(books);
        res.render('home', {
            books: books
        });
    }
    else{
        console.log("inside else of createBook Post");
        var alert = "Id Doesn't exist";
        res.render('delete', {
            errorMessage : alert
        })
    }
})

app.get('/logout', function (req, res) {
    //check if user session exits
    req.session.destroy();
    res.redirect('/');
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});

var bookIdExists = (bookID) =>{
    console.log("Inside Function");
    var exists = false;
    books.map((val)=>{
        console.log(val);
        console.log(typeof(val.BookID)+ " " + typeof(bookID));
        console.log(val.BookID+ " " + bookID);
        if(val.BookID===bookID){
            console.log("Mapping the same Book Id ");
            exists=true;
        }
    });
    console.log("outside books map");
    return exists;
}
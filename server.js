'use strict';
//=> npm install express cors superagent dotenv ejs pg
// using express
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
// require superagent to get data from API
const superagent = require('superagent');
// to use .env
require('dotenv').config();
// PORT
const PORT = process.env.PORT;
// view and statics
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// using database 
const pg = require('pg');
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL,   ssl: { rejectUnauthorized: false } }); || 
// const client = new pg.Client(process.env.DATABASE_URL);

////////////////////////=> requests
app.get("/", handleHomePage)
app.get("/searches/new", renderForm)
app.post('/searches', handleSearch);
app.get("*", handleError)



////////////////////////=> handler functions
function handleHomePage(req, res) {
    res.render("pages/index.ejs")
}
function handleError(req, res) {
    res.status(404).render('pages/error');
}

function renderForm(req, res) {
    res.render('pages/searches/new');
}

function handleSearch(req, res) {
    let searchQuery = req.body.seachQuery;
    let searchedBy = req.body.searchBy;
    let queryParams = `${searchQuery}:${searchedBy}`;
    getSearchedBooksData(queryParams, res).then(constructor => {
        res.render("pages/searches/show", { renderingBooks: constructor })
    }).catch(error => {
        res.render('pages/error', { error: error })
    })
}


////////////////////////=> getting data function
function getSearchedBooksData(queryParams, res) {
    let query = {
        q: queryParams
    }
    let url = "https://www.googleapis.com/books/v1/volumes"
    return superagent.get(url).query(query).then(data => {
        let arrayOfBooks = data.body.items.map(item => new BooksConstructor(item))
        return arrayOfBooks;
    }).catch(error => {
        res.render("pages/error", { error: error })
    })
}

////////////////////////=> The Books Constructor
function BooksConstructor(items) {
    this.img = checkImage(items.volumeInfo).imageLinks.thumbnail.replace('http:', 'https:');
    this.title = items.volumeInfo.title || "This book found without cover page, so we don't know it's title";
    this.author = items.volumeInfo.authors || "The author of this book in unkown";
    this.description = items.volumeInfo.description || "Please read the book and write description for us";
}


////////////////////////=> Helper Functions
function checkImage(image) {
    if (image.hasOwnProperty('imageLinks')) {
    } else {
        image.imageLinks = { thumbnail: 'https://i.imgur.com/J5LVHEL.jpg' };
    }
    return image;
}





////////////////////////=> Port Listner
// client.connect()
// .then(()=>{
app.listen(PORT, () =>
    console.log(`listening on ${PORT}`)
);
// })
// .catch((error)=>{
//     res.send('cccccccccccc',error.message)
// })
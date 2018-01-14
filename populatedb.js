#! /usr/bin/env node

console.log('This script populates seed blog data to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
const userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

const async = require('async')
const Blog = require('./models/blog');


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const blogList = [];

/*
    title: {type: String, required: true, max: 100},
    category: {type: String, default: 'Untitled'},
    imageURL: {type: String},
    post: {type: String, required: true},
    date: {type: Date, default: Date.now}
*/

function blogCreate(title, category, imageURL, post, cb) {
  const blogDetail = {title , post}
  if (imageURL != false) blogDetail.imageURL = imageURL;
  if (category != false) blogDetail.category = category;
  
  const blog = new Blog(blogDetail);
       
  blog.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blog: ' + blog);
    blogList.push(blog);
    cb(null, blog)
  }  );
}

function createBlog(cb){
    async.parallel([
        function(callback){
            blogCreate('My First Post','General','https://images.unsplash.com/photo-1500236861371-c749e9a06b46?auto=format&fit=crop&w=750&q=80','Hello World. This is my first blog post.',callback)
        },
        function(callback){
            blogCreate('Second Post','Javascript','https://images.unsplash.com/photo-1489389944381-3471b5b30f04?auto=format&fit=crop&w=750&q=80','Javascript is fun.',callback)
        },  
        function(callback){
            blogCreate('Third Post','Javascript','https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=1500&q=80','I am learning to develop apps in Javascript. ',callback)
        },
        function(callback){
            blogCreate('Fourth Post','Design','https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=750&q=80','Design is always important',callback)
        },
        function(callback){
            blogCreate('Fifth Post','Design','https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=393&q=80','I design and develop experiences, that make people\'s life simpler.',callback)
        },
        function(callback){
            blogCreate('Sixth Post','CSS','https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=750&q=80','CSS is fun. I love flexbox.',callback)
        },
        function(callback){
            blogCreate('Seventh Post','General','https://images.unsplash.com/photo-1476170434383-88b137e598bb?auto=format&fit=crop&w=750&q=80','I wanna buy a Mac someday. ',callback)
        },
    ], cb)
}





async.series([
    createBlog
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Blog:  '+ blogList);
        
    }
    //All done, disconnect from database
    mongoose.connection.close();
});




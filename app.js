//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
let _ = require('lodash');

const homeStartingContent = " Welcome to Palacio, a random blog about the smallar things I share from time to time.";
const aboutContent = "A minimalistic blog webapp developed using Node, Express, EJS and Mailchimp API. This is right now a project in development and the content is not added yet, if you want to see my personal blog, follow the link below, Peace.";
const contactContent = "You can contact me at rehan18alam@gmail.com";

const app = express();
var posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-amrehan:Rehan@123@cluster0-xc63c.mongodb.net/notesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});


const Post = mongoose.model("Post", postSchema);

app.get('/', function(req, res){

  Post.find({}, function(err, foundItems){
    if(!err){
      res.render('home', { homeStartingContent: homeStartingContent, posts: foundItems });
    }
  });


  
});

app.get('/posts/:postId' ,function(req, res){
// this postID in this url is gonna be assigned to the varialbe requestedPostId
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    if(!err){
      res.render("post", {title: post.title, content: post.content});
    }
  });
});

app.get('/about', function(req, res){
  res.render('about', {aboutContent: aboutContent});
});

app.get('/contact', function(req, res){
  res.render('contact', {contactContent: contactContent});
});

app.get('/compose', function(req, res){
  res.render('compose');
});

app.post('/compose', function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postData
  });
  post.save();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

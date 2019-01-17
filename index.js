var bodyParser =  require('body-parser'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer'),
mongoose =    require('mongoose'),
express = require('express'),
app = express();

//app config
mongoose.connect('mongodb://localhost/BookerDB',  { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

//database design line
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    para: String,
    created: {type: Date, default: Date.now }
});

var Blogger = mongoose.model("Blogger", blogSchema);

//routes
app.get('/', function (req, res) {
  res.redirect('/blogs');
});

app.get('/blogs', function (req, res) {
    Blogger.find({}, function(err, Blogger){
          if (err) {
              console.log("error!");
          } else{
          res.render('index', {Blogger: Blogger});
          }
    })
});

//add new route
app.get('/blogs/add', function (req, res) {
  res.render('add');
});

//create new post
app.post('/blogs', function (req, res) {
    //check once
    console.log(req.body)
    //add sanitizer
     req.body.blog.body = req.sanitize(req.body.blog.body);
      //req-body
        console.log("===========");
       console.log(req.body)
//....
    Blogger.create(req.body.blog, function(err, newBlog){
     if (err) {
      res.render("add");
    }else{
      res.redirect("/blogs");    
    } 
      });
 });
 
 //create with ID
app.get('/blogs/:id', function (req, res){
  //showing info about Blogger
     Blogger.findById(req.params.id, function(err, foundBlogger){
      if (err) {
        res.redirect("/blogs")
    } else{
    //render to Blogger page
    res.render("show", {Blog: foundBlogger});
    }
 });
 req.params.id
});

//edit the blog
app.get('/blogs/:id/edit', function (req, res) {
//req.body.blog.body = req.sanitize(req.body.blog.body);
Blogger.findById(req.params.id, function(err, foundBlogger){
      if (err) {
           res.render('edit');
    } else{
        res.render("edit", {Blog: foundBlogger});
      }
   });
});

//edit or update
app.put('/blogs/:id', function (req, res) {
    
Blogger.findOneAndUpdate(req.params.id, req.body.blog, {new: true},function(err, updatedblogger){
      if (err) {
           res.redirect('/blogs');
    } else{
           res.redirect("/blogs/" + req.params.id);
      }
   });
});

//delete post
app.delete('/blogs/:id', function (req, res) {
 
Blogger.findByIdAndRemove(req.params.id, {useFindAndModify: false},  function(err){
      if (err) {
           res.redirect('/blogs');
           console.log("error");
    } else{
          res.redirect('/blogs');
          console.log("Data As Deleted!");
   }
   });
   
});
// Node Start Here
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Now Your Server Running!");
});
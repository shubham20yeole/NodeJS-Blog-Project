var express = require('express');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
// var db = mongojs('mongodb://ds143717.mlab.com:43717/shubham', ['users']);
var collections = ["users", "blog"]

var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds143717.mlab.com:43717/shubham', collections)

var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var blog=db.collection('blog');
var session = require('client-sessions');
/*var logger = function(req, res, next){
	console.log("Logging...");
	next();
} 
mongodb://ds143717.mlab.com:43717/shubham
var db = mongojs('//mongodb://shubham20.yeole:shubham20.yeole@ds143717.mlab.com:43717/shubham', ['users'])
app.use(logger);*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
//Global vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
 var errmsg = "Computer Science Project";
app.get('/', function(req, res){
	var postmark = require("postmark");
var client = new postmark.Client("5a86a9e9-78b6-43e2-8cc8-4c16218236b6");
client.sendEmail({
    "From": "shubham20.yeole@gmail.com",
    "To": "sy06736n@pace.edu",
    "Subject": "Test", 
    "TextBody": "Hello from Postmark!"
});
    // docs is an array of all the documents in mycollection
   	res.render("index",{
		errmsg : errmsg,
    session : "false"
	});
	
	
});



// ********************************************************LINKEDIN*******************************************


var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
 
passport.use(new LinkedInStrategy({
  clientID: '8613rjqvsnd5dw',
  clientSecret: 'KWN3zJhKff6aES0X',
  callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true

}, function(accessToken, refreshToken, profile, done) {
  console.log(id);
  // asynchronous verification, for effect... 
  process.nextTick(function () {

    // To keep the example simple, the user's LinkedIn profile is returned to 
    // represent the logged-in user. In a typical application, you would want 
    // to associate the LinkedIn account with a user record in your database, 
    // and return that user instead. 
    return done(null, profile);
  });
}));



app.get('/auth/linkedin',
  passport.authenticate('linkedin', { state: 'SOME STATE'  }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this 
    // function will not be called. 
  });



// http://127.0.0.1:3000/auth/linkedin/callback
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));





// ********************************************************LINKEDIN*******************************************

app.post('/users/add', function(req, res){
	req.checkBody('firstname', 'First name is required').notEmpty();
	req.checkBody('lastname', 'Lastr name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();

	var errors = req.validationErrors();
	var datetime = new Date();
 db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
          var students = "Shubham is Pace CS student";
          if(errors){
              console.log("Fails"+errors);
                  res.render("index",{
                  title : students,
                  users: users,
                  errors: errors
                });
        }else{
              var psd = req.body.password;
              if(req.body.password==null){
                psd = "w$9jKp3e$!Zy_Ned";
              }else{
                psd = req.body.password; 
              }
              console.log("success");
              var newUser = {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              phone: req.body.phone,
              date: datetime,
              website: req.body.website,
              password: req.body.password,
              fbid: req.body.email+"w$9jKp3e$!Zy_Ned",
              gender: req.body.gender,
              photo: req.body.photo,
              type: 'user',
            }
        db.users.insert(newUser, function(err, result){
              if(err){
                console.log(err);
              }
        req.session.users = newUser;
        res.redirect('/dashboard');
  });
  }
      
    } else {
        db.users.findOne({ email: req.body.email }, function(err, users) {
          if (!users) {
            errmsg = 'User with email '+req.body.email+' address is not yet registered... Please Sign Up first';
              res.redirect('/');
          } else {
            if (req.body.email+"w$9jKp3e$!Zy_Ned" === users.fbid) {
              // sets a cookie with the user's info
             req.session.users = users;
              res.redirect('/dashboard');
            } else {
              errmsg = 'Password does not match';
              res.redirect('/');
            }
      }
  });
            
}
});
});
function regLogFun(){


}


// app.delete('/users/delete/:id', function(req, res){
//   console.log(req.params.id);
//   db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
//     if(err){
//       console.log("err");
//     }
//     res.redirect('/');
//   });
// });

app.get('/users/delete/:id', function(req, res){
  console.log(req.params.id);
  // db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
      res.send(req.params.id+" Test");
  // });
});

app.get('/users/blog/delete/:id', function(req, res){
  console.log(req.params.id);
  db.blog.remove({_id: ObjectId(req.params.id)}, function(err, result){
      res.send(req.params.id+" Test");
  });
});

app.get('/users/like/:id', function(req, res){
  // console.log(req.params.id);
  var count = 0;
   db.blog.findOne({ _id: ObjectId(req.params.id)}, function (err, blog) {
    console.log(blog.like+" , "+count);
    count = blog.like;
    count++;
     db.blog.update({ _id: ObjectId(req.params.id)}, {$set:{like: count}}, function (err, result) {
       res.send(""+count);

    });
  });
  });
app.get('/users/dislike/:id', function(req, res){
  // console.log(req.params.id);
  var count = 0;
   db.blog.findOne({ _id: ObjectId(req.params.id)}, function (err, blog) {
    console.log(blog.dislike+" , "+count);
    count = blog.dislike;
    count++;
     db.blog.update({ _id: ObjectId(req.params.id)}, {$set:{dislike: count}}, function (err, result) {
       res.send(""+count);  
  });
    });
});

app.get('/blog/getcomment/:id', function(req, res){
    console.log("In get comment method: "+req.params.id);
  db.comments.find(function (err, docs) {
     res.send(docs);
  });
});


app.get('/view/blog/:id', function(req, res){
  console.log(req.params.id);

  db.blog.findOne({ _id: ObjectId(req.params.id)}, function (err, blog) {
      res.render("fullblog",{blog: blog});
  });
});

app.get('/searching', function(req, res){
  console.log("hello");
 res.send("WHEEE");
});

app.get('/ajax/', function(req, res) {
   res.render('ajax.ejs');

});




app.use(function(req, res, next) {
  if (req.session && req.session.users) {
    db.users.findOne({ email: req.session.users.email }, function(err, users) {
      if (users) {
        req.users = users;
        delete req.users.password; // delete the password from the session
        req.session.users = users;  //refresh the session value
        res.locals.users = users;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});
function requireLogin (req, res, next) {
  if (!req.users) {
    errmsg = "Please login to use this feature";
    res.redirect('/');
  } else {
    next();
  }
};


app.get('/dashboard', function(req, res) {
  var blogviewmsg = "You are viewing blogs of all category";
  db.blog.find(function (err, docs) {
    res.render("dashboard.ejs",{
    blog: docs,
    users: req.session.users,
    message: blogviewmsg,
    session: "true"
  });
  } )
});

// app.get('/dashboard', requireLogin, function(req, res) {
//   var blogviewmsg = "You are viewing blogs of all category";
//   db.blog.find(function (err, docs) {
//     res.render("dashboard.ejs",{
//     blog: docs,
//     users: req.session.users,
//     message: blogviewmsg,
//     session: "true"
//   });
//   } )
// });

app.get('/dashboard/:id', function(req, res) {
   var blogviewmsg = "You are viewing blogs of "+req.params.id+" category";
   db.blog.find({ imagename: req.params.id }, function (err, docs) {
    res.render("dashboard2.ejs",{
    blog: docs,
    users: req.session.users,
    message: blogviewmsg,
    session: "true"
  });
  } )
});

app.get('/clients/', function(req, res){
  db.users.find(function (err, docs) {
    res.render("admin.ejs",{
    errmsg : errmsg,
    users: docs,
     session : "false"
  });
  } )
  
});
app.get('/logout/', function(req, res) {
	console.log("I am here");

  req.session.reset();
  res.redirect('/');
});

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));


app.post('/addblog/', function(req, res){
  
console.log("success");
var datetime = new Date();
console.log(datetime);
    var newBlog = {
      title: req.body.title,
      category: req.body.category,
      imagename: req.body.category.toLowerCase(),
      like: req.body.like,
      dislike: req.body.dislike,
      views: req.body.views,
      long: req.body.long,
      lat: req.body.lat,
      date: datetime,
      name: req.session.users.firstname +" "+req.session.users.lastname,
      data: req.body.blogdata
    }
    db.blog.insert(newBlog, function(err, result){
      if(err){
        console.log(err);
      }
    res.redirect('/dashboard');
  });
});
app.post('/view/blog/comment', function(req, res){

    var newComment = {
      comment: req.body.comment,
      fullname: req.body.fullname,
      blogid: req.body.blogid,
      long: req.body.long,
      lat: req.body.lat,
      date: req.body.date
    }
    db.comments.insert(newComment, function(err, result){
      if(err){
        console.log(err);
      }
    res.send("Done");
  });
});


app.get('/prism/', function(req, res){

   res.render("prism.ejs");
 
});

app.get('/blog/', function(req, res) {

    res.render('blog',{session : "true",users: req.session.users});
     
  
});

app.get('/googlemap/', function(req, res) {

    res.render('googlemap',{session : "true",users: req.session.users});
     
  
});

app.post('/login', function(req, res) {
  db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
      errmsg = 'Email not registered...'; 
        res.redirect('/');
    } else {
      if (req.body.password === users.password) {
        // sets a cookie with the user's info
        req.session.users = users;
        res.redirect('/dashboard');
      } else {
        errmsg = 'Incorrect Password...';
        res.redirect('/');
      }
    }
  });
});

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")

var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "Smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "shubham20.yeole@gmail.com",
        pass : "Shubham4194"
    }
}));
app.get('/send',function(req,res){
    var mailOptions={
        from : "shubham20.yeole@gmail.com",
        to : "shubham20.yeole@gmail.com",
        subject : "Your Subject",
        text : "Your Text",
        html : "HTML GENERATED",
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.end("error");
        }else{
            console.log(response.response.toString());
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });
});

app.listen(port, function() {
  console.log('Listening on port ' + port)
})
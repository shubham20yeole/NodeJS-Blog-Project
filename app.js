var express = require('express');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
// var db = mongojs('mongodb://ds143717.mlab.com:43717/shubham', ['users']);
var db = mongojs('mongodb://shubham20.yeole:shubham20.yeole@ds143717.mlab.com:43717/shubham', ['users'])

var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")

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
	
    // docs is an array of all the documents in mycollection
   	res.render("index",{
		errmsg : errmsg,
    session : "false"
	});
	
	
});

app.get('/random%20word%20%A3500%20d%20%A3500%20d%20%A3500%20bank%20%24/', function(req, res){
	db.users.find(function (err, docs) {
   	res.render("admin.ejs",{
		errmsg : errmsg,
		users: docs,
     session : "false"
	});
	} )
	
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


app.delete('/users/delete/:id', function(req, res){
  console.log(req.params.id);
  db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
    if(err){
      console.log("err");
    }
    res.redirect('/');
  });
});

app.get('/users/delete/:id', function(req, res){
  console.log(req.params.id);
  // db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
      res.send(req.params.id);
  // });
});

app.get('/searching', function(req, res){
  console.log("hello");
 res.send("WHEEE");
});

app.get('/ajax/', function(req, res) {
   res.render('ajax.ejs');

});


app.get('/dashboard', function(req, res) {
  if (req.session && req.session.users) {   // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    db.users.findOne({ email: req.session.users.email }, function (err, users) {
      if (!users) {
        // if the user isn't found in the DB, reset the session info and
        // redirect the user to the login page
        errmsg = 'Your Session Has Timed Out user not present in db';
        res.redirect('/');
      } else {
        // expose the user to the template
        res.locals.users = users;
 
        // render the dashboard page
        res.render('dashboard.ejs',{session : "true", users: users});
      }
    });
  } else {
    errmsg = 'Your Session Has Timed Out actually timeout';
        res.redirect('/');
  }
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
    res.redirect('/');
  } else {
    next();
  }
};


app.get('/dashboard', requireLogin, function(req, res) {
  res.render('dashboard.ejs');
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


app.post('/users/blog', function(req, res){
  
  
console.log("success");
    var newBlog = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website,
      password: req.body.password,
      type: 'user',
    }
    db.users.insert(newBlog, function(err, result){
      if(err){
        console.log(err);
      }
    res.redirect('/');
  });
});

app.get('/prism/', function(req, res){

   res.render("prism.ejs");
 
});

app.get('/blog/', requireLogin, function(req, res) {

    res.render('blog',{session : "true",users: req.session.users});
     
  
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
app.listen(port, function() {
  console.log('Listening on port ' + port)
})
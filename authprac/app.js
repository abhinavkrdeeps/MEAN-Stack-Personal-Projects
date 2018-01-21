var express=require("express"),
    
    mongoose=require("mongoose"),
    
    passport=require("passport"),
    
    bodyParser=require("body-parser"),
    
    LocalStrategy=require("passport-local"),
    
    passportLocalMongoose=require("passport-local-mongoose"),
    
    User=require("./models/user");
    
    
    mongoose.connect("mongodb://localhost/auth_prac_app");
    
var app=express();

app.use(require("express-session")({
    secret: "I want to be a web developer",
    resave: false,
    saveUninitialized: false
    
}));


app.use(passport.initialize());

app.use(passport.session());

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////// Routes



app.get("/register",function(req,res){
    
     res.render("register");
    
});


app.get("/secret",isLoggedIn,function(req,res){
    
    res.render("secret");
    
});

app.post("/register",isSignedIn ,function(req,res){
    
    User.register(new User({username: req.body.username, email: req.body.email}),req.body.password,function(err,user){
        
        if(err)
        {
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
             res.redirect("/secret");
            
        });
        
    });
    
});



// login//////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/login",function(req,res){
    
    res.render("login");
    
});

//////                 handling user login   ////////////////////////////------------------------------


app.post("/login", passport.authenticate("local",{
    
    successRedirect: "/secret",
    failureRedirect: "/login",
    
}), function(req,res){
    
});


// logout


app.get("/logout",function(req,res){
    
    req.logout();
    res.send("you are log out");
    
});


//// middleware to check weather the user is logged in or not


function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}



function isSignedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return res.redirect("/secret");
    }
       // next();
}
app.get("/secret",function(req,res){
    
    res.render("/secret");
    
});

app.listen(process.env.PORT,process.env.IP,function(){
        console.log("server started....");
    })
    
    
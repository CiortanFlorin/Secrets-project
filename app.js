require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});
const secret = process.env.DB_SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});
const User  = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email:userName}).then(function(foundUser){
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        }
    })
});

app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    const newUser  = new User({
        email: req.body.username,
        password:req.body.password
    });
    newUser.save().then(function(createdUser){
        if(createdUser){
            res.render("secrets");
        }else{
            console.log(err);
        }
        
    });
});



app.listen(3000, function(){
    console.log("Server is on");
});
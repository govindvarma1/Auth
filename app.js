//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

async function main(){
    await mongoose.connect("mongodb://localhost:27017/secrets");
}

main().catch(error => handleError(error));

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

const users = mongoose.model("users", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/register", (req, res) => {
    res.render('register');    
})

app.get("/login", (req, res) => {
    res.render('login');    
})

app.post("/register", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    const doc = new users({
        username: username,
        password: password
    });
    await doc.save();
    res.render("secrets");
})

app.post("/login", async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    await users.findOne({username: username}).then(value => {
        if(value === null){
            console.log("user is not found");
        }
        else {
            if(value.password === password) {
                console.log("login successfull");
                res.render("secrets");
            }
            else {
                res.redirect("/login");
                console.log("Incorrect password");
            }
        }
    })
})

app.listen(3000, () => {
    console.log("Server started on port 3000")
})
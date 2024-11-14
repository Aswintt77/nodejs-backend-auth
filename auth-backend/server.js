
// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json()); 

// app.use("/api/auth", authRoutes);

// app.get('/api/test', (req, res) => {
//     res.json({ message: 'API is working!' });
//   });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require("express");
const session = require("express-session");
const passport = require("passport"); 
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
require('./googleAuth');

function isLoggedIn(req, res, next){
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
app.use('/api/Auth', authRoutes);

console.log("mongo", process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI) 
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });



app.get('/', (req, res) => {
  res.send('<button onclick="window.location.href=\'/auth/google\'">Google Auth</button>');
});


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/failure',
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong...')
});

app.get('/protected', isLoggedIn, (req,res) => {
  res.send(`Welcome To Service Provider User UI ${req.user.displayName}`);
});



app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



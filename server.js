var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.listen(5000);

//database connection
var db = mongoose.connect('mongodb://vipul188:Vipul123@ds061711.mongolab.com:61711/myhmis');

//appending schema to usermodel
var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    phoneno: String,
    email: String,
    password: String
});

//creating UserModel schema in database
var UserModel = mongoose.model('UserModel', UserSchema);


var visits = new mongoose.Schema({
    complaint: String,
    billing_amt: Number
});

var visitsModel = mongoose.model('visits', visits);

var patientSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    visits: [visitsModel],
    age: Number,
    family_doctor_id: String,
    phoneno: Number,
    created_at: { type: Date, default: Date.now },
    last_modified: { type: Date, default: Date.now }
});

var patientsModel = mongoose.model('patientsModel', patientSchema);






app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({
    secret: 'myvillageworld',
    saveUninitialized: true,
    resave: true
}));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());
//prodive path to setup start page
app.use(express.static(__dirname + '/Public'));


passport.use(new LocalStrategy(
    function (username, password, done) {
        UserModel.findOne({ username: username, password: password }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        })
    }));


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


//login doctor 
app.post('/doclogin', passport.authenticate('local'), function (req, res) {
    var user = req.user;
    res.json(user);
});

app.get('/loggedin', function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});


//logout function to remove curent user information
app.post('/logout', function (req, res) {
    req.logOut();
    res.send(200);
});

//Creating doctor profile
app.post('/docregister', function (req, res) {
    var newUser = req.body;
    UserModel.findOne({ username: newUser.username }, function (err, user) {
        if (err) { return next(err); }
        if (user) {
            res.json(null);
            return;
        }
        var newUser = new UserModel(req.body);
        newUser.save(function (err, user) {
            req.login(user, function (err) {
                if (err) { return next(err); }
                res.json(user);
            });
        });
    });
});

app.get('/DocInfo', function (req, res) {
    UserModel.find(function (err, users) {
        res.json(users);
    });
});

var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};
//list of single doctor's patients list

app.get('/PatientInfoDoc', auth, function (req, res) {
    patientsModel.findById(req.params.id, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.params.id);
            /*
            user.where(function (err, users) {
                res.json(users);
            });
             */
        }
    })
});
    //patient registration
    
    app.post('/patientreg', function (req, res) {
        var patientReg = new patientsModel(req.body);
        patientReg.save(function (err, doc) {
            res.json(doc);
        });
    });
    
    //Get all patients information
    app.get('/PatientInfo', function (req, res) {
        patientsModel.find(function (err, doc) {
            res.json(doc);
        });
    });
    
    
    //get single record from patient schema
    app.get('/patientModels/:id', function (req, res) {
        var id = req.params.id;
        patientsModel.findOne({ _id: id }, function (err, doc) {
            res.json(doc);
        });
    });
    
    //Update selected patient record
    
    app.put('/patientModelsUpdate/:id', function (req, res) {
        patientsModel.findById(req.params.id, function (err, user) {
            user.update(req.body, function (err, count) {
                patientsModel.find(function (err, users) {
                    res.json(users);
                });
            });
        });
    });
    
    
    // Remove selected patient record from patient schema
    app.delete("/patientModelsRemove/:id", function (req, res) {
        patientsModel.findById(req.params.id, function (err, user) {
            user.remove(function (err, count) {
                patientsModel.find(function (err, users) {
                    res.json(users);
                });
            });
        });
    });
    //Post patient visits
    app.post('/patientVists', function (req, res) {
        var patientVisit = new visitsModel(req.body);
        patientVisit.save(function (err, doc) {
            console.log(doc);
            res.json(doc);
        });
    });

    //creating a port for this application
    

    //proving more information of application URL
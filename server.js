var mysql = require('mysql');
var express = require('express');
var bodpar = require('body-parser');
const bodyParser = require('body-parser');

app = express();
app.listen(8080, function(){
    console.log("server running and listening....");
});

var db = mysql.createConnection({
    host:'localhost',
    user : 'root', 
    password : '',
    database: 'courseshift'
});
db.connect((err)=>{
    if (err){
        console.error('error connecting to MYSQL', err);
    }
    else{
        console.log('connected to MYSQL database');
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "pug");

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/Register', (req, res) => {
    res.render('Register');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/shiftrequest', (req, res) => {
    res.render('shiftrequest');
  });


app.post('/register', (req, res) => {
    // Handle the registration form submission logic here
    const registrationNumber = req.body.registrationNumber;
    const name = req.body.name;
    const password = req.body.password;

    if (!registrationNumber || !name || !password) {
        return res.status(400).send('All fields must be filled out');
    }

    // Perform registration logic (e.g., store in a database)
    const sql = 'INSERT INTO register (registrationNumber, name, password) VALUES (?, ?, ?)';
    db.query(sql, [registrationNumber, name, password], (err, result) => {
        if (err) {
            console.error('Error inserting into MySQL:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.send('Registration successful'); // Send a response back to the client
    });
});



app.post('/login', (req, res) => {
    const registrationNumber = req.body.registrationNumber;
    const password = req.body.password;

    const sql = 'SELECT * FROM register WHERE registrationNumber = ? AND password = ?';
    db.query(sql, [registrationNumber, password], (err, result) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            res.send('Login failed');
        } else {
            if (result.length > 0) {
                // User found, set session and redirect to the shiftrequest page
                req.session.user = result[0];
                res.redirect('/shiftrequest'); // Redirect to the shiftrequest page
            } else {
                // User not found or invalid credentials
                res.render('login', { errorMessage: 'Invalid credentials' });
            }
        }
    });
});


app.post('/shiftrequest', (req, res) => {
    
    const desiredCourse = req.body.desiredCourse;
    const academicYear = req.body.academicYear;
    

    if (!desiredCourse ||!academicYear) {
        return res.status(400).send('All fields must be filled out');
    }

    
    const sql = 'INSERT INTO shiftrequest (desiredCourse, academicYear) VALUES (?, ?)';
    db.query(sql, [desiredCourse, academicYear], (err, result) => {
        if (err) {
            console.error('Error inserting into MySQL:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.send('Request successful'); // Send a response back to the client
    });
});

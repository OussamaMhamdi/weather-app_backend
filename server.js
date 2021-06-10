const express = require('express');
const mysql = require('mysql');
const app = express();

const weatherData = require('./utils/weatherData');

//DATABASE config
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weatherDB'
});

//DATABASE connection 
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected...');
});

//cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//create DATABASE
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE weatherDB';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Data created..');
    });
});

//create table
app.get('/createhistorytabel', (req, res) => {
    let sql = 'CREATE TABLE history(id int AUTO_INCREMENT, temperature VARCHAR(255), description VARCHAR(255), cityName VARCHAR(255), PRIMARY KEY(id) )';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post table creted ...');
    });
});

const port = process.env.PORT || 4000

//api wearher
//localhost:3000/weather?address=lahore
app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({
            error: "You must enter address in search text box"
        })
    }

    weatherData(address, (error, { temperature, description, cityName, main, weather } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        let sql = 'INSERT INTO history SET ?';
        let query = db.query(sql, { temperature, description, cityName }, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
        console.log(temperature, description, cityName, main, weather);
        res.json({
            weather : weather,
            main : main,
            temperature : temperature,
            description : description,
            cityName : cityName
        })
    })
});


app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:4000}`));
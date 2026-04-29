var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 4000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function(req, res){
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'torneo_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL exitosamente.');
});

app.get('/clubes', (req, res) => {
    db.query('SELECT * FROM Clubes', (err, results) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.json(results);
    });
});

app.get('/clubes/buscar', (req, res) => {
    const nombre = req.query.nombre_equipo;
    db.query('SELECT * FROM Clubes WHERE nombre_equipo = ?', [nombre], (err, results) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.json(results);
    });
});

app.post('/clubes', (req, res) => {
    const { nombre_equipo, nombre_dt, posicion_tabla } = req.body;

    db.query('SELECT * FROM Clubes WHERE nombre_equipo = ?', [nombre_equipo], (err, results) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        
        if (results.length > 0) {
            return res.status(400).send('Error: El club ya existe y no se admiten duplicados.');
        } else {
            const sql = 'INSERT INTO Clubes (nombre_equipo, nombre_dt, posicion_tabla) VALUES (?, ?, ?)';
            db.query(sql, [nombre_equipo, nombre_dt, posicion_tabla], (err, result) => {
                if (err) return res.status(500).send('Error: ' + err.message);
                res.send('Club insertado exitosamente.');
            });
        }
    });
});

app.put('/clubes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_dt, posicion_tabla } = req.body;
    const sql = 'UPDATE Clubes SET nombre_dt = ?, posicion_tabla = ? WHERE id = ?';
    
    db.query(sql, [nombre_dt, posicion_tabla, id], (err, result) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.send('Club modificado correctamente.');
    });
});

app.delete('/clubes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Clubes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.send('Club eliminado de la base de datos.');
    });
});

app.get('/estadios', (req, res) => {
    db.query('SELECT * FROM Estadios', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/estadios/buscar', (req, res) => {
    const ciudad = req.query.ciudad;
    db.query('SELECT * FROM Estadios WHERE ciudad = ?', [ciudad], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/estadios', (req, res) => {
    const { nombre_estadio, ciudad, fecha_construccion, capacidad_espectadores, id_club } = req.body;
    
    db.query('SELECT * FROM Estadios WHERE nombre_estadio = ?', [nombre_estadio], (err, results) => {
        if (err) return res.status(500).send(err);
        
        if (results.length > 0) {
            return res.status(400).send('Error: El estadio ya se encuentra registrado.');
        } else {
            const sql = 'INSERT INTO Estadios (nombre_estadio, ciudad, fecha_construccion, capacidad_espectadores, id_club) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nombre_estadio, ciudad, fecha_construccion, capacidad_espectadores, id_club], (err, result) => {
                if (err) return res.status(500).send(err);
                res.send('Estadio insertado exitosamente.');
            });
        }
    });
});

app.put('/estadios/:id', (req, res) => {
    const { id } = req.params;
    const { capacidad_espectadores } = req.body; 
    db.query('UPDATE Estadios SET capacidad_espectadores = ? WHERE id = ?', [capacidad_espectadores, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Datos del estadio modificados.');
    });
});

app.delete('/estadios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Estadios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Estadio eliminado correctamente.');
    });
});

app.get('/jugadores', (req, res) => {
    db.query('SELECT * FROM Jugadores', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.get('/jugadores/buscar', (req, res) => {
    const apellido = req.query.apellido_jugador;
    db.query('SELECT * FROM Jugadores WHERE apellido_jugador = ?', [apellido], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/jugadores', (req, res) => {
    const { nombre_jugador, apellido_jugador, num_camiseta, posicion, id_club } = req.body;
    
    db.query('SELECT * FROM Jugadores WHERE nombre_jugador = ? AND apellido_jugador = ?', [nombre_jugador, apellido_jugador], (err, results) => {
        if (err) return res.status(500).send(err);
        
        if (results.length > 0) {
            return res.status(400).send('Error: Este jugador ya existe en la base.');
        } else {
            const sql = 'INSERT INTO Jugadores (nombre_jugador, apellido_jugador, num_camiseta, posicion, id_club) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nombre_jugador, apellido_jugador, num_camiseta, posicion, id_club], (err, result) => {
                if (err) return res.status(500).send(err);
                res.send('Jugador insertado exitosamente.');
            });
        }
    });
});

app.put('/jugadores/:id', (req, res) => {
    const { id } = req.params;
    const { num_camiseta, id_club } = req.body;
    db.query('UPDATE Jugadores SET num_camiseta = ?, id_club = ? WHERE id = ?', [num_camiseta, id_club, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Datos del jugador modificados.');
    });
});

app.delete('/jugadores/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Jugadores WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Jugador eliminado.');
    });
});

app.listen(port, () => {
    console.log(`Servidor levantado y escuchando en http://localhost:${port}`);
});
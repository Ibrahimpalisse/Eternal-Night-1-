require('dotenv').config();
require('./db') //Affiche le log de connexion à la base

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');

const port = process.env.PORT || 4000;


    // On ne démarre le serveur qu'après la connexion réussie à la BDD
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
      console.log('Un client est connecté');
      socket.on('message', (msg) => {
        console.log('Message reçu:', msg);
        socket.emit('message', 'Bien reçu !');
      });
    });

    app.get('/', (req, res) => {
      res.send('API en ligne');
    });

    server.listen(port, () => {
      console.log(`Serveur backend sur http://localhost:${port}`);
    });

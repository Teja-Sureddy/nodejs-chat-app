import { app, server } from './app.js';
import express from 'express'
import chalk from 'chalk';
import path from 'path';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import './socket/socket.js';

const port = process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../views')
const partialsPath = path.join(__dirname, '../views/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(assetsPath))

app.get('*', ((req, res) => {
    res.render('404', { title: '404' })
}))

server.listen(port, () => {
    console.log('Running on port ' + chalk.bgGreen(port));
})
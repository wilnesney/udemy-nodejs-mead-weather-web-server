const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast.js');
const geocode = require('./utils/geocode.js');

const app = express();

const PORT_NUM = process.env.PORT || 3000;  // Heroku provides process.env.PORT

// Define paths for Express config.
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views'); // Default is /views
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up handlebars engine and views location (for dynamic content/templates).
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath); // Note: hbs., not app.

// Set up directory for static content.
app.use(express.static(publicDirectoryPath));

// While static pages don't need routes specified, dynamic pages do.
// Note: Static version will trump dynamic version (i.e., if there's an index.html in public/, it will be served)
app.get('', (req, res) => {
    res.render('index', {
        title: 'Landing Page',
        name: 'G.G. Russey',
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'G.G. Russey',
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: "Here's an explanation of how to do things and stuff.",
        name: 'G.G. Russey'
    })
})

// Serving JSON
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error,
            });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error,
                });
            }

            res.send({
                address: req.query.address,
                location,
                forecast: forecastData,
            })
        })
    })
});

// 404 pages
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Oh, no!',
        errorText: 'Help article not found.',
        name: 'G.G. Russey',
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Oh, no!',
        errorText: 'Page not found.',
        name: 'G.G. Russey',
    })
})



app.listen(PORT_NUM, () => {
    console.log(`Listening on port ${PORT_NUM}`);
})
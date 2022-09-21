const request = require('postman-request');

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2FydHVkIiwiYSI6ImNsNmlnMW0wMjBxeXQzcG96OGUydnhjZWMifQ.CYXqeCh1Mn1wYwviDudyKg';
const MAPBOX_BASE_URL = 'https://api.mapbox.com/';

const geocode = (address, callback) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `${MAPBOX_BASE_URL}geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

    request({url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to location services', undefined);
        } else if (!body?.features?.length) {
            callback('Unable to find location. Please search again.');
        } else {
            const [longitude, latitude] = body.features[0].center;
            callback(undefined, {
                latitude,
                longitude,
                location: body.features[0].place_name,
            });
        }
    });
};

module.exports = geocode;
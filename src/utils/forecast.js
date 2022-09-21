const request = require('postman-request');

const WEATHERSTACK_API_ACCESS_KEY = 'cb1ab9d2d428fa844c3b2ca01d8157fd';
const WEATHERSTACK_BASE_URL = 'http://api.weatherstack.com/';

const forecast = (latitude, longitude, callback) => {
    const url = `${WEATHERSTACK_BASE_URL}current?access_key=${WEATHERSTACK_API_ACCESS_KEY}&query=${latitude},${longitude}&units=f`;
    request({url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined);
        } else if (body?.error) {
            callback('Unable to find location.', undefined);
        } else {
            const curr = body.current;
            callback(undefined, 
                    `${curr.weather_descriptions.join(', ')}. It's currently ${curr.temperature} degrees out (feels like ${curr.feelslike}).`
                    );
        }
    })
}

module.exports = forecast;
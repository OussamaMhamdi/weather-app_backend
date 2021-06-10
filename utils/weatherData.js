const request = require('request');
const constants = require('../config');

const calCelsius = (temp) => {
    let cell = Math.floor(temp - 273.15);
    return cell;
}

const weatherData = (address, callback) => {
    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(address) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Can't fetch data from open weather map api ", undefined)
        } else if (!body.main || !body.main.temp || !body.name || !body.weather) {
            callback("Unable to find required data, try another location", undefined);
        } else {
            callback(undefined, {
                main : body.weather[0].main,
                weather : body.weather,
                temperature: calCelsius(body.main.temp),
                description: body.weather[0].description,
                cityName: body.name
            })
        }
    })
}

module.exports = weatherData;
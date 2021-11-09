const request = require("postman-request");

const weather_forecast = (lat, lon, placename, callback) => {
  //api key to prove that we are authenticated
  const api_key = "9da35aeb64a7778a52ad7a360ff9455c";
  //url for accesing data
  const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${lat},${lon}`;

  //making a request to get data
  //if we add json to true
  //we dont have to parse this
  //data and will automatically
  //be parsed
  request({ url: url, json: true }, (error, response) => {
    if (!error) {
      const { body } = response;

      if (response.success != false) {
        //const weather_data = response.body.current
        const { temperature, cloudcover } = body.current;
        const weather_description = body.current.weather_descriptions[0];
        const { is_day } = body.current;

        callback(undefined, {
          temp: temperature,
          cloudcover: cloudcover,
          placename: placename,
          weather_description: weather_description,
          is_day: is_day,
        });
      } else {
        const { type } = body.error;
        callback(type, undefined);
      }
    } else {
      callback(error, undefined);
    }
  });
};

module.exports = {
  forecast: weather_forecast,
};

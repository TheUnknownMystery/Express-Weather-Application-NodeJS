//geocoding is the processs of taking an
//adress so we can convert in into lat and lon
const request = require("postman-request");

const geocode = (address, callback) => {
  const access_token =
    "pk.eyJ1Ijoic2F1aGFyZG8iLCJhIjoiY2t1bW0zdDRlMDY0ZjJ1cTkxOWZ6Z3ZyZCJ9.RLS4PRjETtqa2_gYzMIbLQ";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${encodeURIComponent(
    access_token
  )}&limit=1`;
  //console.log(url)

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback(error, undefined);
    } else {
      const { features, message } = response.body;

      if (message) {
        callback("something went wrong please try again", undefined);
      } else if (features.length == 0) {
        console.log(response.body.attribution);
      } else {
        const lat = features[0].center[1];
        const lon = features[0].center[0];
        const placename = features[0].place_name;

        callback(undefined, {
          latitude: lat,
          longitude: lon,
          placename: placename,
        });
      }
    }
  });
};

module.exports = {
  geocode: geocode,
};
/*
geocode("Paris", (error, response) => {

 if (!error) {
  console.log(chalk.green(response.latitude, response.longitude))
  console.log(chalk.green(response.place_name))
 } else {
  console.log(chalk.red.inverse(error))
 }
})
*/

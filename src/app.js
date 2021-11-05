/*express unlike other modules in not an object
but a simple function which ;ets us create servers
and modifie data and use them for backend or 
we can also create websites and use node js as 
a back end for it*/

/*throught this we can build apis and web project
for fetching add or getting data*/

/*
Handle Bar helps us dynamic templating

so in other words lets say we have a website
which has a header and we want the header to
be on all webpages so we are consistent

and it will look good
now to do this we will have to add the header
element to every single html file
which will make the code more complicated
we can solve this by using dynamic templating

in which we already a template to work with
so it will much more easier and faster to
write the webpages

Handle Bar -->https://www.npmjs.com/package/handlebars
Handle Bar With Express.js integration -->https://www.npmjs.com/package/hbs
*/

const path = require("path");
const express = require("express");
const hbs = require("hbs");

const { geocode } = require("../lat_log");
const { forecast } = require("../forecast");

/*if we dont store the dynamic webpages
inside a view folder
node js wont be able to render the webpages
because it is created to only read the view folder
and it will think we have not created the view folder 
so it will throw an err

we will use these for getting the path
the path for the index.html must be
a direct path not a relative path
*/

////////////////////*/PATH FOR EXPTESS CONFIG\*/////////////////////////////
const webpage_dir = path.join(__dirname, "../public"); ///
const Views_custom_path = path.join(__dirname, "../template/views"); ///
const partialsPath = path.join(__dirname, "../template/partials");
////////////////////////////////////////////////////////////////
//console.log(__filename)
/*we are storing the express function in the
app variable so we can use other function 
and get access to the varous functionalities of
node js and create a web server*/
const app = express();

/*app.use is a function to customize
out server

we need to pass the express.static() function
which will take the path to the folder and 
and index.html files

and display it in home page
*/

//set allows you to set a value for a given
//express settings

//so we need to tell express to use
//this custom path
//if we dont do that then
//express expects us to store it in
//a folder named views by default

//HANDLE BAR ENGINE AND VIEWS LOCATION
app.set("view engine", "hbs");
//if we dont do this
//express expects us to store it in
//a folder named views by default
app.set("views", Views_custom_path);
hbs.registerPartials(partialsPath);

app.use(express.static(webpage_dir));
/*since we have multiple routes we 
have to set up our server

we can do that we can using app.get() function
it will decide what to do when 
a user navigates to that path 
and we can return them a html or json data*/

/*this help to server by telling it what
do to at a specific url*/

/*here we leave the url place empty
that way it will be taken as the 
home page on the html or the first page of
the html*/

//this function contains some important
//arguments

//req contain all the requests
//res contains response by which
//we can send the user an html or json data
//empty string --> root directory

//we dont need this as we are using html
// app.get("", (req, res) => {
//  //wrting text on the screen
//  res.send("<h1>Home Page Express</h1>")
//  //we can directly send html like this
//  //res.send(`<h1>Weather</h1>`)
// })

/*
app.get("/help", (req, res) => {

 //here we are passing the data in an object 
 //as you can see that we dont parse the data
 //because express handles all of that for us
 //res.send("<h1>Help</h1>")
 res.send([
  {
   name: "Sauhardo Sengupta",
   age: 27,

   gender: "male",
   ID: "12fdbgbcv",

   last_name: "sengupta",
   first_name: "sauhardo"
  },
  {

   name: "andrew mead",
   age: 40,

   gender: "male",
   ID: "12fdbgbcv",

   last_name: "andrew",
   first_name: "mead"

  }
 ])
})

//name of the route is about
//so when the user visits that page
//then we return a text
app.get("/about", (req, res) => {
 res.send("<h1>about page</h1>")
})
*/

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "SauhardoSengupta",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "SauhardoSengupta",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Sauhardo Sengupta",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    res.send([
      {
        error_detected: true,
        error_message: "Please Provide Address Parameter",
      },
    ]);
    return;
  }
  geocode(
    req.query.address,
    (g_err, { latitude, longitude, placename } = {}) => {
      if (g_err) {
        console.log("err", err);
        return;
      }

      forecast(latitude, longitude, placename, (f_err, f_res) => {
        if (f_err) {
          console.log("ee", f_err);
          return;
        }

        const { temp, cloudcover, placename } = f_res;
        console.log(
          `temparature: ${temp}, cloudcover: ${cloudcover} ${placename}`
        );

        res.send([
          {
            user_given_address: req.query.address,
            placename: placename,
            temparature: temp,
            cloudcover: cloudcover,
          },
        ]);
      });
    }
  );
});

//so we are going to use the req
//which is use for getting query string
//for getting/filtering some data to
//display to the user;

app.get("/products", (req, res) => {
  if (!req.query.search) {
    res.send({
      error_detected: true,
      error: "please give the search parameter🌑🌑",
    });
    return;
  }
  /*
 So when we are typing req.query
 we get all the query parameters 
 passed by the use in json format
 
 for example when we type ?search="games"
 this will be given to us in json format
 {
  search:"games"
 }
 from that we can provide data to the user
 */

  //here we are getting all the query
  console.log(req.query);
  //here we are getting the value
  //of the search parameter
  //from the json data
  console.log(req.query.search);

  res.send({
    products: [],
  });
});
//this we give a 404 error message
//when we given help/[any uri]
//it will return 404 as
//we dont have anything in help director
//so anything after /help/
//will give a 404

//404 for help specific error
app.get("/help/*", (req, res) => {
  res.render("Error", {
    ErrorMessage: "404 Error Page Help Data Not Found",
    ErrorParagraph: "help article not found",
  });
});

//404 for all errors
app.get("*", (req, res) => {
  res.render("Error", {
    ErrorMessage: "404 Error Page Not Found",
    ErrorParagraph:
      "Look like the page you were searching for is no availabel now!",
  });
});

//app.com
//app.com/help
//app.com/about
const PORT = process.env.PORT || 3000;
//start server
app.listen(PORT, () => {
  console.log(`started server at port ${PORT} 🚀🚀🚀🚀`);
});

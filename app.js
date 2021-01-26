/******************Boiler plate****************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const data = require("./data/pokemon.js");
const pokemon = require("./data/pokemon.js");

/******************Middleware****************** */
//this lets the seerver read json from the client request and
//converts them to JS
app.use(bodyParser.json());

// allows webserver to be  open
app.use(function(req, res, next) {
  console.log("Got a request", req.method, req.contentType);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.contentType("application/json");
  // Give next middleware a chance to run, print some information for every request,
  next();
});

/************************Routes******************************* */

//Get all pokemnon
app.get("/pokemon", function(req, res) {
  res.send({ pokemon: data });
}); //checked http://localhost:3000/pokemon on Postman and it works

//Get pokemnon by id
//get data from DB
app.get("/pokemon/:id", function(req, res) {
  //iterate through each pokemon, and for each pokemon,
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    //conver the pokemon by id into number, it matches the given id from the requested id
    if (parseInt(data[i].id) === parseInt(req.params.id)) {
      //return that pokemon
      return res.send(data[i]);
      // checked http://localhost:3000/pokemon/100 on Postman, and it works
    }
  }
  //If not found, return 404 status and message
  res.status(404).send({ error: "Pokemon does not exist" });

  /*
  Same as ^
  const pokemon = data.find(e => parseInt(e.id) === parseInt(req.params.id))

  if (!pokemon) {
    res.status(404).send('Pokemon does not exist');
  }
  res.send(pokemon);
  */
});

//Get pokemon attacks by id
app.get("/pokemon/:id/attacks", function(req, res) {
  //Version 1
  //iterate through each pokemon, and for each pokemon,
  // for (let i = 0; i < data.length; i++) {
  //   console.log(data[i]);
  //   //conver the pokemon by id into number, it matches the given id from the requested id
  //   if (parseInt(data[i].id) === parseInt(req.params.id)) {
  //     //return that pokemon with attacks
  //     return res.send(data[i].attacks);
  //   } else {
  //     //else  Pokemon not found; return 404 status code
  //   } res.status(404).send('Pokemon does not exist');
  // }

  //Version 2
  //for the data array, we use the find method to search through each pokemon by id and return if
  //the id of the pokemon that matches the id in the requested params
  const pokemon = data.find(e => parseInt(e.id) === parseInt(req.params.id));
  //if pokemon doesn't exist, return 404 status and message
  if (!pokemon) {
    res.status(404).send({ error: "Pokemon does not exist" });
  }
  //if pokemon exists, return attacks for this pokemon
  res.send(pokemon.attacks);
});

//Add new pokemon
//With 409
app.post("/pokemon", function(req, res) {
  //Get pokemon data from request body
  let newPokemon = req.params.body;
  console.log(req.body);

  const pokemon = data.find(p => parseInt(p.id) === parseInt(newPokemon.id));
  if (pokemon) {
    res.send(409).send({ error: "ID already exist" });
  } else {
    //Add pokemon to DB
  }
  data.push(newPokemon);
  //Return status code 201: new resource created, and confirm
  res.status(201).send(data);
  // checked and prints to console with updated id # but shows as NaN when using GET
});

//Without 409
// app.post("/pokemon", function(req, res) {
//   //Get pokemon data from request body
//   let newPokemon = req.params.body;
//   console.log(req.body);
//   //Add pokemon to DB
//   data.push(newPokemon);
//   //Return status code 201: new resource created, and confirm
//   res.status(201).send(data);
//   // checked and prints to console with updated id # but shows as NaN when using GET
// });

/*
app.post('/cats', (req, res) => {
    // Get cat data from request body
    let newCat = req.body;
    // Add a unique ID
    newCat.id = nextId++;
    // Add cat to my "DB"
    catsData.push(newCat);
    // Status code 201 means: new resource created
    res.status(201).send(newCat);
});

*/

//Add homepage
//Send request for homepage
app.get("/", function(req, res) {
  //Get response sent with message if request accepted
  res.send("Hello world");
}); //checked http://localhost:3000/ on Postman and works

// Update/replace a pokemon by ID
app.put("/pokemon/:id", (req, res) => {
  // Get ID from URL parameter
  let id = req.params.id;
  // Find it
  let ix = data.findIndex(e => parseInt(e.id) === parseInt(req.params.id));
  if (ix === -1) {
    // Pokemon not found; return 404 status code
    res.status(404).send({ error: "Pokemon does not exist" });
  } else {
    // Create new cat obj from request body
    let modPokemon = req.body;
    // Make sure modified Pokemon doesn't try to change ID
    modPokemon.id = id;
    // Replace old cat with modified one
    data[ix] = modPokemon;
    // Return modified cat as confirmation
    res.status(200).send(data);
  } //checked http://localhost:3000/pokemon/1 when using "PUT" and "GET"on Postman
});

//Delete a Pokemon by ID
app.delete("/pokemon/:id", (req, res) => {
  //Get ID from URL params
  let id = req.params.id;
  //Find it
  let index = data.findIndex(e => parseInt(e.id) === parseInt(id));
  //If the index is not less than 0
  if (index !== -1) {
    //If pokemon is found, remove the pokemon from the array
    data.splice(index, 1);
    //respond with message when executed
    res.send({ message: "Pokemon Deleted" });
  } else {
  } // else  Pokemon not found; return 404 status code
  res.status(404).send({ error: "Pokemon does not exist" });
  //checked http://localhost:3000/pokemon/1 when using "DELETE" and "GET"on Postman
});

/****************Start Server******************** */
app.listen(3000);
console.log("Listening on port 3000...");

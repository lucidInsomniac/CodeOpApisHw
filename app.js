/******************Boiler plate****************** */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const data = require("./data/pokemon.js");

/******************Middleware****************** */
//this lets the seerver read json from the client request and
//converts them to JS
app.use(bodyParser.json());

//print some information for every request
app.use(function(req, res, next) {
  console.log("Got a request", req.method, req.contentType);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.contentType("application/json");
  // Give next middleware a chance to run
  next();
});

//Get all pokemnon
app.get("/pokemon", function(req, res) {
  res.send({ pokemon: data });
}); //checked http://localhost:3000/pokemon on Postman and it works

//Get pokemnon by id
app.get("/pokemon/:id", function(req, res) {
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    if (parseInt(data[i].id) === parseInt(req.params.id)) {
      return res.send(data[i]);
      // checked http://localhost:3000/pokemon/100 on Postman, and it works
    }
  }
  res.status(404).send("Pokemon does not exist");

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
  // for (let i = 0; i < data.length; i++) {
  //   console.log(data[i]);
  //   if (parseInt(data[i].id) === parseInt(req.params.id)) {
  //     return res.send(data[i]);
  //     // checked http://localhost:3000/pokemon/100 on Postman, and it works
  //   }
  // }
  // res.status(404).send("Pokemon does not exist");

  //Same as ^
  const pokemon = data.find(e => parseInt(e.id) === parseInt(req.params.id));

  if (!pokemon) {
    res.status(404).send("Pokemon does not exist");
  }
  res.send(pokemon);
});

//Add new pokemon
app.post("/pokemon", function(req, res) {
  let newPokemon = req.body;
  newPokemon.id = nextID++;
  console.log(req.body);
  data.push(req.body);
  res.send(data);
});

//Add homepage
app.get("/", function(req, res) {
  res.send("Hello world");
}); //checked http://localhost:3000/ on Postman and works

//Update/replace a pokemon by ID
app.put("/pokemon/:id", (req, res) => {
  let modPokemon = req.body;
  let id = Number(req.params.id);
  let index = data.findIndex(p => p.id === id);
  if (index !== -1) {
    modPokemon.id = id;
    data[index] = modPokemon;
    res.send(modPokemon);
  } else {
    res.status(404).send("Pokemon does not exist");
  }
});

//Delete a Pokemon by ID
app.delete("/pokemon/:id", (req, res) => {
  let id = Number(req.params.id);
  let index = data.findIndex(p => p.id === id);
  if (index !== -1) {
    data.splice(index, 1);
    res.send({ message: "Pokemon Deleted" });
  } else {
  }
  res.status(404).send("Pokemon does not exist");
});

/****************Start Server******************** */
app.listen(3000);
console.log("Listening on port 3000...");

// Importeer express uit de node_modules map
import { render } from "ejs";
import express, { response } from "express";

// Maak een nieuwe express app aan
const app = express();

// get info form api

const url = "";

// api token
// 300413 | DChxg1jKs61R6qWTEkik1NKzRBjvfhacJOWY6vGp;

// Stel ejs in als template engine en geef de 'views' map door
app.set("view engine", "ejs");
app.set("views", "./views");

// Stel afhandeling van formulieren inzx
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));

// Maak een route voor de index

// homepagina
app.get("/", (request, response) => {
  response.render("index");
});

// Stel het poortnummer in waar express op gaat luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */

async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error);
}

// post json

export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}

// Importeer express uit de node_modules map
import { render } from "ejs";
import express, { response } from "express";
import "dotenv/config";

// Maak een nieuwe express app aan
const app = express();

// base api url
const baseUrl = "https://api.werktijden.nl/2"

// get info form api
const url = `${baseUrl}/employees`;

// Url voor ophalen alle clock ins/outs
const punchesUrl = await dataFetch(`https://api.werktijden.nl/2/timeclock/punches?departmentId=98759&start=${start}&end=${end}`);

// voor posten van inkloktijden
const clockinUrl = `${baseUrl}/timeclock/clockin`;

// voor posten van uitkloktijden
const clockoutUrl= `${baseUrl}/timeclock/clockout`;



const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${process.env.APIKEY}`
  }
};

// fetch 
async function dataFetch(url) {
  const data = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => error);
  return data;
}

// Stel ejs in als template engine en geef de 'views' map door
app.set("view engine", "ejs");
app.set("views", "./views");

// Stel afhandeling van formulieren 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gebruik de map 'public' voor statische resources
app.use(express.static("public"));




// Maak een route voor de index
// index
app.get("/", (request, response) => {
  console.log(request.query.employees);
  dataFetch(url).then((data) => {
    console.log(data)
    response.render("index",{employee:data});
  });
});


// voor het posten moet ik de employee_id en department_id(#departmentnummer) meegeven
// index post functie voor inklokken en uitklokken van medewerkers


// Stel het poortnummer in waar express op gaat luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});


// post

export async function postJson(url, body) {
  return await fetch(url, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}


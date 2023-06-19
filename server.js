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

// om inkloktijden op te vragen
const punchesUrl =  `${baseUrl}/timeclock/punches`;

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
 
// index post functie voor inklokken en uitklokken van medewerkers
app.post("/", (request, response) => {
  const employeeId = request.body.employeeId;
  const departmentId = request.body.departmentId;

  // Inklokken
  postJson(clockinUrl, { employee_id: employeeId, department_id: departmentId })
    .then((data) => {
      console.log(data);
      // Doe iets met de response na het inklokken

      // Uitklokken
      postoutJson(clockoutUrl, { employee_id: employeeId, department_id: departmentId })
        .then((data) => {
          console.log(data);
          // Doe iets met de response na het uitklokken
          response.redirect("/");
        })
        .catch((error) => {
          console.error(error);
          response.redirect("/");
        });
    })
    .catch((error) => {
      console.error(error);
      response.redirect("/");
    });
});

// Stel het poortnummer in waar express op gaat luisteren
app.set("port", process.env.PORT || 8000);

// Start express op, haal het ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});



// post json
// clockin
// voor het posten moet ik de employee_id en department_id(#departmentnummer)
export async function postJson(clockinUrl, body) {
  return await fetch(clockinUrl, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}
// post de uitkloktijden
export async function postoutJson(clockoutUrl, body) {
  return await fetch(clockoutUrl, {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => error);
}


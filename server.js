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
  headers: {
    Authorization: `Bearer ${process.env.APIKEY}`,
    "Content-Type": "application/json"
  }
};

// GET-verzoek
async function fetchData(url) {
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

// POST-verzoek
async function postData(url, body) {
  const postOptions = {
    ...options,
    method: "POST",
    body: JSON.stringify(body)
  };

  const response = await fetch(url, postOptions);
  const data = await response.json();
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



//route index
// index
app.get("/", async (request, response) => {
  const employeesData = await fetchData(url);
  const punchesData = await fetchData(punchesUrl);

  console.log(employeesData);
  console.log(punchesData);

  response.render("index", { employee: employeesData, punches: punchesData });
});

// Clock in
app.post("/clockin", async (request, response) => {
  const { employeeId, departmentId } = request.body;

  const clockInData = await postData(clockinUrl, {
    employee_id: employeeId,
    department_id: departmentId
  });

  console.log(clockInData);

  // Stuur een reactie terug naar de client, bijvoorbeeld een succesmelding
  response.json({ message: "Clock in successful" });
});

// Clock out
app.post("/clockout", async (request, response) => {
  const { employeeId, departmentId } = request.body;

  const clockOutData = await postData(clockoutUrl, {
    employee_id: employeeId,
    department_id: departmentId
  });

  console.log(clockOutData);

  // Stuur een reactie terug naar de client, bijvoorbeeld een succesmelding
  response.json({ message: "Clock out successful" });
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
// Importeer express uit de node_modules map
import { render } from "ejs";
import express, { response } from "express";
import "dotenv/config";
import { format, formatISO, add, differenceInMinutes, differenceInHours } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"


// Maak een nieuwe express app aan
const app = express();

// base api url
const baseUrl = "https://api.werktijden.nl/2"

// get info form api
const url = `${baseUrl}/employees`;

// Haal de datum van vandaag op om alleen de punches van vandaag te laten zien:
const date = new Date()
const timeZone = 'Europe/Amsterdam'
const zonedDate = utcToZonedTime(date, timeZone)
const start = formatISO(new Date(zonedDate), { representation: 'date' })
const end = formatISO(add(new Date(zonedDate), { days: 1 }), { representation: 'date' })

const today = format(utcToZonedTime(date, timeZone), 'd-L-y')


// om inkloktijden op te vragen
const punchesUrl =  `${baseUrl}/timeclock/punches?departmentId=98759&start=${start}&end=${end}`;

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

  // console.log(employeesData);
  // console.log(punchesData.data);

  response.render("index", { employee: employeesData, punches: punchesData.data ? punchesData.data : false });
});


// Clock in
app.post("/clockin", async (request, response) => {
  const { employeeId, departmentId } = request.body;

  const clockInData = await postData(clockinUrl, {
    employee_id: employeeId,
    department_id: departmentId
  });
    console.log(clockInData);
    response.redirect("/");

});

// Clock out
app.post("/clockout", async (request, response) => {
  const { employeeId, departmentId } = request.body;

  const clockOutData = await postData(clockoutUrl, {
    employee_id: employeeId,
    department_id: departmentId
  });
    console.log(clockOutData);
    response.redirect("/");

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
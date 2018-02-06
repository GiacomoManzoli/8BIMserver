const express = require("express");
const ws = require("ws");
const path = require("path");

const Backend = require("./src/backend");

const app = express();
const PORT = 8188;
const WS_PORT = 40510;

console.log("--------------------------");
console.log("Omnis Mock");
console.log("--------------------------");

/*
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
}); */

// app.use(express.static(path.join(__dirname, "../www")));


const WebSocketServer = ws.Server;
const wss = new WebSocketServer({ port: WS_PORT });

let backend;


const router = express.Router(); // get an instance of the express Router

wss.on("connection", (webSocket) => {
  backend = new Backend({
    ws: webSocket,
    BIM_ADDRESS: "http://localhost:8082",
  });
});


// middleware to use for all requests
/*
router.use(function(req, res, next) {
    // do logging
    console.log("Something is happening.");
    next(); // make sure we go to the next routes and don"t stop here
});
*/
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

const available = [
  { method: "getSummary" },
  { method: "getTree" },
  { method: "getAll" },
  // Do $cinst.$objs.oBIM.$callmethod("getObjectProperties",row(CURRENT_OID)) Returns id_1
  { method: "getObjectProperties", params: ["currentOID"] },
  { method: "getUMs" },
  { method: "getCategoriesList" },

  { method: "getQuantities", params: ["currentOID", "kTrue"] },
  { method: "getQuantities", params: ["currentOID", "kFalse"] },
  { method: "getCategories", params: ["IfcDoor"] },
];


router.get("/TEST", (req, res) => {
  backend.call(available[0]);
  res.json({ status: "OK" });
});


router.get("/", (req, res) => {
  res.json({ calls: available });
});

app.use("/api", router);


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// let router = require("./src/request_handlers")

app.get("/", (req, res) => {
  res.redirect("8bim.htm");
});

app.use(express.static(path.join(__dirname, "../../html_controls/8bim")));


app.listen(PORT, () => {
  console.log(`WebServer running on port: ${PORT}`);
  console.log(`WebSocket running on port: ${WS_PORT}`);
});

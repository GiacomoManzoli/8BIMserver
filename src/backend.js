const beautify = require("json-beautify");

class Backend {
  constructor(data) {
    this.BIM_ADDRESS = data.BIM_ADDRESS;
    this.currentPID = null;
    this.ws = data.ws;

    this.ws.on("message", (message) => {
      const obj = JSON.parse(message);
      console.log("Ricevuto messaggio: %s", beautify(obj, null, 2, 100));
      const msgData = (obj.data) ? JSON.parse(obj.data) : undefined;
      this.handleMessage(obj.evType, msgData);
    });
  }

  //
  call(data) {
    this.sendMessage(data.method, data.params);
  }

  // Utility
  sendMessage(evName, data) {
    console.log("Inviato: ", evName);
    this.ws.send(JSON.stringify({
      name: evName,
      data: data || [],
    }));
  }

  // Gestore principali degli eventi
  handleMessage(evName, data) {
    if (this[evName]) {
      this[evName](data);
    } else {
      console.log("NO HANDLER");
    }
  }

  // Eventi legati all"avvio e al login
  evOmnisCommunicationEstablished() {
    this.sendMessage("setLanguage", ["it"]);
    this.sendMessage("loadBimServerApi", [this.BIM_ADDRESS]);
    this.sendMessage("get8bimInfo");
  }

  evApiLoaded() {
    // $cinst.$objs.oBIM.$callmethod("bimServerLogin",row("bim@888sp.it","bim"))
    this.sendMessage("bimServerLogin", ["bim@888sp.it", "bim"]);
  }

  evLoginDone() {
    // Do $cinst.$objs.oBIM.$callmethod("showLoadIFC") Returns id
    // this.sendMessage("showLoadIFC");
    // Do $cinst.$objs.oBIM.$callmethod("getProjectOidFromName",row("Villetta AC.ifc - 1513243257953")) Returns id
    this.sendMessage("getProjectOidFromName", ["TEST_CasaAllplan"]);
  }

  evGetProjectOidFromName(data) {
    // Do $cinst.$objs.oBIM.$callmethod("setCurrentProject",row(PID)) Returns id     ;; Richiedo il caricamento del progetto
    // 131073 --> Villetta AC.ifc - 1513243058273
    // 589825 --> Progetto con sotto-progetti
    // 4653057 --> TEST_Villetta 4
    // 4587521 --> TEST_Villetta 2x3
    this.currentPID = data[0].oid;
    this.sendMessage("setCurrentProject", [this.currentPID]);
  }

  evSetCurrentProject() {
    // Do $cinst.$objs.oBIM.$callmethod("showProject",row(PID)) Returns id
    this.sendMessage("showProject", [this.currentPID]);
  }

  evGetElementsInBOQ(data) {
    if (data.data === "show") {
      // Nota, sono 3 guid della villetta!
      this.sendMessage("showElementsInBOQ", ["3AfWGKYLfhHwCDtN0iZcHW", "3GVvoXwi40HAubBs_U13ct", "1bAo_n7eUZJPzSAilHpawi"]);
    } else {
      this.sendMessage("clearFilter");
    }
  }

  evClick(data) {
    this.selectedObject = data;
    this.selectedOid = data.id;
    this.selectedType = data.type;
  }
}

module.exports = Backend;

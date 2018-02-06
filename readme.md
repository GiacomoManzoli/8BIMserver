# DEV Server

WebServer realizzato con Node.js e WebSocket che simula il comportamento di Omnis per facilitare lo sviluppo!


```
$ npm install
$ npm start             # Hotreload del server ad ogni salvataggio, richiede supervisor
$ npm run start-once    # avvia una sola volta
```

I file statici di `8BIM` vengono cercati nella directory:

```
../../html_controls/8bim
```

## Supervisor

```
npm install -g supervisor
```

## Dati del server

**Indirizzo:** (http://localhost:8188/8bim.htm)[http://localhost:8188/8bim.htm]
**WebSocket:** (ws://localhost:40510)[ws://localhost:40510]# 8BIMserver

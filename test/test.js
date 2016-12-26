import * as pluginIaas from '../src'

const configPruebas = {
  "username": "rafaherrero",
  "privateKey": "/home/ubuntu/.ssh/id_rsa",
  "directorioIaas": "/home/rafaherrero/blanditoooo",
  "host": "rafaherrero.ddns.net",
  "tipoAutenticacion": [
    "Github",
    "BaseDatos"
  ],
  "conexionSegura": {
    "commonName": "bubook",
    "organization": "bubook",
    "days": "365",
    "puerto": "5000"
  },
  "Github": {
    "creaApp": "confirmar",
    "clientID": "44c90595590e08fdb306",
    "clientSecret": "7e8e70e75e2d59937703c4fefcc1589244a629a4",
    "organizacion": "ULL-ESIT-GRADOII-DSI"
  },
  "BaseDatos": {
    "lectores": [
      "r@r.com",
      "p@p.com"
    ]
  }
}


/*
async function testStart () {
  let configPruebas = await pluginIaas.config()
  console.log(JSON.stringify(configPruebas, null, 2))
  await pluginIaas.start(configPruebas)
}*/


async function testDeploy () {
  //let configPruebas = await pluginIaas.config()
  //await pluginIaas.start(configPruebas)
  await pluginIaas.deploy(configPruebas)
}

testDeploy().catch(console.error)
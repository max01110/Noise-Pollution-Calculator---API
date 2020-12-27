const https = require('https');

const roads = (lat, long, callback) => {
  // var lat = "43.558109";
  // var long = "-79.706352";
  var URL = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:50];('
  var rPrimary = 'way["highway"="primary"](around:1000,' +  lat + ','+ long + ');'
  var rSecondary = 'way["highway"="secondary"](around:1000,' +  lat + ','+ long + ');'
  var rTertiary = 'way["highway"="tertiary"](around:500,' +  lat + ','+ long + ');'
  var rMotorway = 'way["highway"="motorway"](around:1000,' +  lat + ','+ long + ');'
  var rResidential = 'way["highway"="residential"](around:100,' +  lat + ','+ long + ');'
  var rRaceway = 'way["highway"="raceway"](around:1000,' +  lat + ','+ long + ');'

  URL = URL + rPrimary + rSecondary + rTertiary + rMotorway + rResidential + rRaceway;
  URL = URL + ");out body;>;out skel qt;";
  nodes = [];
  roadInfo = [];
  https.get(URL, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    resp.on('end', () => {
  
      // console.log(JSON.parse(data).elements);
      for (var i=0; i<JSON.parse(data).elements.length; i++) {
        // console.log(JSON.parse(data).elements[i])
        if (JSON.parse(data).elements[i].type == "node") {
          nodes.push(JSON.parse(data).elements[i])
        } else {
          roadInfo.push(JSON.parse(data).elements[i])
        }
      }
      console.log(roadInfo[0].nodes.length)
      for (var r=0; r<roadInfo[0].nodes.length; r++) {
        n = 0
        for (var n=0; n<nodes.length; n++) {
          if (nodes[n].id === roadInfo[0].nodes[r]) {
            console.log("ROAD: " + roadInfo[0].nodes)
            console.log("NODE: " + nodes[n].id)
            console.log("---------------")
          }
        }
      }
      callback(undefined, {
        roadInfo
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve road data. ', undefined)
  });
  
}

module.exports = roads




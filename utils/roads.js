const https = require('https');
const distance = require('./distance')
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
      // console.log(data)

      // console.log(JSON.parse(data).elements);
      for (var i=0; i<JSON.parse(data).elements.length; i++) {
        if (JSON.parse(data).elements[i].type == "node") {
          nodes.push(JSON.parse(data).elements[i])
        } else {
          roadInfo.push(JSON.parse(data).elements[i])
        }
      }
      var roadInfoUpdate = {}
      var minDist = Number.POSITIVE_INFINITY
      var rName = ""
      var rNames = []
      var finalInfo = {}
      var temp = {}
      for (var er=0; er<roadInfo.length; er++) {
         rName = roadInfo[er].tags.name
         if (roadInfoUpdate[rName] === undefined) {
          roadInfoUpdate[rName] = roadInfo[er].nodes
          rNames.push(rName)
          temp = roadInfo[er]
          delete temp['nodes'];
          finalInfo[rName] = temp
         } else {
           for (var each=0; each<(roadInfo[er].nodes).length; each++) {
            roadInfoUpdate[rName].push(roadInfo[er].nodes[each])
           }
         }
        }
      rName = ""
      rDistance = {}
        
      for (var j=0; j<rNames.length; j++) {
        rName = rNames[j]
        minDist = Number.POSITIVE_INFINITY

        for (var r=0; r<roadInfoUpdate[rName].length; r++) {  
          n = 0;
          for (var n=0; n<nodes.length; n++) {
            if (nodes[n].id === roadInfoUpdate[rName][r]) {
              minDist = Math.min(minDist,  distance([lat, long], [nodes[n].lat, nodes[n].lon]))
            }
          }
        }
        console.log(finalInfo[rName])
        finalInfo[rName].shortestDistance = minDist
        // rDistance[rName] = minDist
      }

      console.log(finalInfo)


      callback(undefined, {
        finalInfo
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve road data. ', undefined)
  });
  
}

module.exports = roads




const https = require('https');
const distance = require('./distance')

const air = (lat, long, callback) => {
  // var lat = "43.558109";
  // var long = "-79.706352";
  var URL = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:50];('
  var aAW = 'way["aeroway"="aerodrome"](around:5000,' +  lat + ','+ long + ');'
  var aAN = 'node["aeroway"="aerodrome"](around:5000,' +  lat + ','+ long + ');'
  var aHN = 'node["aeroway"="heliport"](around:1000,' +  lat + ','+ long + ');'
  var aHW = 'way["aeroway"="heliport"](around:1000,' +  lat + ','+ long + ');'
  var aHPADW = 'way["aeroway"="helipad"](around:1000,' +  lat + ','+ long + ');'
  var aHPADN = 'node["aeroway"="helipad"](around:1000,' +  lat + ','+ long + ');'

  URL = URL + aAN + aAW + aHN + aHW + aHPADW + aHPADN;
  URL = URL + ");out body;>;out skel qt;";
  nodes = [];
  airInfo = [];
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
          airInfo.push(JSON.parse(data).elements[i])
        }
      }
      // console.log(airInfo)
      // console.log(nodes)
    
      var finalInfoAir = {}
      var minDist = Number.POSITIVE_INFINITY
      var tempName = ""
      var temp = {}
      var tempNodes = []

      // console.log(airInfo)
      for (var i=0; i<airInfo.length; i++) {
        if (airInfo[i].tags === undefined) {
          if (airInfo[i].tags.name === undefined) {
            tempName = "Airfield " + (i+1).toString()
          } else {
            tempName = airInfo[i].tags.name
          }
        }
        if (airInfo[i].tags.name === undefined) {
          tempName = "Airfield " + (i+1).toString()
        } else {
          tempName = airInfo[i].tags.name
        }
        minDist = Number.POSITIVE_INFINITY
        
        if (airInfo.lat === undefined) {
          temp = airInfo[i]
          tempNodes = airInfo[i].nodes
          delete temp['nodes'];
          finalInfoAir[tempName] = temp
            for (var y=0; y<tempNodes.length; y++) {
            for (var n=0; n<nodes.length; n++) {
              if (nodes[n].id === tempNodes[y]) {
                minDist = Math.min(minDist,  distance([lat, long], [nodes[n].lat, nodes[n].lon]))
                delete nodes[tempNodes[y]]
              }
            }
          }
          finalInfoAir[tempName].shortestDistance = minDist
          } else {
            minDist = Math.min(minDist, distance([lat, long], [airInfo[i].lat, airInfo[i].lon]))
          }
        }

        //Left over nodes that were given by OSM
        if (nodes.length != 0) {
          for (var that=0; that<nodes.length; that++) {
            if (nodes[that].tags != undefined) {
              if (nodes[that].tags.name != undefined) {
                tempName = nodes[that].tags.name
              } else {
                tempName = "AirPoint " + (that+1).toString() 
              }
              finalInfoAir[tempName] = nodes[that]
              finalInfoAir[tempName].shortestDistance = distance([lat, long], [nodes[that].lat, nodes[that].lon])
            }
          }
        }

      callback(undefined, {
        finalInfoAir
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve air data.', undefined)
  });
  
}

module.exports = air




const https = require('https');
const distance = require('./distance')

const construction = (lat, long, callback) => {
  // var lat = "43.558109";
  // var long = "-79.706352";
  var URL = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:50];('
  var cLUN = 'node["landuse"="construction"](around:400,' +  lat + ','+ long + ');'
  var cLUW = 'way["landuse"="construction"](around:400,' +  lat + ','+ long + ');'
  var cBN = 'node["building"="construction"](around:400,' +  lat + ','+ long + ');'
  var cBW = 'way["building"="construction"](around:400,' +  lat + ','+ long + ');'
  var cHW = 'way["highway"="construction"](around:400,' +  lat + ','+ long + ');'
  var cHN = 'node["highway"="construction"](around:400,' +  lat + ','+ long + ');'

  URL = URL + cLUN + cLUW + cBN + cBW + cHW + cHN;
  URL = URL + ");out body;>;out skel qt;";
  nodes = [];
  constructionInfo = [];
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
          constructionInfo.push(JSON.parse(data).elements[i])
        }
      }
      var finalInfoConstruction = {}
      var tempNodes = []
      var temp = {}
      var tempName = ""
      var minDist = Number.POSITIVE_INFINITY

      for (var i=0; i<constructionInfo.length; i++) {
        // console.log(constructionInfo[i])
        minDist = Number.POSITIVE_INFINITY
        temp = constructionInfo[i]
        tempName = "Construction " + (i+1).toString()
        tempNodes = constructionInfo[i].nodes
        delete temp['nodes'];
        finalInfoConstruction[tempName] = temp
        for (var y=0; y<tempNodes.length; y++) {
          for (var n=0; n<nodes.length; n++) {
            if (nodes[n].id === tempNodes[y]) {
              minDist = Math.min(minDist,  distance([lat, long], [nodes[n].lat, nodes[n].lon]))
            }
          }
        }
        finalInfoConstruction[tempName].shortestDistance = minDist
      }

      
      callback(undefined, {
        finalInfoConstruction
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve construction data.', undefined)
  });
  
}

module.exports = construction




const https = require('https');

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
      // console.log(info)
      callback(undefined, {
        constructionInfo
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve construction data.', undefined)
  });
  
}

module.exports = construction




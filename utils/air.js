const https = require('https');

const air = (lat, long, callback) => {
  // var lat = "43.558109";
  // var long = "-79.706352";
  var URL = 'https://overpass-api.de/api/interpreter?data=[out:json][timeout:50];('
  var aAN = 'node["aeroway"="aerodrome"](around:6000,' +  lat + ','+ long + ');'
  var aAW = 'way["aeroway"="aerodrome"](around:6000,' +  lat + ','+ long + ');'
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
    

  
      // console.log(JSON.parse(data).elements);
      for (var i=0; i<JSON.parse(data).elements.length; i++) {
        // console.log(JSON.parse(data).elements[i])
        if (JSON.parse(data).elements[i].type == "node") {
          nodes.push(JSON.parse(data).elements[i])
        } else {
          airInfo.push(JSON.parse(data).elements[i])
        }
      }
    //   console.log(airInfo)
      callback(undefined, {
        nodes
        })
    });
  
  }).on("error", (err) => {
    callback('Unable to retrieve air data.', undefined)
  });
  
}

module.exports = air




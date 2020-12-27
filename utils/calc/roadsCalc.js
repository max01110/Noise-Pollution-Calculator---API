const geocode =  require('../geocode'); //import geocode function
const roads = require('../roads'); //import road function



geocode(req.query.address, (error, {latitude, longitude, location} ={}) => {
    if (error) {
        return res.send({error})
    } else {
      roads(latitude, longitude, (error, {roadInfo} ={}) => {
        if (error) {
          dataResponse.roads = error
        } else {
          dataResponse.r
const path = require('path');
const express = require('express');
const cors = require('cors')
const PORT = process.env.PORT || 3030;
const geocode =  require('./utils/geocode'); //import geocode function
const roads = require('./utils/roads'); //import road function
const construction = require('./utils/construction'); //import construction function
const air = require('./utils/air'); //import air function

const { response } = require('express');
const { publicDecrypt } = require('crypto');

// const publicDirectory = path.join(__dirname, '../public') //sets directory of where html files are

let dataResponse = {
  roads: {},
  construction: {},
  air: {}
}

const app = express();


//Seting up cors confi
app.use(cors());

// app.use(express.static(publicDirectory))
//-----------------


let latitude1 = ""
let longitude1 = ""


app.get('', (req, res) => {
    return res.send({
            error: 'You must provide an address'
        })
})

app.get('/noise', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
            })
    } 

    geocode(req.query.address, (error, {latitude, longitude, location} ={}) => {
      if (error) {
          return res.send({error})
      } else {
        roads(latitude, longitude, (error, {finalInfo} ={}) => {
          if (error) {
            dataResponse.roads = error
          } else {
            console.log("passed roads")
            dataResponse.roads = finalInfo
            construction(latitude, longitude, (error, {finalInfoConstruction} ={}) => {
              if (error) {
                dataResponse.construction = error
              } else {
                console.log("passed construction")
                dataResponse.construction = finalInfoConstruction
                res.send({
                  roads: dataResponse.roads,
                  construction: dataResponse.construction,
                
                })
                // air(latitude, longitude, (error, {nodes} ={}) => {
                //   if (error) {
                //     dataResponse.air = error
                //   } else {
                //     console.log("passed air")
                //     dataResponse.air = nodes
                    
                //   }
                // })
              }
            })
          
            
           
          }
        })
      }

  
    })

    

})
  
app.listen(PORT), () => {
  console.log('Server is up and running on port ' + PORT);
}
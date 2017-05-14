'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
var repeat = false;
var followupEvent = '';
var MongoClient = require('mongodb').MongoClient
var mongo_collection = 'sales';
var speech = 'empty speech';
var allBrands = ['home', 'barn']

function setSpeech(newSpeech) {
    speech = newSpeech;
}

function getSpeech() {
   return speech;
}

function setRepeat(data) {
    repeat = repeat;
}

function getRepeat() {
   return repeat;
}

function setFollowupEvent(followupEventData) {
    followupEvent = followupEventData;
}

function getFollowupEvent() {
   return followupEvent ;
}



restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    try {
          speech = setSpeech(res, req.body);
          return;
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});
                
                
restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
        


function setSpeech(res, requestBody) { 

  setFollowupEvent('');
  if (requestBody.result) {

        if (requestBody.result.action) {
          getSalesFigureFromMongo(res, requestBody.result.parameters, requestBody.result.action)  
        }
    }
  return speech;
}



function getResponse(speech, parameters) {
                  
  var response = 
    { speech: speech,
      displayText: speech,
      source: 'apiai-webhook-sample'
       }

  if (getFollowupEvent() != '') {
    response.followupEvent = {
             name: getFollowupEvent(),
             data: parameters 
            }
          }
  return response;        
}          
          


function getSalesFigureFromMongo(res, parameters, action) {
 
  var query = {"date":parameters.date};
  const url = 'mongodb://jagannath_lenka:Apple123@ds031641.mlab.com:31641/nodejs';
  var response = '';

  MongoClient.connect(url, function(err, db) {
    
    var collection = db.collection(mongo_collection);
    
    if (query != null) {
        collection.find(query).toArray(function(err, docs) {

          if (err) {
            console.log(err)
            res.josn(err)
          } else {
          console.log(docs)
          if (docs.length > 0) {
            res.json(getResponse(getAction(parameters, action, docs), ''));
          }else {
           res.json(getResponse('Sorry I did not see any data for ' + parameters.date + ' , please let me know any other date' , '')); 
          }
          
          }  

        });  
      db.close();
    };
  });
  return response;
}


function getAction(parameters, action, docs) {

  var speech = ''
  switch(action) {
        case 'overall-sales':
          speech += overallSales(parameters, docs);
          break;
        case 'overall-sales.overall-sales-yes':
          speech += salesAllBrands(parameters, docs);
          break;
        case 'sales-by-brand':
            speech += salesByBrand(parameters, docs);
            break;
        case 'sales-by-brand-channel':
            speech += salesByBrandChannel(parameters, docs);
            break;
        case 'brand-fallback':
            speech += salesByBrand(action);
            break;
        default:
            speech += 'sorry, I am not able to find it';
  }
  console.log(speech);
  return speech;
}

function overallSales(parameters, salesData) {
    var speech = '' ;
    var totalSales = 0;
 
    console.log(salesData);
    for (var brand of salesData[0].brands) {
      for (var channel of brand.channels) {
        totalSales += channel.sales;
      }
    } 

    speech = 'Total sales figures for ' + parameters.date + ' is ' + totalSales + '. Would you like to know the sales figure for your brands?'; 
  return speech;
}
    
function salesAllBrands(parameters, salesData) {
  var speech = '' ;

  var totalSales = 0;
    
  for (var saveBrand of allBrands) { 

    for (var brand of salesData[0].brands) {
      
      if (brand.brand == saveBrand) {
        for (var channel of brand.channels) {
          totalSales += channel.sales;
        }
      }
    } 
    speech += saveBrand + ' is $' + totalSales + ' ';
    totalSales = 0; 
  }

    speech = 'Sales for ' + speech;
  return speech;
  
}

function salesByBrand(parameters, salesData) {
    var speech = '' ;
    
    var totalSales = 0;
 

    for (var brand of salesData[0].brands) {
      console.log(brand.brand + ' ' + parameters.brand)
      if (brand.brand == parameters.brand) {
        for (var channel of brand.channels) {
          totalSales += channel.sales;
        }
      }
    } 

    speech = 'Total sales for ' + parameters.brand + ' is $' + totalSales;   
  return speech;
  
}

function salesByBrandChannel(parameters, salesData) {
    var speech = '' ;
    var totalSales = 0;

    for (var brand of salesData[0].brands) {
      console.log(brand.brand + ' ' + parameters.brand)
      if (brand.brand == parameters.brand) {
        for (var channel of brand.channels) {
          if (channel.channel == parameters.channel) {
            totalSales += channel.sales;
          }  
        }
      }
    } 

    speech = 'Sales for ' + parameters.brand + ' ' + parameters.channel + ' is $' + totalSales;   
  return speech;
  
}


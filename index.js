'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
var repeat = false;
var followupEvent = '';


restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            speech = setSpeech(req.body);
        } 

        console.log('result: ', speech);
        return res.json(getResponse(speech, req.body.result.parameters)) 
        
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


function setSpeech(requestBody) {

  var speech = '';
  setFollowupEvent('');
  if (requestBody.result) {

        if (requestBody.result.action) {
        
          
          switch(requestBody.result.action) {
              case 'overall-sales':
                speech += overallSales(requestBody.result.parameters);
                break;
              case 'sales-by-brand':
                  speech += salesByBrand(requestBody.result.parameters);
                  break;
              case 'sales-by-channel-brand':
                  speech += salesByChannelBrand(requestBody.result.parameters);
                  break;
              case 'brand-fallback':
                  speech += salesByBrand(requestBody.result.parameters);
                  break;
              default:
                  speech += 'sorry, I am not able to find it';
          }

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
          

function overallSales(parameters) {
    var speech = '' ;

    console.log(parameters.brand);
    console.log(parameters);

    switch(true) {
      case (parameters.hasOwnProperty('brand') && parameters.brand != '') :
        speech = 'Good News, Sales for ' + parameters.date + ' is $4.5M already. This is better compared to last year.';
        break;
      default :
        speech = 'Good News, Sales for ' + parameters.date + ' is $4.5M already. This is better compared to last year.';
        break;
    }
        
  return speech;
}
                
function salesByBrand(parameters) {
    var speech = '' ;
    
    switch(parameters.brand) {
    case 'barn':
      speech += 'sales for ' + parameters.brand + ' $3M already, we are seeing a good trend.'
      break;
    case 'home':
      speech += 'sales for ' + parameters.brand + ' $200K already, trends are poor so far'
      break;
    case 'new marshal':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break; 
    case 'prestige':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break;         
    default:
      speech += 'sorry, I am not able to find any sales for ' + parameters.brand + '. Do you want to check any other brand?' ;
}
    
    return speech;
  
}

function salesByChannelBrand(parameters) {
    var speech = '' ;
    
    switch(1==1) {
    case parameters.brand == 'barn' && parameters.channel == 'online':
      speech += 'sales for ' + parameters.brand + parameters.channel  + ' $2M already, we are seeing a good trend for today. All the best !'
      break;

    case parameters.brand == 'barn' && parameters.channel == 'retail':
      speech += 'sales for ' + parameters.brand + parameters.channel  + ' $3M already. sales are poor compared to last year on the same day!'
      break; 

    case parameters.brand == 'home' && parameters.channel == 'online':
      speech += 'sales for ' + parameters.brand + parameters.channel  + ' $4M.'
      break; 

    case parameters.brand == 'home' && parameters.channel == 'retail':
      speech += 'sales for ' + parameters.brand + ' $200K already, trends are poor so far'
      break;
    case 'new marshal':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break; 
    case 'prestige':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break;         
    default:
      speech += 'sorry, I am not able to find any sales for ' + parameters.brand + '. Do you want to check any other brand?' ;
}
    
    return speech;
  
}
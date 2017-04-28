'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
var repeat = false;

function setRepeat(data) {
    repeat = repeat;
}

function getRepeat() {
   return repeat;
}

restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.action) {
                
                    
                    switch(requestBody.result.action) {
                        case 'overall-sales':
                          speech += overallSales(requestBody.result.parameters);
                          break;
                        case 'overall-sales.overall-sales-yes.overall-sales-yes-custom':
                            speech += salesByBrand(requestBody.result.parameters);
                            break;
                        case 'brand-fallback':
                            speech += salesByBrand(requestBody.result.parameters);
                            break;
                        default:
                            speech += 'sorry, I am not able to find it';
                    }

                }
        
            }
        } 
        console.log('result: ', speech);

        if (getRepeat() == true) {
            return res.json({
                speech: speech,
                displayText: speech,
                source: 'apiai-webhook-sample',
                followupEvent: 'overall-sales - yes - custom'
            }) 
        }   else {
            return res.json({
               speech: speech,
               displayText: speech,
               source: 'apiai-webhook-sample'
            })
        };

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
                

function overallSales(parameters) {
    var speech = '' ;
    return 'sales for ' + parameters.date + ' is good compared to last year. Do you want to know the sales for any specific brand?';
  
}
                
function salesByBrand(parameters) {
    var speech = '' ;
    
    switch(parameters.brand) {
    case 'super light':
      speech += 'sales for ' + parameters.brand + ' $3M already, we are seeing a good trend.'
      break;
    case 'megan':
      speech += 'sales for ' + parameters.brand + ' $200K already, trends are poor so far'
      break;
    case 'new beauty':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break; 
    case 'lux designer':
      speech += 'sales for ' + parameters.brand + ' $800K already, trends similar to last year. Hopefully it will be better after 10 am'
      break;         
    default:
      speech += 'sorry, I am not able to find any sales for ' + parameters.brand + '. Do you want to check any other brand?' ;
      setRepeat(true);
}
    
    return speech;
  
}

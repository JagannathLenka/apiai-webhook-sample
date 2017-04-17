'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                /*if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }*/

                if (requestBody.result.action) {
                
                    
                    switch(requestBody.result.action) {
                        case 'overall-sales':
                          speech += overallSales(requestBody.result.parameters)
                          break;
                        case 'overall-sales.overall-sales-yes.overall-sales-yes-custom':
                            speech += salesByBrand(requestBody.result.parameters)
                        default:
                            speech += 'sorry, I am not able to find it';
                    }

                }
        
            }
        } 
        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
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
    return 'sales for ' + parameters.brand + ' is good compared to last year. Do you want to know the sales for any specific brand?';
  
}

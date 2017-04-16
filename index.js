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
                    //speech += 'action: ' + requestBody.result.action;
                }
               if (requestBody.result.parameters) {
                   speech += 'Overall sales we are doing good today. It is slightly more than last year same time. ';
                   speech += 'https://dashboard.heroku.com ' ;
                   speech += 'Do you want to know, sales figure for any specific brand';
                   //speech += 'sales for '+ requestBody.result.parameters.brand + ' are doing awesome!';
               } else {
                   speech += 'Sorry, I did not get any brand';
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

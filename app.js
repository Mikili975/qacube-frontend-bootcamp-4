const Twitter = require('twitter');
const config = require('./scripts/config.js');
const express = require('express');

const client = new Twitter(config);
const app = express();
const port = 5000;

app.use(express.static(__dirname));
app.get('/api/tweets/:sn', (req, res, next) => {
    let params = {
        screen_name: req.params.sn,
        count: 100,
        result_type: "recent",
        lang: "en"
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            res.json(tweets);
        }
    });
});
app.get('/api/tweet/:sn/:id', (req, res, next) => {    
    let params = {
        url: 'https://twitter.com/' + req.params.sn + '/status/' + req.params.id
    };    
    client.get('statuses/oembed', params, function (error, tweets, response) {
        if (!error) {
            res.json(tweets);
        }
    });   
});
app.listen(port);

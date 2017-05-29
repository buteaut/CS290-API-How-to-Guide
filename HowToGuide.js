/**
 * Author: Thomas Buteau
 * Class: CS290-400
 * Assignment: API How-To Guide
 * Due Date: 5-28-17
 */

var express = require('express');
var request = require('request');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/', function(req,res){
    //POST request for Token
    request({"url":"https://api.thetvdb.com/login", "method":"POST", "headers":{"Content-Type":"application/json"}, "body":'{"apikey":"F81BE2409EA511BB","userkey":"6979FCE9ACA3D94E","username":"testOSU"}'},
        function(err, httpResponse, body){
            var token = "Bearer ";
            //console.log(body);
            var tokenResponse = [];
            tokenResponse = JSON.parse(body);
            token += tokenResponse.token;
            console.log("Token response: " + token);
            var context = {};
            context.tokenResponse = tokenResponse;

            //Get request for series info
            request({"url":"https://api.thetvdb.com/search/series?name=farscape", "method":"GET", "headers":{"Authorization":token}},
                function(err, httpResponse, body) {
                    var seriesResponse = JSON.parse(body);
                    var test = [];
                    for (var item in seriesResponse.data[0])
                    {
                        test.push({'name':item,'value':seriesResponse.data[0][item]});

                    }
                    console.log(test);
                    context.seriesResponse = test;

                    //Get user favorites
                    request({"url":"https://api.thetvdb.com/user/favorites", "method":"GET", "headers":{"Authorization":token}},
                        function(err, httpResponse, body) {
                            var userResponse = JSON.parse(body);
                            var test = [];
                            for (var item in userResponse.data)
                            {
                                test.push({'name':item,'value':userResponse.data[item]});

                            }
                            console.log(test);
                            context.userResponse = test;
                            res.render('home', context);
                        });
                });
        });
});

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
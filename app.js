var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var url = require('url');
var async = require('async');
var flickrClient = require('./flickrClient');
var panoramioClient = require('./panoramioClient');
var Query = require('./Query');
var _ = require('underscore');

var app = express();
app.use(bodyParser({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(3000, function() {
});

app.get('/getPhotos', function(req, res){

    var longitude = Number(req.query.longitude);
    var latitude = Number(req.query.latitude);
    var query = new Query(longitude,latitude);

    async.series([
        function(callback){
            if(req.query.flickr=="false"){
                return callback(null, []);
            }
            flickrClient.getPhotoInfoList(query.generate('flickr'), callback);
        },
        function(callback){
            if(req.query.panoramio=="false"){
                return callback(null, []);
            }
            panoramioClient.getPhotoInfoList(query.generate('panoramio'), callback);
        }
    ], function(error, result){
        if(error){
        }
        res.json(_.flatten(result));

    });

})

app.use(express.static('static'));

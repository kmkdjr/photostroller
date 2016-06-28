var HttpsProxyAgent = require('https-proxy-agent');
var request = require('request');
var _ = require('underscore');
var Photo = require('./Photo');
var config = require('./config');

var agent = new HttpsProxyAgent(config.proxy);

var flickrBaseUrl = 'https://api.flickr.com/services/rest/';

var getPhotoInfoList = function(params,callback){
    request.get({
        url: flickrBaseUrl,
        qs: params,
        agent: agent
    }, function(error, res, body){
        if(error){
            return callback(error);
        }
        var result = JSON.parse(body);
        if(!result || !result.photos || !result.photos.photo){
            return callback(true);
        }
        var photoList = _.map(result.photos.photo, function(item){
            return new Photo(item.title, item.url_t, item.longitude, item.latitude);
        })
        callback(null, photoList);
    })
};

module.exports = {
    getPhotoInfoList: getPhotoInfoList
}

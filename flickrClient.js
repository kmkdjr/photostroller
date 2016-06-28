var HttpsProxyAgent = require('https-proxy-agent');
var request = require('request');
var _ = require('underscore');
var Photo = require('./Photo');
var config = require('./config')

var agent = new HttpsProxyAgent(config.proxy);

var flickrBaseUrl = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1';
var flickSearchUrl = flickrBaseUrl + "&method=flickr.photos.search"

var getPhotoInfoList = function(params,callback){
    var paramsText = _.chain(params).pairs().reduce(function(memo, item){
        return memo+"&"+item[0]+"="+item[1];
    }, "").value();

    request.get({
        url: flickSearchUrl+paramsText,
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

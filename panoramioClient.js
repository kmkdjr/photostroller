var HttpsProxyAgent = require('https-proxy-agent');
var request = require('request');
var _ = require('underscore');
var Photo = require('./Photo');
var config = require('./config');

var agent = new HttpsProxyAgent(config.proxy);

var panoramioBaseUrl = 'http://www.panoramio.com/map/get_panoramas.php';

var getPhotoInfoList = function(params,callback){
    request.get({
        url: panoramioBaseUrl,
        qs: params,
        agent: agent
    }, function(error, res, body){
        if(error){
            return callback(error);
        }
        var result = JSON.parse(body);
        if(!result || !result.photos){
            return callback(true);
        }
        var photoList = _.map(result.photos, function(item){
            return new Photo(item.photo_title, item.photo_file_url, item.longitude, item.latitude);
        });
        callback(null, photoList);
    })
};

module.exports = {
    getPhotoInfoList: getPhotoInfoList
}

var request = require('request');
var _ = require('underscore');
var Photo = require('./Photo');
var config = require('./config');

var panoramioBaseUrl = 'http://www.panoramio.com/map/get_panoramas.php?set=public';

var getPhotoInfoList = function(params,callback){
    var paramsText = _.chain(params).pairs().reduce(function(memo, item){
        return memo+"&"+item[0]+"="+item[1];
    }, "").value();

    request.get({
        url: panoramioBaseUrl+paramsText,
        proxy: config.proxy
    }, function(error, res, body){
        if(error){
            return callback(error);
        }
        var result = JSON.parse(body);
        if(!result || !result.photos){
            return callback(true);
        }
        console.log(result.photos[1]);
        var photoList = _.map(result.photos, function(item){
            return new Photo(item.photo_title, item.photo_file_url, item.longitude, item.latitude);
        });
        //console.log(photoList);
        callback(null, photoList);
    })
};

module.exports = {
    getPhotoInfoList: getPhotoInfoList
}

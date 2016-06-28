var _ = require('underscore');
var config = require('./config');

var Query = function(longitude, latitude){
    this.minx = parse(longitude - 0.0010);
    this.miny = parse(latitude - 0.0010);
    this.maxx = parse(longitude + 0.0010);
    this.maxy = parse(latitude + 0.0010);
};

module.exports = Query

Query.prototype.generate = function(type){
    switch (type) {
        case 'panoramio':
            return _.extend(panoramioBaseQuery, this);
            break;
        case 'flickr':
            return _.extend(flickrBaseQuery, {bbox: this.minx + "," + this.miny + "," + this.maxx + "," + this.maxy})
            break;
        default:

    }
};

function parse(value){
    return String(Math.round(value*1000)/1000);
}

var panoramioBaseQuery = {
    from: "0",
    to: "50",
    minx:"139.66",
    miny:"35.57",
    maxx:"139.67",
    maxy:"35.58",
    size:"small",
    mapfilter:"true"
};

var flickrBaseQuery = {
    bbox: "139.66,35.57,139.67,35.58",
    extras: "geo,url_t,owner_name",
    api_key: config.flickrKey
};

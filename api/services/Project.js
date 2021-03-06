var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    description: {
        type: String
    },
    gitName: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    mockUrl: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    developmentUrl: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    testingUrl: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    productionUrl: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    git: {
        type: String,
        required: true,
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Project', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
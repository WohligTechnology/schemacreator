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
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    order: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    isDelete: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    isEdit: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    isExcelImport: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    isExcelExport: {
        type: Boolean,
        default: true,
        enum: [true, false]
    },
    collectionFields: [{
        name: {
            type: String
        },
        type: {
            type: Schema.Types.ObjectId,
            ref: "Field"
        },
        validations: {
            type: String
        },
        json: {
            type: JSON
        },
        order: {
            type: String
        },
        isView: {
            type: Boolean,
            default: true,
            enum: [true, false]
        },
        isHidden: {
            type: Boolean,
            default: true,
            enum: [true, false]
        }
    }]
});

schema.plugin(deepPopulate, {
    Populate: {
        'Project': {
            select: '_id name'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Collection', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"project","project"));
var model = {};
module.exports = _.assign(module.exports, exports, model);
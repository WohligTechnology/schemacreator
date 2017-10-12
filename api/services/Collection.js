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
var fs = require('fs');
var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"project type","project type"));
var model = {generateProject: (data,cb)=>{
    Collection.find({
        "project":data._id
    }).exec((err,result)=>{
        if(err || _.isEmpty(result)){
            console.log("error:", err);
            console.log("result",result);
            cb("there was some error");
        }else{
            // console.log("collectiondata$$$$$$$$$$$$$$$$$",result);
            var obj = {};
            obj.fields = [];
            obj.fields[0]={};
            obj.action = [];
            obj.action[0] ={};
            console.log(obj)
            obj.title = "viewJSON";
            obj.description = "list of json";
            obj.pageType = "view",
            obj.sendIdWithCreate = true,
            obj.urlFields = ["_id"],
            obj.fields[0].name= "Name";
            obj.fields[0].isSort= ""
            obj.fields[0].tableRef= "name"
            obj.action[0].name= "edit"
            obj.action[0].icon= "fa-pencil",
            obj.action[0].buttonClass= "btn-primary",
            obj.action[0].type= "page",
            obj.action[0].action= "editProject",
            obj.action[0].fieldsToSend= {
                "_id": "_id"
            }
            var json = JSON.stringify(obj); 
            fs.writeFile('CREATEDJSON/myjsonfile.json', json);
            cb(null,result)
        }
    })
}};
module.exports = _.assign(module.exports, exports, model);
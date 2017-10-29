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
var model = {
    generateProject: (data,cb)=>{
// console.log("done")
    Collection.find({
        "project":data._id
    }).exec((err,result)=>{
        if(err || _.isEmpty(result)){
            console.log("error:", err);
            console.log("result",result);
            cb("there was some error");
        }else{
          console.log("##################",result[0].collectionFields);
            async.each(result,(collection,callback)=>{
                async.parallel({
                    view: function(callback){
                        var viewobj = {};
                        viewobj.fields = [];
                        viewobj.action = [];
                        viewobj.title = "view"+collection.name;
                        viewobj.description = "list of "+collection.name;
                        viewobj.pageType = "view";
                        viewobj.sendIdWithCreate = true;
                        viewobj.urlFields = ["_id"];
                        for(var i=0;i<=collection.collectionFields.length - 1;i++){
                            if(collection.collectionFields[i].isView === true){
                                var vft = {}
                                vft.name = collection.collectionFields[i].name;
                                vft.isSort= "";
                                vft.tableRef = collection.collectionFields[i].name;
                                viewobj.fields.push(vft);
                            }

                        }
                        callback(null,viewobj);
                    },
                    create: function(callback){
                        var createobj = {};
                        createobj.fields = [];
                        createobj.action = [];
                        createobj.action[0] = {};
                        createobj.title = "create"+collection.name;
                        createobj.name = collection.name;
                        createobj.jsonPage = "view"+collection.name;
                        createobj.description = "";
                        createobj.pageType = "create";
                        createobj.urlFields = [collection.name];
                        for(var i=0;i<=collection.collectionFields.length - 1;i++){
                                var cft = {}
                                cft.name = collection.collectionFields[i].name;
                                cft.type = collection.collectionFields[i].type;
                                cft.isSort= "";
                                cft.id = collection.collectionFields[i].name;
                                cft.placeHolder = "Enter "+collection.collectionFields[i].name;
                                cft.tableRef = collection.collectionFields[i].name;
                                cft.validation = collection.collectionFields[i].validations;
                                cft.url = collection.collectionFields[i].url;
                                createobj.fields.push(cft);
                            }
                            createobj.action[0].name = "submit";
                            createobj.action[0].action = "submit"+collection.name;
                            createobj.action[0].stateName = {
                              "page":"page",
                              "json":{
                                "id":"view"+collection.name
                              }
                            };
                            createobj.apiCall = {
                              "url": collection.name+"/save"
                            }

                            callback(null,createobj);
                    },
                    edit: function(callback){
                        var editobj = {};
                        editobj.fields = [];
                        editobj.action = [];
                        editobj.title = "edit"+collection.name;
                        editobj.description = "";
                        editobj.pageType = "edit";
                        editobj.sendIdWithCreate = true;
                        editobj.urlFields = ["_id"];
                        for(var i=0;i<=collection.collectionFields.length - 1;i++){
                            var eft = {}
                            eft.name = collection.collectionFields[i].name;
                            eft.isSort= "";
                            eft.tableRef = collection.collectionFields[i].name;
                            editobj.fields.push(eft);
                        }
                        callback(null,editobj);
                    }
                },function(err, collectionresults){
                    if(err){
                        cb(err);
                    }else{
                        // console.log("executing filestream",collectionresults.view)

                        var json = JSON.stringify(collectionresults.view,undefined,4);
                        fs.writeFile('CREATEDJSON/'+collectionresults.view.title+'.json', json);
                        var json = JSON.stringify(collectionresults.create,undefined,4);
                        fs.writeFile('CREATEDJSON/'+collectionresults.create.title+'.json', json);
                        var json = JSON.stringify(collectionresults.edit,undefined,4);
                        fs.writeFile('CREATEDJSON/'+collectionresults.edit.title+'.json', json);

                }
                })
                callback();
            },function(err){
                if(err){
                    cb(err);
                }else{
                    cb(null,result)
                }
            })

        }
    })
}};
module.exports = _.assign(module.exports, exports, model);

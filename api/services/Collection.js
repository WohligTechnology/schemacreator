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
            ref: "Type"
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

        },
        isHidden: {
            type: Boolean,

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
var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"project Types","project Types"));
var model = {
    generateProject: (data,cb)=>{
// console.log("done")
Collection.aggregate(

        // Pipeline
        [
            // Stage 1
            {
                $match: {
                "project":ObjectId(data._id)
                }
            },

            // Stage 2
            {
                $unwind: {
                    path : "$collectionFields",
                    includeArrayIndex : "arrayIndex", // optional
                    preserveNullAndEmptyArrays : true // optional
                }
            },

            // Stage 3
            {
                $lookup: {
                    "from" : "types",
                    "localField" : "collectionFields.type",
                    "foreignField" : "_id",
                    "as" : "collectionFields.type"
                }
            },

            // Stage 4
            {
                $unwind: {
                    path : "$collectionFields.type",
                    includeArrayIndex : "arrayIndex", // optional
                    preserveNullAndEmptyArrays : false // optional
                }
            },

            // Stage 5
            {
                $group: {
                 _id:"$name",
                 name:{
                 $first:"$name"
                 },
                 collectionFields:{
                 $push:"$collectionFields"
                 }
                }
            },

        ]

        // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

    ).exec((err,result)=>{
        if(err || _.isEmpty(result)){
            console.log("error:", err);
            console.log("result",result);
            cb("there was some error");
        }else{
        //   console.log("##################",result[0].collectionFields);
            async.each(result,(collection,callback)=>{
                async.parallel({
                    view: function(callback){
                        var viewobj = {};
                        viewobj.fields = [];
                        viewobj.action = [];
                        viewobj.button = [];
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
                        if(collection.isEdit == true){
                            var tempedit = {
                                "name": "edit",
                                "icon": "fa-pencil",
                                "buttonClass": "btn-primary",
                                "type": "page",
                                "action": "edit"+collection.name,
                                "fieldsToSend": {
                                    "_id": "_id"
                                }
                            }
                            var createbtn = {
                                "name": "Create",
                                "icon": "plus",
                                "class": "btn-success",
                                "type": "page",
                                "action": "create"+collection.name
                            }
                            viewobj.action.push(tempedit);
                            viewobj.button.push(createbtn);
                        }
                        if(collection.isDelete == true){
                            var tempdel = {
                                "name": "delete",
                                "icon": "fa-trash",
                                "buttonClass": "btn-danger",
                                "type": "apiCallConfirm",
                                "title": "Delete Product",
                                "content": "Are you sure you want to delete Product?",
                                "api": collection.name+"/delete",
                                "fieldsToSend": {
                                    "name": "_id",
                                    "value": "_id"
                                }
                            }
                            viewobj.action.push(tempdel);
                        }
                        if(collection.isExcelImport == true){
                            var tempei = {
                                "name": "Upload Excel",
                                "icon": "delete",
                                "class": "btn-warning",
                                "type": "redirect",
                                "action": "excel-upload/"+collection.name,
                                "linkType": "internal"
                            }
                            viewobj.button.push(tempei);
                        }
                        if(collection.isExcelExport == true){
                            var tempee = {
                                "name": "Excel Export",
                                "icon": "print",
                                "class": "btn-danger",
                                "type": "redirect",
                                "action": collection.name+"/generateExcel",
                                "linkType": "admin"
                            }
                            viewobj.button.push(tempee);
                        }
                        viewobj.apiCall= {
                            "url": collection.name+"/search",
                            "params": "_id"
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
                                cft.type = collection.collectionFields[i].type.name;
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
                        //   }else{
                        //     callback(null,undefined)
                        //   }

                    },
                    edit: function(callback){

                    //    if(collection.isEdit==true){
                        console.log("isedit::::::",collection.isEdit)
                        var editobj = {};
                        editobj.fields = [];
                        editobj.action = [];
                        editobj.action[0] = {};
                        editobj.title = "edit"+collection.name;
                        editobj.description = "";
                        editobj.pageType = "edit";
                        editobj.sendIdWithCreate = true;
                        editobj.urlFields = ["_id"];
                        for(var i=0;i<=collection.collectionFields.length - 1;i++){
                            var eft = {}
                            eft.name = collection.collectionFields[i].name;
                            eft.type = collection.collectionFields[i].type.name;
                            eft.isSort= "";
                            eft.tableRef = collection.collectionFields[i].name;
                            eft.id = collection.collectionFields[i].name;
                            eft.placeHolder = "Enter "+collection.collectionFields[i].name;
                            eft.validation = collection.collectionFields[i].validations;
                            eft.url = collection.collectionFields[i].url;
                            editobj.fields.push(eft);

                        }
                        editobj.action[0].name = "save";
                        editobj.action[0].action = "save"+collection.name;
                        editobj.action[0].stateName = {
                          "page":"page",
                          "json":{
                            "id":"view"+collection.name
                          }
                        };
                        editobj.apiCall = {
                          "url": collection.name+"/save",
                          "params": "_id"
                        }
                        editobj.preApi = {
                          "url": "Product/getOne",
                          "params": "_id"
                          }
                        callback(null,editobj)
                    // }else{
                    //     callback(null,undefined);
                    // }
                    }
                },function(err, collectionresults){
                    if(err){
                        cb(err);
                    }else{
                         console.log("executing filestream",collectionresults.edit)

                        var json = JSON.stringify(collectionresults.view,undefined,4);
                        fs.writeFile('CREATEDJSON/'+collectionresults.view.title+'.json', json);
                        if(collectionresults.create != undefined){
                        var json = JSON.stringify(collectionresults.create,undefined,4);
                        fs.writeFile('CREATEDJSON/'+collectionresults.create.title+'.json', json);
                      }
                        if(collectionresults.edit != undefined){
                          var json = JSON.stringify(collectionresults.edit,undefined,4);
                          fs.writeFile('CREATEDJSON/'+collectionresults.edit.title+'.json', json);
                        }


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

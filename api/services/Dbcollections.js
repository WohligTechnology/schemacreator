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
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Dbcollections', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
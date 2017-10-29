module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    generateProject : (req,res)=>{
        console.log("api called::::::::::::::::::",req.body);
        if(req.body){
            Collection.generateProject(req.body,res.callback)
        }else{
            res.callback("invalid params");
        }

    }
};
module.exports = _.assign(module.exports, controller);

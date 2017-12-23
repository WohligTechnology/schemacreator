module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    generateProject : (req,res)=>{
        // console.log("api called::::::::::::::::::",req.body);
        if(req.body){
            Collection.generateProject(req.body,res.callback)
        }else{
            res.callback("invalid params");
        }

    },
    save:(req,res)=>{
        
        if(req.body){
            User.findOne({
                accessToken:{$in:[req.body.accesstoken]}
            }).exec((err,result)=>{
                if(err||_.isEmpty(result)){
                    res.callback("User not found");
                }else{
                    req.body.accesstoken="";
                    req.body.user = result._id;
                    Project.saveData(req.body,res.callback);
                }
            })
        }else{
            res.callback("invalid parameter")
        }
    }
};
module.exports = _.assign(module.exports, controller);

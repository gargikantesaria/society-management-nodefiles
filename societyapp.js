var exp = require("express");
var bodyParser = require("body-parser");
var app = exp();
require('dotenv').config();
var router=exp.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var usermodule=require("./modules/usermodule.js");
var vehiclemodule=require("./modules/vehiclemodule.js");
var feedmodule=require("./modules/feedmodule.js")
var userschema=require("./userschema.js")

console.log(process.env.PORT);
app.use(function (req, res, next) {
    
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS,PATCH');
        res.setHeader('Access-Control-Allow-Headers','X-Requested-With,authtoken,isadmintoken,Accept,Content-Type,Authorization')
        // Pass to next layer of middleware
        next();
});
 
app.use(router);
app.get("",function(req,res){
    console.log("home page");
    res.send("done")
})

// app.post("/storeimage",function(req,res){
// var path="";
//     upload(req,res,function(err){
//         if(err)
//         {
//             console.log(err);
//             res.send({body:"error arrieved"})
//         }
//         else{
//             // path=req.file.path;
//             //mimetype=req.file.mimetype;
//             path=req.file.filename+"."+req.file.mimetype.substr(6,(req.file.mimetype.length-1));
//             res.send({body:JSON.parse(req.body.formdata),data:path});
//             console.log(path);
//         }

//     })

// })


//app.post("/signup",usermodule.signup)
router.route("/signup").post(usermodule.signup)

//app.post("/loginform",usermodule.login)
router.route("/loginform").post(usermodule.login)

// app.get("/userdata",isloggin,usermodule.userdata)
router.route("/userdata").get(isloggin,usermodule.userdata)

// app.post("/addvehicleform",isloggin,vehiclemodule.addvehicledata)
router.route("/addvehicleform").post(isloggin,vehiclemodule.addvehicledata)

// app.get("/listallvehicles",isloggin,vehiclemodule.listallvehicle)
router.route("/listallvehicles").get(isloggin,vehiclemodule.listallvehicle)

// app.get("/listmyvehicles",isloggin,vehiclemodule.listmyvehicle)
router.route("/listmyvehicles").get(isloggin,vehiclemodule.listmyvehicle)

// app.delete("/deletemyvehicles/:id",isloggin,vehiclemodule.deletemyvehicle)
router.route("/deletemyvehicles/:id").delete(isloggin,vehiclemodule.deletemyvehicle)

// app.put("/editmyvehicles/:id",isloggin,vehiclemodule.editmyvehicle)
router.route("/editmyvehicles/:id").put(isloggin,vehiclemodule.editmyvehicle)

// app.post("/addfeedform",isloggin,feedmodule.addfeedform)
router.route("/addfeedform").post(isloggin,feedmodule.addfeedform)

// app.get("/displayfeedform",isloggin,feedmodule.displayfeedform)
router.route("/displayfeedform/:page").get(isloggin,feedmodule.displayfeedform)

// app.post("/addcommentform/:id",isloggin,feedmodule.addcomment)
router.route("/addcommentform/:id").post(isloggin,feedmodule.addcomment)

// app.get("/addlikes/:id",isloggin,feedmodule.addlikes)
router.route("/addlikes/:id").get(isloggin,feedmodule.addlikes)

// app.post("/findmaintainence",isloggin,isadmin,usermodule.maintainencedata)
router.route("/findmaintainence").post(isloggin,isadmin,usermodule.maintainencedata)


function isloggin(req,res,next)
{
    var authtoken=req.headers.authtoken;
    console.log(authtoken);
    userschema.findOne({signuptoken:authtoken},function(err,data)
    {
        if(data===null || err)
        {
            res.status(401).send({body:"you are not authenticated"});
        }
        else 
        {
            req.body.userid=data._id;
            next();
        }
    })
}

function isadmin(req,res,next)
{
    var authtoken=req.headers.authtoken;
    userschema.findOne({signuptoken:authtoken},function(err,data){
        if(data.isadmintoken==1)
        {
            next();
        }
        else
        {
            res.send({body:"unauthorised to acess"});
        }
    })
    
}

app.listen(process.env.PORT,function(){
    console.log("server started");
})
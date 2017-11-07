var mon=require("mongoose");
mon.connect(process.env.DB_URL);

var userstruct = mon.Schema({

    firstname:String,
    lastname:String,
    birthdate:String,
    email:String,
    password:String,
    flatpurchasedate:String,
    picture:String,
    flatblock:String,
    flatno:String,
    signuptoken:String,
    isadmintoken:{
        type:Number,
        default:0
    },
    
    maintainence:[{
        ispaid:Boolean,
        month:Number   
    }]

})
var users = mon.model("usermodel", userstruct);

module.exports=users;
var mon=require("mongoose");
mon.connect("mongodb://localhost/societymanagement_app");

var feedwallstruct =new mon.Schema({

    userid:{
        type:mon.Schema.Types.ObjectId,
        ref:"usermodel"
    },
    feedstatus:String,
    feedimage:String,
    likeschema:[{
        userid:{
            type:mon.Schema.Types.ObjectId,
            ref:"usermodel"
        },
    }],
    commentschema:[{
        userid:{
            type:mon.Schema.Types.ObjectId,
            ref:"usermodel"
        },
        comment:String
    }],
    


})
var users = mon.model("feedwallmodel", feedwallstruct);

module.exports=users;
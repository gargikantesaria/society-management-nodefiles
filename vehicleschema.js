var mon=require("mongoose");
mon.connect("mongodb://localhost/societymanagement_app");

var vehiclestruct = mon.Schema({
    userid:String,
    vehicletype:String,
    vehicleregistrationno:String,
    vehiclecolor:String,
    
})
var vehicles = mon.model("vehiclemodel", vehiclestruct);

module.exports=vehicles;
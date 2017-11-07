var mon=require("mongoose");
mon.connect(process.env.DB_URL);

var vehiclestruct = mon.Schema({
    userid:String,
    vehicletype:String,
    vehicleregistrationno:String,
    vehiclecolor:String,
    
})
var vehicles = mon.model("vehiclemodel", vehiclestruct);

module.exports=vehicles;
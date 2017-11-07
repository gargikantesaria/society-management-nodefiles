var vehicleschema = require("../vehicleschema.js");

///add vehicle data function////

exports.addvehicledata = function (req, res) {

    vehicletype = req.body.vehicletype;
    vehicleregistrationno = req.body.vehicleregistrationno;
    vehiclecolor = req.body.vehiclecolor;
    userid = req.body.userid;
    console.log(userid);
    var vehicledata = { vehicletype: vehicletype, vehicleregistrationno: vehicleregistrationno, vehiclecolor: vehiclecolor, userid: userid }

    vehicleschema.create(vehicledata, function (err, body) {
        if (err) {
            console.log("error arrive in adding vehicle data");
        }
        else {
            console.log("vehicle data added");
            res.send({ body: "vehicle data added", data: body }, 200);
        }
    })
}

/////listall vehicle function////

exports.listallvehicle = function (req, res) {

    vehicleschema.find({}, function (err, data) {
        if (err) {
            console.log("error arrive in getting vehicle data");
        }
        else {
            console.log("data get successfully");
            res.send(data)
        }
    })
}

///list myvehicle function ////

exports.listmyvehicle = function (req, res) {

    userid = req.body.userid;
    vehicleschema.find({ userid }, function (err, data) {
        if (err) {
            console.log("error arrive in getting  your vehicle data");
        }
        else {
            console.log(" your data get successfully");
            res.send(data);
        }
    })
}

////delete my vehicle /////

exports.deletemyvehicle = function (req, res) {

    vehicleid = req.params.id;
    console.log(vehicleid)
    vehicleschema.findByIdAndRemove({ _id: vehicleid }, function (err, data) {
        if (err) {
            console.log("data is not deleted", err)
        }
        else {
            res.send({ body: "data is deleted" }, 200)
            console.log("data deleted");
        }
    })
}


///edit my vehicle /////

exports.editmyvehicle = function (req, res) {

    vehicleid = req.params.id;
    console.log(vehicleid);
    vehicletype = req.body.vehicletype;
    vehicleregistrationno = req.body.vehicleregistrationno;
    vehiclecolor = req.body.vehiclecolor;
    userid = req.body.userid;
    var vehicledata = { vehicletype: vehicletype, vehicleregistrationno: vehicleregistrationno, vehiclecolor: vehiclecolor, userid: userid }

    vehicleschema.findByIdAndUpdate({ _id: vehicleid }, vehicledata, function (err, data) {
        if (err) {
            console.log("data is not updated", err)
        }
        else {
            res.send({ body: "data is updated" }, 200)
            console.log("data updated");
        }
    })
}
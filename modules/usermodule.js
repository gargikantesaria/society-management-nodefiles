var jwt = require('jsonwebtoken');
var userschema = require("../userschema.js")

var multer = require('multer');
var md5 = require('md5');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({ dest: DIR }).single('photo');

//////signup function//////

exports.signup = function (req, res) {
    var path = "";
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.send({ body: "error arrieved" })
        }
        else if (req.file) {

            // path=req.file.path;
            //mimetype=req.file.mimetype;
            path = req.file.filename + "." + req.file.mimetype.substr(6, (req.file.mimetype.length - 1));
            //res.send({body:JSON.parse(req.body.formdata),data:path});
        }
        console.log(req.body.formdata);
        var formdata = JSON.parse(req.body.formdata);
        firstname = formdata.firstname;
        lastname = formdata.lastname;
        birthdate = formdata.birthdate;
        email = formdata.email;
        password = formdata.password;
        var encryptpassword = md5(password);
        console.log(encryptpassword);
        flatpurchasedate = formdata.flatpurchasedate;
        //picture=req.file.picture;
        picturefilenm = path;
        flatblock = formdata.flatblock;
        flatno = formdata.flatno;

        var token = jwt.sign(email, "secretmsg");

        var userdata = { firstname: firstname, lastname: lastname, birthdate: birthdate, email: email, password: encryptpassword, flatpurchasedate: flatpurchasedate, picture: "./uploads/" + picturefilenm, flatblock: flatblock, flatno: flatno, signuptoken: token, maintainence: [{ ispaid: true, month: 7 }] }
        //console.log(req.body); return

        userschema.create(userdata, function (err, body) {
            if (err) {
                console.log("error arrive");
            }
            else {
                console.log("data inserted");
                res.send({ message: "data stored", data: body }, 200);
            }
        })
    })
}

/////login function ///////

exports.login = function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var encryptpassword = md5(password);
    console.log(encryptpassword);

    console.log(req.body);
    userschema.findOne({ email }, function (err, data) {

        console.log(data);
        if (data === null) {
            res.send({ body: "data not found" }, 400);
            return;
        }
        else {
            if (data.email === email && data.password === encryptpassword) {
                res.send({ body: "login successfull", data: data }, 200);
                console.log("login successful");
            }
            else {
                res.send({ body: "try again" }, 400);
                return;
            }
        }

    })
}


////userdata function/////

exports.userdata = function (req, res) {

    userid = req.body.userid;
    userschema.findOne({ _id: userid }, function (err, data) {
        if (err) {
            res.send({ body: "error in finding userdata" });
        }
        else {
            console.log(data);
            res.send({ data: data, body: "userdata found" });
        }
    })
}

////user maintainenece data

exports.maintainencedata = function (req, res) {
    month = req.body.month;
    block = req.body.block;
    userid = req.body.userid;

    userschema.find({ 'maintainence.month': month, 'flatblock': block }, function (err, data) {

        if (err) {
            console.log("maintainence data cant displayed");
            res.send({ body: "maintainence data is not found" });
        }
        else {
            console.log("maintainence data displayed");
            res.send({ body: "maintainence data found", data: data });
        }
    })
}
var exp = require("express");
var bodyParser = require("body-parser");
var app = exp();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jwt=require('jsonwebtoken');
var userschema=require("./userschema.js")
var vehicleschema=require("./vehicleschema.js");
var feedwallschema=require("./feedwallschema.js");
var commentschema=require("./commentschema.js");
var likesschema=require("./likeschema.js");
var multer = require('multer');
var md5=require('md5');
// set the directory for the uploads to the uploaded to
var DIR = './uploads/';
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
var upload = multer({dest: DIR}).single('photo');

app.use(function (req, res, next) {
    
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS,PATCH');
        res.setHeader('Access-Control-Allow-Headers','X-Requested-With,authtoken,isadmintoken,Accept,Content-Type,Authorization')
        // Pass to next layer of middleware
        next();
});
 

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


app.post("/signup",function(req,res)
{
    var path="";
        upload(req,res,function(err){
            if(err)
            {
                console.log(err);
                res.send({body:"error arrieved"})
            }
            else if(req.file){

                // path=req.file.path;
                //mimetype=req.file.mimetype;
                path=req.file.filename+"."+req.file.mimetype.substr(6,(req.file.mimetype.length-1));
                //res.send({body:JSON.parse(req.body.formdata),data:path});
            }

            var formdata=JSON.parse(req.body.formdata);
            firstname=formdata.firstname;
            lastname=formdata.lastname;
            birthdate=formdata.birthdate;
            email=formdata.email;
            password=formdata.password;
            var encryptpassword=md5(password);
            console.log(encryptpassword);
            flatpurchasedate=formdata.flatpurchasedate;
            //picture=req.file.picture;
            picturefilenm=path;
            flatblock=formdata.flatblock;
            flatno=formdata.flatno;

            var token=jwt.sign(email,"secretmsg");

            var userdata={firstname:firstname,lastname:lastname,birthdate:birthdate,email:email,password:encryptpassword,flatpurchasedate:flatpurchasedate,picture:"./uploads/"+picturefilenm,flatblock:flatblock,flatno:flatno,signuptoken:token,maintainence:[{ispaid:true,month:7}]}
            //console.log(req.body); return
            
            userschema.create(userdata,function(err,body)
            {
                if(err)
                {
                    console.log("error arrive");
                }
                else
                {
                    console.log("data inserted");
                    res.send({message:"data stored",data:body},200);
                }
            })
        })
})


app.post("/loginform",function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    var encryptpassword=md5(password);
    console.log(encryptpassword);

    console.log(req.body);
    userschema.findOne({email},function(err,data){
    
       console.log(data);
       if(data===null)
       {
           res.send({body:"data not found"},400);
           return;
       }
       else{
        if(data.email=== email && data.password===encryptpassword)
        {
            res.send({body:"login successfull",data:data},200);
            console.log("login successful");
        }
        else{
            res.send({body:"try again"},400);
            return;
        } 
       }     
            
    })
})

app.get("/userdata",isloggin,function(req,res){

    userid=req.body.userid;
    userschema.findOne({_id:userid},function(err,data){
        if(err)
        {
            res.send({body:"error in finding userdata"});
        }
        else
        {
            console.log(data);
            res.send({data:data,body:"userdata found"});
        }
    })
})

app.post("/addvehicleform",isloggin,function(req,res){

    vehicletype=req.body.vehicletype;
    vehicleregistrationno=req.body.vehicleregistrationno;
    vehiclecolor=req.body.vehiclecolor;
    // userid=req.params.id;
    userid=req.body.userid;
    console.log(userid);
    var vehicledata={vehicletype:vehicletype,vehicleregistrationno:vehicleregistrationno,vehiclecolor:vehiclecolor,userid:userid}
    
    vehicleschema.create(vehicledata,function(err,body){
        if(err)
        {
            console.log("error arrive in adding vehicle data");
        }
        else
        {
            console.log("vehicle data added");
            res.send({body:"vehicle data added",data:body},200);
        }
    })
})

app.get("/listallvehicles",isloggin,function(req,res){

    vehicleschema.find({},function(err,data){
        if(err)
        {
            console.log("error arrive in getting vehicle data");
        }
        else
        {
            console.log("data get successfully");
            res.send(data)
        }
    })
})

app.get("/listmyvehicles",isloggin,function(req,res){

    // userid=req.params.id;
    userid=req.body.userid;
    vehicleschema.find({userid},function(err,data){
        if(err)
        {
            console.log("error arrive in getting  your vehicle data");
        }
        else
        {
            console.log(" your data get successfully");
            res.send(data);
        }
    })
})

app.delete("/deletemyvehicles/:id",isloggin,function(req,res){

    vehicleid=req.params.id;
    console.log(vehicleid)
    vehicleschema.findByIdAndRemove({_id:vehicleid},function(err,data)
    {
       if(err)
       {
           console.log("data is not deleted",err)
       } 
       else
       {
            res.send({body:"data is deleted"},200)
            console.log("data deleted");
       }
    })
})

app.put("/editmyvehicles/:id",isloggin,function(req,res){

    vehicleid=req.params.id;
    console.log(vehicleid);
    vehicletype=req.body.vehicletype;
    vehicleregistrationno=req.body.vehicleregistrationno;
    vehiclecolor=req.body.vehiclecolor;
    userid=req.body.userid;
    var vehicledata={vehicletype:vehicletype,vehicleregistrationno:vehicleregistrationno,vehiclecolor:vehiclecolor,userid:userid}    

    vehicleschema.findByIdAndUpdate({_id:vehicleid},vehicledata,function(err,data){
        if(err)
        {
            console.log("data is not updated",err)
        }
        else
        {
             res.send({body:"data is updated"},200)
             console.log("data updated");
        }
    })
})

app.post("/addfeedform",isloggin,function(req,res)
{
    var feedstatus=req.body.feedstatus;
    var feedimage=req.body.feedimage;
    // var userid=req.params.id;
    var userid=req.body.userid;

    var feeddata={feedstatus:feedstatus,feedimage:feedimage,userid:userid}
    feedwallschema.create(feeddata,function(err,data)
    {
        if(err)
        {
            res.send({body:"error in adding feed"},400)
        }
        else{
            res.send({body:"feed added successfully",data:data},200)
        }
    })
})

app.get("/displayfeedform",isloggin,function(req,res)
{
    feedwallschema.find({}).populate('commentschema, likeschema.userid','firstname lastname').exec(function(err,data){
        if(err)
        {
            console.log("error arrive in getting feedwall data",err);
        }
        else
        {
            console.log("feedwall data get successfully");
            res.send(data);
        } 
    })
})

app.post("/addcommentform/:id",isloggin,function(req,res){

    feedid=req.params.id;
    comment=req.body.comment;
    userid=req.body.userid;
   
    var commentdata={'userid':userid,'comment':comment}
   
    feedwallschema.findOneAndUpdate({_id:feedid},{$push:{commentschema:commentdata}},function(err,data)
    {
        if(err)
        {
            console.log("error arrieve in adding comments",err)
        }
        else
        {
            res.send({body:"comment added successfully",data:data},200)
           
        }
    })

})

// app.get("/displaycomments",isloggin,function(req,res){

//     feedwallschema.find({}).populate('commentschema').exec(function(err,data)
//     {
//        if(err)
//        {
//            console.log("comment data isn't displayed",err)
//        }
//        else
//        {
//            res.send({data:data,body:"comments data sended"});
//        } 
//     })
// })

app.get("/addlikes/:id",isloggin,function(req,res){

    feedid=req.params.id;
    userid=req.body.userid;

    var likedata={'userid':userid};

    feedwallschema.findOne({_id:feedid,'likeschema.userid':userid},function(err,data){
        
        if(data===null)
        {
            feedwallschema.findByIdAndUpdate({_id:feedid},{$push:{likeschema:likedata}},function(err,data)
            {
                if(err)
                {
                    console.log(err,"error arrive in adding like data");
                }
               
                else
                {
                    console.log("likes data added");
                    res.send({body:"likes added successfully",data:data},200)
                }
            })
        }
        else
        {
            res.send({body:"you already liked"});
        }
    })

    
})


// app.get("/getlikesdata/:id",isloggin,function(req,res)
// {
//     feedid=req.params.id;
//     feedwallschema.find({_id:feedid}).populate('likeschema.userid','firstname lastname').exec(function(err,data){
//         if(err)
//         {
//             console.log(err,"like data cant get")
//         }
//         else{
//             console.log("like data got",data)
//             res.send({body:"like data got",data:data},200)
//         }
//     })
// })

app.post("/findmaintainence",isloggin,isadmin,function(req,res)
{
        month=req.body.month;
        block=req.body.block;
        userid=req.body.userid;

        userschema.find({'maintainence.month':month,'flatblock':block},function(err,data){

            if(err)
            {
                console.log("maintainence data cant displayed");
                res.send({body:"maintainence data is not found"});
            }
            else
            {
                console.log("maintainence data displayed");
                res.send({body:"maintainence data found",data:data});
            }
        })
})


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
            //res.status(200).send({body:"you are authenticated"});
            req.body.userid=data._id;
            next();
        }
    })
}

function isadmin(req,res,next)
{
    // var isadmintoken=req.headers.isadmintoken;
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

app.listen(3000,function(){
    console.log("server started");
})
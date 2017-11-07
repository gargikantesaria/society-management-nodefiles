var feedwallschema = require("../feedwallschema.js");

/////add feed form data//////
exports.addfeedform = function (req, res) {
    var feedstatus = req.body.feedstatus;
    var feedimage = req.body.feedimage;
    var userid = req.body.userid;

    var feeddata = { feedstatus: feedstatus, feedimage: feedimage, userid: userid }
    feedwallschema.create(feeddata, function (err, data) {
        if (err) {
            res.send({ body: "error in adding feed" }, 400)
        }
        else {
            res.send({ body: "feed added successfully", data: data }, 200)
        }
    })
}

////display feed data /////

exports.displayfeedform = function (req, res) {
    page=req.params.page;
    defaultpage=5;
    console.log(page)
    feedwallschema.count().exec(function(err,totalrecord){
       

       skiprecord=defaultpage*page-defaultpage;
       hasnext=totalrecord>=defaultpage*page;
       if(hasnext)
       {
            console.log(hasnext,totalrecord)
            feedwallschema.find({}).populate('commentschema, likeschema.userid', 'firstname lastname')
            .skip(skiprecord)
            .limit(defaultpage)
            .exec(function (err, data) {
            if (err) {
                console.log("error arrive in getting feedwall data", err);
            }
            else {
                console.log("feedwall data get successfully");
                res.status(200).send(data);
            }
        })
       }
       else
       {
           res.status(404).send({body:"no record found!!!"});
       }
       
    });
}

////add comments in feed form /////

exports.addcomment = function (req, res) {

    feedid = req.params.id;
    comment = req.body.comment;
    userid = req.body.userid;

    var commentdata = { 'userid': userid, 'comment': comment }

    feedwallschema.findOneAndUpdate({ _id: feedid }, { $push: { commentschema: commentdata } }, function (err, data) {
        if (err) {
            console.log("error arrieve in adding comments", err)
        }
        else {
            res.send({ body: "comment added successfully", data: data }, 200)

        }
    })
}

////add likes in feed form ////

exports.addlikes = function (req, res) {

    feedid = req.params.id;
    userid = req.body.userid;

    var likedata = { 'userid': userid };

    feedwallschema.findOne({ _id: feedid, 'likeschema.userid': userid }, function (err, data) {

        if (data === null) {
            feedwallschema.findByIdAndUpdate({ _id: feedid }, { $push: { likeschema: likedata } }, function (err, data) {
                if (err) {
                    console.log(err, "error arrive in adding like data");
                }

                else {
                    console.log("likes data added");
                    res.send({ body: "likes added successfully", data: data }, 200)
                }
            })
        }
        else {
            res.send({ body: "you already liked" });
        }
    })


}
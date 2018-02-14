var express = require('express');
var router = express.Router();
var historyEventModel = global.dbHandle.getModel("historyEvent");
var userModel = global.dbHandle.getModel("user");

//TODO: build the user system.....(gonna take long)
var userObjectId = "5a83c9f4ca4d7d4bbfba12d0";
/* GET home page. */
router.get('/', function(req, res, next) {
    userModel.findById(userObjectId, function(err, user) {
        if (err) {
            return console.log("妈的，出错了, userModel.findById()");
        } else {
            historyEventModel.find({_id : { $in: user.eventsOnMap}}, function(err, historyEvents){
                if(err){
                    return console.log("妈的，出错了, historyEventModel.find()");
                }else{
                    res.render('index', { historyEvents : historyEvents });
                }
            });
        }
    });
});

router.get('/tempForMarker', function(req, res, next) {
    userModel.findById(userObjectId, function(err, user) {
        if (err) {
            return console.log("妈的，出错了, userModel.findById()");
        } else {
            historyEventModel.find({_id : { $in: user.eventsOnMap}}, function(err, historyEvents){
                if(err){
                    return console.log("妈的，出错了, historyEventModel.find()");
                }else{
                    res.json(historyEvents);
                }
            });
        }
    });    
});

router.get('/singleEvent', function(req, res, next) {
    historyEventModel.findOne({},function(err,singleEvent){
        if(err){
            return console.log("妈的，出错了");
        }else{
            res.json(singleEvent);
        }
    });  
});

router.get('/createEvent', function(req, res, next) {
    res.render('createEvent');
});

router.post('/createEvent', function(req, res, next) {
    var requestBody = req.body;
    var newHistoryEvent = normalizeData(requestBody);

    historyEventModel.create(newHistoryEvent,function(err){
        if(err){
            return next(err);
        }else{
            console.log("history event is inserted into database successfully！！！");
            res.redirect('/');
        }
    });  
});

router.get('/editEvent', function(req, res, next) {
    var eventId = req.query.objectid;
    historyEventModel.findById(eventId, function(err,historyEvent) {        
        res.render('createEvent', {historyEvent : historyEvent});
    });
});

router.post('/editEvent', function(req, res, next) {
    var requestBody = req.body;
    var newHistoryEvent = normalizeData(requestBody);
    var eventId = req.query.objectid;

    historyEventModel.findByIdAndUpdate(eventId, {$set:newHistoryEvent},{new:true},function(err, historyEvent){
        if(err){
            return next(err);
        }else{
            console.log("history event has been updated successfully！！！");
            console.log(historyEvent);
            res.redirect('/');
        }
    });  
});

router.get('/eventsList', function(req, res, next) {
    historyEventModel.find({},function(err,historyEvents){
        if(err){
            return console.log("妈的，出错了");
        }else{
            res.render('eventsList', { historyEvents : historyEvents });
        }
    });  
});

router.post('/eventsList', function(req, res, next) {
    var requestBody = req.body;

    for (var eventId in requestBody) {
        console.log(eventId);
    }
    // var newHistoryEvent = normalizeData(requestBody);
    // var eventId = req.query.objectid;

    // historyEventModel.findByIdAndUpdate(eventId, {$set:newHistoryEvent},{new:true},function(err, historyEvent){
    //     if(err){
    //         return next(err);
    //     }else{
    //         console.log("history event 已经成功被update啦！！！");
    //         console.log(historyEvent);
    //         res.redirect('/');
    //     }
    // });  5a44f7e332069249b0610c8c
});

function normalizeData(requestBody) {
    var newHistoryEvent = {};
    
    newHistoryEvent.name = requestBody.name;
    newHistoryEvent.areaName = requestBody.areaName;
    newHistoryEvent.areaCoordinates = new Array();
    // TODO: This is bad, latitude and logitude can be easily messed up
    newHistoryEvent.areaCoordinates.push(Number(requestBody.areaLongitude));
    newHistoryEvent.areaCoordinates.push(Number(requestBody.areaLatitude));
    newHistoryEvent.startYear = Number(requestBody.startYear);
    // TODO: edit will set onMap to false as well, need to fix this bug
    newHistoryEvent.onMap = false;

    return newHistoryEvent;
};

// firstUser = {
//     name : "Shawn Li",
//     email : "sss@gg.com",
//     password : "password!",
//     eventsOnMap : ["5a4e58a93e73f258ff0cc26a"]
// };

// userModel.create(firstUser,function(err){
//     if(err){
//         return console.log(err);
//     }else{
//         console.log("a new user is inserted into database successfully！！！");
//     }
// });

module.exports = router;

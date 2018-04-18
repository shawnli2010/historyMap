var express = require('express');
var _ = require('underscore-node');
var mongoose=require('mongoose');
var router = express.Router();
var historyEventModel = global.dbHandle.getModel("historyEvent");
var userModel = global.dbHandle.getModel("user");
var eventGroupModel = global.dbHandle.getModel("eventGroup");

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
    userModel.findById(userObjectId, function(err, user) {
        if (err) {
            return console.log("妈的，出错了, userModel.findById()");
        } else {
            historyEventModel.find({},function(err,historyEvents){
                if(err){
                    return console.log("妈的，出错了");
                }else{
                    for (i in historyEvents) {
                        historyEvents[i].onMap = _.contains(user.eventsOnMap, historyEvents[i]._id.toString());
                    }

                    res.render('eventsList', { historyEvents : historyEvents});
                }
            });  
        }
    });
});

router.post('/eventsList', function(req, res, next) {
    var eventIdArray = [];
    var requestBody = req.body;
    for (var eventId in requestBody) {
        eventIdArray.push(eventId);
    }

    userModel.update({_id : userObjectId}, {eventsOnMap : eventIdArray}, function(err, value) {
        if (err) {
            return console.log("妈的，出错了, userModel.update()");
        } else {
            res.redirect('/');
        }
    });
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

// 崖山海战：5abc53b7f0b4c717a64c81b8
// 秦统一中国：5abc55fcf0b4c717a64c81b9
// 吕布：5abc527ff0b4c717a64c81b6

router.get('/qqq', function(req, res, next) {
    // 1. Create event group
    // var newEventGroup = {
    //     name : '三国时期',
    //     yearRange : [220, 280],
    //     events : [new mongoose.mongo.ObjectId('5abc53b7f0b4c717a64c81b8'), 
    //               new mongoose.mongo.ObjectId('5abc55fcf0b4c717a64c81b9'), 
    //               new mongoose.mongo.ObjectId('5abc527ff0b4c717a64c81b6')]
    // };

    // eventGroupModel.create(newEventGroup,function(err){
    //     if(err){
    //         return next(err);
    //     }else{
    //         console.log(newEventGroup.name + " eventGroup is inserted into database successfully！！！");
    //         res.redirect('/');
    //     }
    // });   

    // 2. Query event group and POPULATE events with event data
    // eventGroupModel.
    // findById(new mongoose.mongo.ObjectId('5ad4113cc669894903040293')).
    // populate('events').
    // exec(function(err, eventGroup) {
    //     if (err) {
    //         return console.log("妈的，出错了, eventGroupModel.findOne().populate()");
    //     } else {
    //         console.log(eventGroup);
    //     }
    // });

    // 3. Update the events array in a event group
    var eventIdArray = [new mongoose.mongo.ObjectId('5abc53b7f0b4c717a64c81b8'), 
              new mongoose.mongo.ObjectId('5abc55fcf0b4c717a64c81b9'), 
              new mongoose.mongo.ObjectId('5abc527ff0b4c717a64c81b6')]    
    // var eventIdArray = [];
    // var eventIdArray = [new mongoose.mongo.ObjectId('5abc53b7f0b4c717a64c81b8'),  
    //           new mongoose.mongo.ObjectId('5abc527ff0b4c717a64c81b6')]    

    eventGroupModel.update({_id : new mongoose.mongo.ObjectId('5ad4113cc669894903040293')}, 
                            {events : eventIdArray}, function(err, value) {
        if (err) {
            return console.log("妈的，出错了, eventGroupModel.update()");
        } else {
            console.log(value);
        }
    });
});

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

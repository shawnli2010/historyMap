module.exports={
    historyEvent : {
        name : { type : String , required : true },
        areaCoordinates : { type : [Number] , required : true },
        areaName : { type : String , required : true },
        startYear : { type : Number , required : true },
        onMap : { type : Boolean , required : true },
        startMonth : { type : Number , required : false },
        startDay : { type : Number , required : false },
        endYear : { type : Number , required : false },
        endMonth : { type : Number , required : false },
        endDay : { type : Number , required : false },
        mainCharacters : { type : [String] , required : false },
        links : { type : [String] , required : false }
    },

    user : {
        name : {type : String, required : true},
        email : {type : String, required : true},
        password : {type : String, required : true},
        eventsOnMap : {type : [String] , required : true}
    }
};
#!/usr/bin/env node

var yacht = require('./yacht');
var validator = yacht.validator;
var orm = yacht.orm;
var prettyjson = require('prettyjson');

validator.__globals(true,true,true,true);

errMessage = {
    "username": [
        {
            "value": "Amanvirk",
            "rule": "unique",
            "message": "A record with that `username` already exists (`996806500`)."
        },
        {
            "value": "",
            "rule": "required",
            "message": "A record with that `username` already exists (`996806500`)."        	
        },
        {
            "value": "",
            "rule": "date",
            "message": "A record with that `username` already exists (`996806500`)."         	
        }
    ]
};

var validationMessages = {
	validationMessages:{
	  	username:{
	  		required: 'Name is required',
	  		unique: 'Name must be unique as %value% is not unique'
	  	}
	}
 };

// validator.validate(validationMessages,errMessage,function(messages){
// 	console.log(JSON.stringify(messages));
// });

var User = {
    updateFields: ['displayName','isdisplayName','profile_pic','phone_no','sound_cloud_id','sound_cloud_username','sound_cloud_token','sound_cloud_refresh_token','account_status'],
};
var f = { username: '996806500', phone_no: '996806500','profile_pic': 'Wow','random':'isThere'};
orm.setUpdateFields(User,f,function(fields){
    console.log(fields);
});
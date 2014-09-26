#!/usr/bin/env node

var yacht = require('./yacht');
var validator = yacht.validator;
var orm = yacht.orm;
var prettyjson = require('prettyjson');

//validator.__globals(true,true,true,true);

errMessage = {
    "username": [
        {
            "value": "Amanvirk",
            "rule": "required",
            "message": "A record with that `username` already exists (`996806500`)."
        },
        {
            "value": "",
            "rule": "unique",
            "message": "A record with that `username` already exists (`996806500`)."
        },
        {
            "value": "",
            "rule": "date",
            "message": "Not a date"
        }
    ],
    "phone_no":[
        {
            "value": "",
            "rule": "required",
            "message": "A record with that phone_no is required"
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
// validator.__defaults.showFields = true;
// validator.__defaults.showMessages = true;
// validator.__defaults.showDescriptive = false;
// validator.validate(validationMessages,errMessage,function(messages){
//         console.log(prettyjson.render(messages));
// });

var User = {
    updateFields: ['displayName','isdisplayName','profile_pic','phone_no','sound_cloud_id','sound_cloud_username','sound_cloud_token','sound_cloud_refresh_token','account_status'],
};

var recordUpdated = { id: 1,
  username: 'amanvirk',
  email_address: 'virk.officials@gmail.com',
  password: null,
  alternate_email_address: null,
  contact_no: null,
  account_status: 'Pending',
  is_verified: 0,
  verification_token: null,
  createdAt: 'Thu Sep 25 2014 18:54:15 GMT+0530 (IST)',
  updatedAt: 'Fri Sep 26 2014 10:07:52 GMT+0530 (IST)' 
}

var items = { id: 1,
  username: 'harminder',
  email_address: 'virk.officials@gmail.com',
  password: null,
  alternate_email_address: null,
  contact_no: null,
  account_status: 'Pending',
  is_verified: 0,
  verification_token: null,
  createdAt: 'Thu Sep 25 2014 18:54:15 GMT+0530 (IST)',
  updatedAt: 'Fri Sep 26 2014 10:07:52 GMT+0530 (IST)' 
}

orm.initRevision(items);
orm.createRevision(User,recordUpdated);

// var f = { username: '996806500', phone_no: '996806500','profile_pic': 'Wow','random':'isThere'};
// orm.setUpdateFields(User,f,function(fields){
//     console.log(fields);
// });
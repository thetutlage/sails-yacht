#!/usr/bin/env node

var validator = require('./yacht').validator;
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

validator.validate(validationMessages,errMessage,function(messages){
	console.log(JSON.stringify(messages));
});
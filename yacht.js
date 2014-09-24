var _ = require("underscore");

var yacht = module.exports;
var validator = {};

var globals = {};
globals.showCount = false;
globals.listFields = false;
globals.showMessages = false;
globals.longMessages = false;

errorsCounts = 0;
var fields = [];
var messages = {};
var descriptive = {};

function __globals(c,f,m,d){
	globals.showCount = c;
	globals.listFields = f;
	globals.showMessages = m;
	globals.longMessages = d;
}

function validate(Model,Err,callback){

	var __messages = Model.validationMessages;
	var __fields = _.keys(__messages);
	var i = 0;

	if(globals.showCount){
		errorsCounts = _.size(Err);
	}
	if(globals.listFields){
		fields = __fields;
	}
	_.each(Err,function(v,k){
		i++;
		if(_.contains(__fields,k)){
			descriptive[k] = [];
			_.each(Err[k],function(values,keys){
				if(typeof(__messages[k][values.rule]) !== 'undefined'){
					if(globals.showMessages){
						messages[k] = __messages[k][values.rule].replace('%value%',[values.value]);
					}
					if(globals.longMessages){
						descriptive[k].push({value:values.value,rule:values.rule,message:__messages[k][values.rule].replace('%value%',[values.value])});
					}
				}else{
					descriptive[k].push(values);
				}
			});
		}
		if(i == _.size(Err)){
			callback(validationMessages());
		}
	});
}

function validationMessages(){
	var rd = {};
	if(globals.showCount){
		rd.count = errorsCounts;
	}
	if(globals.listFields){
		rd.fields = fields;
	}
	if(globals.showMessages){
		rd.messages = messages;
	}
	if(globals.longMessages){
		rd.descriptive = descriptive;
	}
	return rd;
}

yacht.validator = validator;
validator.validate = validate;
validator.__globals = __globals;


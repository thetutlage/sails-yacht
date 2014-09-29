/**
	Module Dependencies
	Underscorejs
*/
var _ = require("underscore");

/**
	* Sails yacht provides an extra layer on top of sailsjs models by adding features like :-
		
		*	Custom validation messages
		*	Update revisions
		*	Defining update fields

	* If you don't need any of these functionalities simply don't call any methods.

	------------------------------------------------------------------------------------
	** HOW IT WORKS **
	------------------------------------------------------------------------------------

	* Validator
		
		*	Validator exposes only single method called validate(model,error,callback) to generate custom validation
			messages.

	* ORM

		*	Orm exposes couple of methods defined below
				
				* setUpdateFields(model,update_values,callback)
				* setRevisions(model,values,callback)

*/

var validator = {

	__defaults:{
		showCount: true,
		showFields: false,
		showMessages: false,
		showDescriptive: true
	},

	__globals:{
		counts:0,
		fields:[],
		messages:{},
		descriptive:{}
	},

	__helpers:{
		messages:[],
		fields:[]
	},

	validate: function(Model,Err,Cb){
		var obj = this;
		obj.__helpers.messages = Model.validationMessages;
		obj.__helpers.fields = _.keys(this.__helpers.messages);
		if(obj.__defaults.showCount){
			obj.__globals.counts = _.size(Err);
		}
		if(obj.__defaults.showFields){
			obj.__globals.fields = _.keys(Err);
		}
		_.each(Err,function(errO,errK){

			if(_.contains(obj.__helpers.fields,errK)){
				// Error fields are part of custom defined validationMessages.
				
				obj.setGlobals(Err,errK,true);
			}else{
				// Error fields are not part of custom defined validationMessages. 
				// Hence original messages will be used.
				obj.setGlobals(Err,errK,false);
			}
		});
		Cb(obj.__globals);
	},

	setGlobals: function(Err,item,isDefined,Cb){
		var obj = this;
		if(obj.__defaults.showDescriptive){
			obj.__globals.descriptive[item] = [];
		}
		_.each(Err[item],function(values,keys){
			if(isDefined){
				if(typeof(obj.__helpers.messages[item][values.rule]) !== 'undefined'){
					if(obj.__defaults.showMessages){
						if(typeof(obj.__globals.messages[item]) == 'undefined'){
							obj.__globals.messages[item] = obj.__helpers.messages[item][values.rule].replace('%value%',[values.value]);
						}
					}
					if(obj.__defaults.showDescriptive){
						obj.__globals.descriptive[item].push({value:values.value,rule:values.rule,message:obj.__helpers.messages[item][values.rule].replace('%value%',[values.value])});
					}
				}else{
					if(obj.__defaults.showMessages){
						if(typeof(obj.__globals.messages[item]) == 'undefined'){
							obj.__globals.messages[item] = values.message;
						}
					}
					if(obj.__defaults.showDescriptive){
						obj.__globals.descriptive[item].push(values);
					}
				}
			}else{
				if(obj.__defaults.showMessages){
					if(typeof(obj.__globals.messages[item]) == 'undefined'){
						obj.__globals.messages[item] = values.message;
					}
				}
				if(obj.__defaults.showDescriptive){
					obj.__globals.descriptive[item].push(values);
				}
			}
		});
	}
};

var orm = {

	__helpers:{
		fields: [],
		past: [],
		present: [],
		future: [],
		history: {},
		ignore: ['inspect','createdAt','updatedAt']
	},

	setUpdateFields: function(Model,values,callback){
		var obj = this;
		obj.__helpers.fields = Model.updateFields;
		var size = _.size(values);
		var i = 0;
		_.each(values,function(data,keys){
			i++;
			if(!_.contains(obj.__helpers.fields,keys)){
				delete values[keys];
			}
			if(i == size){
				callback(values);
			}
		});
	},

	initRevision: function(Model,item,callback){
		var obj = this;
		Model.findById(item).exec(function(err,d){
			if(!err){
				obj.__helpers.past = d[0];
			}
			callback();
		});
	},
	createRevision: function(Model,Revision,values){
		var obj = this;
		obj.__helpers.present = values;
		_.each(obj.__helpers.past,function(v,k){
			if(obj.__helpers.past[k] != obj.__helpers.present[k] && !_.contains(obj.__helpers.ignore,k)){
				obj.__helpers.future.push({
					revisionable_type: Model.adapter.collection,
					revisionable_id: values.id,
					user_id: 1,
					key_field: k,
					old_value: v,
					new_value: obj.__helpers.present[k]
				});
			}
		});
		obj.insertRevision(Revision);
	},
	insertRevision: function(Revision){
		var obj = this;
		Revision.create(obj.__helpers.future,function(err,values){
		});
	},
	revisionHistory: function(object,callback){
		var obj = this;
		x = 0;
		_.each(object,function(values,keys){
			x++;
			if(typeof(obj.__helpers.history[values.key_field]) == 'undefined'){
				obj.__helpers.history[values.key_field] = [];
			}
			obj.__helpers.history[values.key_field].push(values);
			if(x == _.size(object)){
				callback(obj.__helpers.history);
			}
		});
	}

}

var yacht = module.exports;
yacht.validator = validator;
yacht.orm = orm;

var poolModule = require('generic-pool');
var Mongodb = require('mongodb')
    , format = require('util').format;

var pool=poolModule.Pool({
	name:'mongoPool',
	create:function(callback){
		Mongodb.MongoClient.connect('mongodb://localhost:27017/myNodejs',function(err,db){
			callback(err,db);
		});
	},
	destroy  : function(db) {  },
    max      : 50,  
    min      : 50, 
    idleTimeoutMillis : 1000*60*30, 
    log : false,  
});

exports.pool=pool; 

























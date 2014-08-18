
var generic_pool = require('generic-pool');  

//创建一个mysql数据库链接池
var pool=generic_pool.Pool({
	name:'mysql',
	max:30,
	create:function(callback){
		var Client=require('mysql').createConnection({
			host:'127.0.0.1',
			user:'root',
			password:'bao',
			database:'nodemysql'
		});
		callback(null,Client);
	},
	destroy:function(db){},
	idleTimeoutMillis:1000*30
});



exports.pool=pool;





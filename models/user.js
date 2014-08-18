var dao=require('../conn/mongodbpool');
var pool=dao.pool;

var name='';
var password='';
function User(user){
	this.name=user.name;
	this.password=user.password;
}

module.exports=User;

User.prototype.save=function save(callback){
	//存入mongodb
	var user={
		name:this.name,
		password:this.password,
	}

	pool.acquire(function(err,db){
		if(err){
			throw err;
		}
		var collection = db.collection('file');//表明
		collection.insert(user,{safe:true},function(err2,user){
			pool.release(db);
			callback();
		});
	});
};

User.get=function get(username,callback){
	console.log('connec.....4');
	pool.acquire(function(err,db){
		var collection = db.collection('file');
		collection.findOne({name:username},function(err,list){
			pool.release(db);
			console.log('connec.....5');
			if(list){
				console.log('connec.....6');
				//将返回值封装为User对象
				var user=new User(list);
				callback(err,user);
			}else{
				console.log('connec.....7');
				callback(err,null);
			}
		});
	});
};






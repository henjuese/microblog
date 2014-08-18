var dao=require('../conn/mongodbpool');
var moment=require('moment');

var pool=dao.pool;

var user='';
var post='';
function Post(username,post,time){
	this.user=username;
	this.post=post;
	if(time){
		this.time=time;
	}else{
		this.time=new Date();
	}
}

module.exports=Post;

Post.prototype.save=function save(callback){
	//存入mongodb
	var post={
		user:this.user,
		post:this.post,
		time:this.time,
	};

	pool.acquire(function(err,db){
		if(err){
			throw err;
		}
		var collection = db.collection('posts');//表明
		collection.insert(post,{safe:true},function(err2,post){
			pool.release(db);
			callback();
		});
	});
};

Post.get=function get(username,callback){
	console.log('connec.....7');
	pool.acquire(function(err,db){
		var collection = db.collection('posts');
		var query={};
		if(username){
			query.user=username;
		}
		console.log('connec.....8');
		collection.find(query).sort({time:-1}).toArray(function(err,list){
			pool.release(db);
			if(err){
				callback(err,null);
			}
			var posts=[];
			list.forEach(function(doc,index){
				var date=moment(doc.time).format('YYYY-MM-DD');
				var post=new Post(doc.user,doc.post,date);
				posts.push(post);
			});
			console.log('connec.....9');
			callback(null,posts);
		});
	});
}

Post.del=function remove(post,callback){
	pool.acquire(function(err,db){
		console.log('connec.....2');
		var collection = db.collection('posts');
		collection.remove({post:post},{safe:true},function(err,result){
			pool.release(db);
			callback();
			console.log(result);
		});
	});
}

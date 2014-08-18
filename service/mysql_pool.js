var conn_myslq=require('../conn/conn_pool');
var pool=conn_myslq.pool;

function lookUserInfo(req,res){
	pool.acquire(function(err,client){
	if(err){

	}else{
		client.query('select * from mytable',[],function(err,date){
			//console.log(date);
			res.send(date);
			pool.release(client);
		});
	}
});
}


exports.lookUserInfo = lookUserInfo;


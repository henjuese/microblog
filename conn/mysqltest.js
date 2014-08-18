var sys = require('sys');
  
var mysql = require('mysql');
var client = mysql.createConnection({
 	host : 'localhost',
	user : 'root',
	password : 'bao'

});

//client.user='root';
//client.password='bao';
exports.index = function(req, res){
	//链接数据库
	client.connect(function(error,results){
		if(error){
			console.log('connection mysql error:'+ error.message);
			return;
		}
		console.log('connected to mysql');
		ClientConnectionReady(client);
	});

	ClientConnectionReady=function(client){
		client.query('USE nodemysql',function(error,results){
			if(error){
				console.log('ClientConnectionReady error:'+error.message);
				client.end();
				return;
			}
			ClientReady(client);
		});
	};

	ClientReady=function(client){
		var values=[1,'bao','bao2','bao@email.com'];
		client.query('insert into mytable set id=?,username=?,password=?,emailaddress=?',values,
			function(error,results){
				if(error){
					console.log('ClientReady error:'+error.message);
					client.end();
					return;
				}
				console.log('inserted:'+results.affectedRows+'row');
			}
		);
		GetDate(client);
	};

	GetDate=function(client){
		client.query('select * from mytable',function selectCb(error,results,fields){
			if(error){
				console.log('GetDate error:'+error.message);
				client.end();
				return;
			}

			if(results.length>0){
				var firstResult=results[0];
				console.log('username='+firstResult['username']);
			}
		});
		client.end();
		console.log('conectoin closed');
	};

}


/* GET users listing. */


var User=require('../models/user');
var Post=require('../models/post');
module.exports=function(app){

	app.get('/abc',function(req,res){
		Post.get(null,function(err,posts){
			if(err){
				posts=[];
			}
			res.render('index',{//自己的模板
			    layout:'layout',//公公模板
			    title:'首页',
			    posts:posts,
	    	});
		});
	});
}

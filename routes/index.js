/* GET home page. 
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/
/*exports.index = function(req, res){
    res.render('index',{
    layout:'layout',
    title:'首页'
    });
};

//直接操作数据的写法
exports.hello=function(req,res){
	//res.send('This time'+new Date().toString());
	var conn=require('../conn/mysqltest');
	conn.conntext();

};

//链接池与mysql配合使用
exports.conn=function(req,res){
	var pool=require('../service/mysql_pool');
	pool.lookUserInfo(req,res);//查看用户信息
};

exports.user=function(req,res){

};

exports.post=function(req,res){

};
exports.reg=function(req,res){
	
};

exports.doReg=function(req,res){
	
};

exports.login=function(req,res){
	
};

exports.doLogin=function(req,res){
	
};

exports.logout=function(req,res){
	
};
//这里被注释掉的写法app.js里面被注释掉的app.use(app.router)，还有app.get(...);是一体的。
*/
var User=require('../models/user');
var Post=require('../models/post');
module.exports=function(app){

	
	//首页
	app.get('/',function(req,res){
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

	//注册页面
	app.get('/reg',function(req,res){
		res.render('reg',{//将调用reg.ejs模板
			layout:'layout',
			title:'用户注册'
		});
	});

	//注册提交表单
	app.post('/reg',function(req,res){
		//var flash=require('connect-flash');
		console.log('commite,,,1');
		if(req.body['password-repeat']!=req.body['password']){
			req.flash('error','两次输入的密码不一致');
			console.log('两次输入的密码不一致!');
			return res.redirect('/reg');
		}
		console.log('connec.....2');
		//var crypto=require('crypto');//加密模块，我没下载
		
		//var md5=crypto.createHash('md5');
		//var password=md5.update(reg.body.password).digest('base64');
		var newUser=new User({
			name:req.body.username,
			password:req.body.password,
		});

		console.log('connec.....3');
		User.get(newUser.name,function(err,user){
			console.log('connec.....8');
			if(user){
				 err='userNmae already exists..';
				 console.log(err);
			}
			if(err){
				req.flash('error',err);
				return res.redirect('/reg');
			}

			newUser.save(function(err){
				if(err){
					console.log('cuowu+'+err);
					return res.redirect('/reg');
				}
				req.session.user=newUser;
				req.flash('success','注册成功');
				res.redirect('/');
			});

		});

	});


	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			layout:'layout',//公公模板
			title:'用户登录',
		});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var password=req.body.password;
		User.get(req.body.username,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/login');
			}
			if(user.password!=password){
				req.flash('error','用户密码错误');
				return res.redirect('/login');
			}
			req.session.user=user;
			req.flash('success','登录成功');
			res.redirect('/');
		});
	});

	app.get('/logout',checkLogin);
	app.get('/logout',function(req,res){
		req.session.user=null;
		req.flash('success','登出成功');
		res.redirect('/');
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser=req.session.user;
		var post=new Post(currentUser.name,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发表成功');
			res.redirect('/u/'+currentUser.name);
		});
	});

	app.get('/u/:user',function(req,res){
		User.get(req.params.user,function(err,user){
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/');
			}
			//根据用户名获取该用户发表的微博
			Post.get(user.name,function(err,posts){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				res.render('user',{
					layout:'layout',//公公模板
					title:user.name,
					posts:posts,
				});
			});
		});
	});


	//当参数为空时
	app.get('/del',function(req,res){
		var currentUser=req.session.user;
		Post.del('',function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/u/'+currentUser.name);
			}
			req.flash('success','删除成功');
			res.redirect('/u/'+currentUser.name);

		});
	});

	app.get('/del/:post',function(req,res){
		var currentUser=req.session.user;
		Post.del(req.params.post,function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/u/'+currentUser.name);
			}
			req.flash('success','删除成功');
			res.redirect('/u/'+currentUser.name);

		});
	});

}


function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','未登陆');
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登入');
		return res.redirect('/');
	}
	next();
}









var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var mysqlconn = require('./routes/mysqltest');

var partials = require('express-partials');

var flash = require('connect-flash');


var app = express();

var MongoStore = require('connect-mongo')(express);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());//让ejs可以使用布局模板


app.use(flash());//可以使用req.flash();
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//将用户会话信息存储到mongodb中
app.use(express.session({
    secret:'1234567890QWERTY',
    store:new MongoStore({
         url: 'mongodb://localhost:27017/nodejsdb'
    })
}));
//静态模板引用
app.use(express.static(path.join(__dirname, 'public')));


//设置全局变量
app.use(function(req,res,next){
    //全局变量，ejs模板可以直接使用<%user%>获取到user
    res.locals.user=req.session.user;
    var err=req.flash('error');//flash只能用一次，第一次就将值取出来，第二次在用的时候就没有值了。所以要赋值给err，防止多次使用flash获取值失败
    if(err.length)
        res.locals.error=err;
    else
        res.locals.error=null;
    var succ=req.flash('success');
    if(succ)
       res.locals.success=succ;
     else
        res.locals.success=null;
    next();
});

//app.use(app.router);
routes(app);//用该方法替换上面一句之后就是包含了routes下面所有的
//在routes下面的index文件里面多加上一句module.exports将会得到app的内容(这种方法默认是进入index的)

var filetool=require('./routes/filetool');
filetool(app);//这种方式将进入到filetool中去//这两句也可以写到index.js里面去。在index.js里面require('./filetool');其他一样

//数据库链接测试类
/*app.get('/conn', mysqlconn.index);
app.get('/conn2',routes.conn);

//博客开始
app.get('/', routes.index);
app.get('/u/:user',routes.user);//用户主页
app.post('/post', routes.post);//发表信息
app.get('/reg',routes.reg);//用户注册
app.post('/reg',routes.doReg);
app.get('/login',routes.login);//用户登录
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);//用户登出*/




app.listen(3000);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

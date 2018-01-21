var express = require("express")
// var serveStatic = require("serve-static") // 加载静态资源 serve-static
var path = require("path") // 加载静态资源 express.static 
var logger = require('morgan') // express.logger express 4.0 不支持，转用morgan

var bodyParser = require('body-parser') // 提交表单时数据格式化
var cookieParser = require('cookie-parser') // 缓存登录状态-相关
var session = require('express-session') // 缓存登录状态-相关

var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session) // 利用MongoDB 做会话的持久化中间件



var port = process.env.PORT || 3000
var app = express()

var DB_URL = 'mongodb://localhost/imooc'

// 连接数据库
mongoose.connect(DB_URL)

// models loading   这样在 其他文件可以直接 mongoose('User') 拿到User模型，不用require绝对路径
var fs = require('fs')
var models_path = __dirname + '/app/models'
var walk = function(path) {
	fs.readdirSync(path)
		.forEach((file) => {
	  	var newPath = path + '/' + file
	  	var stat = fs.statSync(newPath)

	  	if (stat.isFile()) {
	  		if (/(.*)\.(js|coffee)/.test(file)) {
	  			require(newPath)
	  		}
	  	}else if(stat.isDirectory()) {
	  		walk(newPath)
	  	}
		})
}
walk(models_path) 


app.set('views', './app/views/pages')
app.set('view engine', 'jade')
// 提交表单时数据格式化
// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: true }))  
// app.use(express.multipart()) 版本问题，需要npm install --save connect-multiparty
app.use(require('connect-multiparty')())


// 登录状态持久化
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	store: new MongoStore({
		url: DB_URL,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}))
// parse application/json  
// app.use(bodyParser.json()) 
// app.use(serveStatic('bower_components')) // 加载静态资源 serve-static
app.use(express.static(path.join(__dirname, 'public'))) // 加载静态资源 express.static  

// 时间处理插件 moment
app.locals.moment = require('moment')

// 开发环境配置
console.log(process.env.NODE_ENV)
var env = process.env.NODE_ENV || 'development'
if ('development' === env) {
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

// 引入路由
require('./config/routes')(app)

app.listen(port)
console.log('imooc_movie started on port ' + port)
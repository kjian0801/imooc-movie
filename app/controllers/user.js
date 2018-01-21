var User = require('../models/user')

// 用户注册
exports.signup = function(req, res) {
	var _user = req.body.user
	User.find({name: _user.name}, (err, user) => {
		if (err) {
			return console.log(err)
		}

		if (user.length !== 0) {
			return res.redirect('/signin')
		}else {
			var user = new User(_user)
			user.save((err, user) => {
				if (err) {
					return console.log(err)
				} 
				res.redirect('/')
			})
		}
	})
}
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'
	})
}

// 用户登录
exports.signin = function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	User.findOne({name: name}, (err, user) => {
		if (err) {
			return console.log(err)
		} 
		if (!user) {
			return res.redirect('/signup')
		} 
		user.comparePassword(password, (err, isMatch) => {
			if (err) {
				return console.log(err)
			} 
			if (isMatch) {
				req.session.user = user  // 缓存登录状态
				console.log('password is match')
				return res.redirect('/')
			} else {
				console.log('password is not match')
				return res.redirect('/signin')
			}
		})
	})
}
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	})
}

// 用户登出
exports.signout = function(req, res) {
	delete req.session.user
	// delete app.locals.user
	res.redirect('/')
}

// 用户列表
exports.list = function(req, res) {
	User.fetch((err, users) => {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: 'Imooc 用户列表',
			users: users
		})
	})
}


// midware for user
exports.signinRequired = (req, res, next) => {
	var user = req.session.user
	if (!user) {
		return res.redirect('/signin')
	}
	next()
}

exports.adminRequired = (req, res, next) => {
	var user = req.session.user
	if (user.role < 10 ) {
		return res.redirect('/signin')
	}
	next()
}




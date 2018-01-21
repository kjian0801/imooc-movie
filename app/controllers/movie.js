var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var fs = require('fs')
var path = require('path')

var _ = require('underscore')

// 详情页
exports.detail = function(req, res) {
	var id = req.params.id
	Movie.update({_id: id}, {$inc: {pv: 1}}, (err) => {
		if (err) {
			console.log(err)
		}
	})
	Movie.findById(id, (err, movie) => {
		if (err) {
			return console.log(err)
		}
		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('replay.from replay.to', 'name')
			.exec((err, comments) => {
				if (err) {
					return console.log(err)
				}
				console.log(comments)
				res.render('detail', {
					title: 'Imooc ' + movie.title,
					movie: movie,
					comments: comments
				})
		})
	})
}

// 后台录入页
exports.new = function(req, res) {
	Category.find({}, (err, categories) => {
		if (err) {
			return console.log(err)
		}

		res.render('admin', {
			title: 'Imooc 后台录入页',
			categories: categories,
			movie: {}
		})
	})
}

// 后台列表页
exports.list = function(req, res) {
	Movie.fetch((err, movies) => {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'Imooc 列表页',
			movies: movies
		})
	})
}

// 后台更新页
exports.update = function(req, res) {
	var id = req.params.id
	if (id) {
		Movie.findById(id, (err, movie) => {
			Category.find({}, (err, categories) => {
				res.render('admin', {
					title: 'Imooc 后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

// 如果上传了海报，保存海报, 表单提交，图片
exports.savePoster = function(req, res, next) {
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename
	console.log(req.files)
	if (originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp + '.' + type
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

			fs.writeFile(newPath, data, function(err) {
				if (err) {
					return console.log(err)
				}
				req.poster = poster
				next()
			})
		})
	}else {
		next()
	}
} 

// 电影保存
exports.save = function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie 

	if (req.poster) {
		movieObj.poster = req.poster  // 如果上传了海报
	}
	if (id) { // 已有电影，更新
		Movie.findById(id, (err, movie) => {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save((err, movie) => {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}else { // 新电影，插入
		_movie = new Movie(movieObj)

		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName  // 单独输入了分类

		_movie.save((err, movie) => {
			if (err) {
			 return	console.log(err)
			}
			// 如果选择了分类
			if (categoryId) {
				// 电影保存成功之后，更新当前电影ID到所属的分类下
				Category.findById(categoryId, (err, category) => {
					if (err) {
						return console.log(err)
					}
					category.movies.push(movie._id)
					category.save((err, category) => {
						if (err) return console.log(err)
						res.redirect('/movie/' + movie._id)
					})
				})
			}else if (categoryName){
				console.log("insert category")
				var category = new Category({
					name: categoryName,
					movies: [movie._id],  // 保存当前电影到新的分类
				})
				category.save((err, category) => {
					if (err) return console.log(err)
					movie.category = category._id
					movie.save((err, movie) => {
						if (err) return console.log(err)
						res.redirect('/movie/' + movie._id)
					})
				})
			}
		})
	}
}

// 删除
exports.del = function(req, res) {
	var id = req.query.id
	if (id) {
		Movie.remove({_id: id}, (err, movie) => {
			if (err) {
				console.log(err)
			}else {
				res.json({success: 1})
			}
		})
	}
}

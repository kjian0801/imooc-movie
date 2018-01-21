var Movie = require('../models/movie')
var Category = require('../models/category')
var pageCount = 2
// 首页
exports.index = function(req, res) {
	Category
		.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec((err, categories) => {
			if (err) {
				console.log(err)
			}
			res.render('index', {
				title: 'Imooc 首页',
				categories: categories
			})
		})
}

// 搜索页
exports.search = function(req, res) {
	var catId = req.query.cat
	var kw = req.query.kw
	var page = parseInt(req.query.page, 10) || 0 // 如果是搜索来的，没有page字段
	var index = page * pageCount  // 查询起始索引

	if (catId) { // 如果是点击分类
		Category
			.find({_id: catId})
			.populate({
				path: 'movies', 
				// options: {limit: pageCount, skip: index} // 视频里分页逻辑实现 skip有bug，此处没有
			})
			.exec((err, categories) => {
				if (err) {
					console.log(err)
				}
				var category = categories[0] || {}
				var movies = category.movies || []
				var results = movies.slice(index, index + pageCount)  // 自己实现分页

				res.render('results', {
					title: 'Imooc 结果列表',
					keyword: category.name,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / pageCount),
					query: 'cat=' + catId,
					movies: results
				})
			})
	} else {  // 如果是搜索
		Movie.find({title: new RegExp(kw + '.*', 'i')})  // 正则实现简单模糊查询
			.exec((err, movies) => {
				if (err) {
					console.log(err)
				}
				var results = movies.slice(index, index + pageCount)  // 自己实现分页

				res.render('results', {
					title: 'Imooc 结果列表',
					keyword: kw,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / pageCount),
					query: 'cat=' + kw,
					movies: results
				})
			})
	}
}

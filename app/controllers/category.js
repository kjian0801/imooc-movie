var Category = require('../models/category')

// 分类录入页
exports.new = function(req, res) {
	res.render('categoryAdmin', {
		title: 'Imooc 分类录入页',
		category: {}
	})
}

// 分类保存
exports.save = function(req, res) {
	var _category = req.body.category
	var category = new Category(_category)

	category.save((err, movie) => {
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/category/list')
	})
}

// 分类列表
exports.list = function(req, res) {
	Category.fetch((err, categories) => {
		if (err) {
			console.log(err)
		}
		res.render('categoryList', {
			title: 'Imooc 分类列表',
			categories: categories
		})
	})
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

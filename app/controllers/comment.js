var Comment = require('../models/comment')

// 评论保存
exports.save = function(req, res) {
	var _comment = req.body.comment
	var movieId = _comment.movie // 评论的哪一部电影

	// 如果是回复的
	if (_comment.cid) {
		Comment.findById(_comment.cid, (err, comment) => {
			var replay = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}
			comment.replay.push(replay)
			comment.save((err, comment) => {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movieId)
			})
		})
	}
	// 如果是直接评论的 
	else {
		var comment = new Comment(_comment)
		comment.save((err, comment) => {
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/' + movieId)
		})
	}
}



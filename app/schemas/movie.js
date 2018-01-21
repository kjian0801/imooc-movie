var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	category: {
		type: ObjectId,
		ref: "Category"
	},
	year: {
		type: Number,
		default: new Date().getFullYear()
	},
	pv: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

// ------------------------此处用箭头函数有bug, this 的问题
// MovieSchema.pre('save', (next) => {
// 	console.log(this)
// 	if (this.isNew) {
// 		this.meta.createAt = this.meta.updateAt = Date.now() 
// 	}else {
// 		this.meta.updateAt = Date.now()
// 	}
// 	next()
// })
MovieSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now() 
	}else {
		this.meta.updateAt = Date.now()
	}
	if (this.year === 'null') {
		this.year = new Date().getFullYear()
	}
	next()
})

MovieSchema.statics = {
	fetch: function(cb) {
		return this
						.find({})
						.sort('meta.updateAt')
						.exec(cb) 
	},
	findById: function(id, cb) {
		return this
						.findOne({_id: id})
						.exec(cb)
	}
}

module.exports = MovieSchema
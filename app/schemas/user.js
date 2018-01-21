var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10 //  密码加盐强度

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	// 0: normal user
	// 1: verified user 已激活用户 
	// 2: professonal user 高级用户
	// ...
	// >= 10: admin
	//
	// >50: super admin
	role: {
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

UserSchema.pre('save', function(next) {
	var user = this;
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now() 
	}else {
		this.meta.updateAt = Date.now()
	}
	// 密码加盐
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err)
			bcrypt.hash(user.password, salt, null, (err, hash) => {
				if (err) return next(err)
					user.password = hash
					next()
			})
	})
	next()
})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, (err, isMatch) => {
			if (err) return cb(err)
			cb(null, isMatch)				
		})
	}
}

UserSchema.statics = {
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
	},
}

module.exports = UserSchema
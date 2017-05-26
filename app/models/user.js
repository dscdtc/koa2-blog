'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    gender: String,
    avatar: String,
    bio: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    meta: {
        createAt: {
            type: Date,
            dafault: Date.now()
        },
        updateAt: {
            type: Date,
            dafault: Date.now()
        }
    }
}, { versionKey: false });

UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

let User = mongoose.model('User', UserSchema)

module.exports = {
    // 注册用户
    create: function create(user) {
        user = new User(user)
        return user.save();
    },

    // 注销用户
    remove: function remove(name) {
        return User.findOne({ name: name }).remove.exec();
    },

    //通过用户名获取信息
    getUserByName: function getUserByName(name) {
        return User.findOne({ name: name }).exec();
    },

    //通过用户id获取信息
    getUserById: function getUserById(id) {
        return User.findOne({ _id: id }).exec();
    }
};
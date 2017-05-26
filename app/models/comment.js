//'use strict'

const marked = require('marked')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostModel = require('./post')

const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    content: String,
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
})

CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

let Comment = mongoose.model('Comment', CommentSchema)

module.exports = {
    // 创建留言
    create: function create(comment) {
        var comment = new Comment(comment)
        return Promise.all([
            comment.save(),
            // 更新Post中留言数
            PostModel.updateCommentsCount(comment.postId, 1)
        ]);
    },

    // 通过用户 id 和留言 id 删除一个留言
    delCommentById: function delCommentsById(commentId, postId, author) {
        return Promise.all([
            Comment.remove({ _id: commentId, author: author }).exec(),
            // 更新Post中留言数
            PostModel.updateCommentsCount(postId, -1)
        ])
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentsByPostId: function delCommentsByPostId(postId) {
        return Comment.remove({ postId: postId }).exec();
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments: function getComments(postId) {
        return Comment
            .find({ postId: postId })
            .populate({ path: 'author' })
            .sort({ _id: 1 })
            .exec();
    },

    // // 通过文章 id 获取该文章下留言数
    // getCommentsCount: function getCommentsCount(postId) {
    //     return Comment.count({ postId: postId }).exec(); 
    // }
};
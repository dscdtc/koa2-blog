'use strict'
const marked = require('marked')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CommentModel = require('./comment');

const PostSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    content: String,
    pv: Number,
    label: String,
    commentsCount: {
        type: Number,
        default: 0
    },
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

PostSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})

let Post = mongoose.model('Post', PostSchema);
module.exports = {
    //创建文章
    create: function create(post) {
        post = new Post(post)
        return post.save();
    },

    //通过文章id获取文章
    getPostById: function getPostById(postId) {
        return Post.findOne({ _id: postId })
            .populate({ path: 'author' })
            .exec()
    },

    // 按创建时间降序 获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts(author) {
        let count = 2;
        let page = 2;
        let test = (page - 1) * count

        let query = {};
        if (author) {
            query.author = author
        }
        return Post.find(query)
            //.limit(5)
            //.skip(test)
            .populate({ path: 'author' })
            .sort({ _id: -1 })
            .exec()
            // .map(post => {
            //     post.content = marked(post.content);
            //     //post.commentsCount = await CommentModel.getCommentsCount(postId);
            // });
    },

    // 通过文章id给pv加1
    incPv: function incPv(postId) {
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 } })
            .exec();
    },

    // 通过文章id获取用于编辑的文章内容
    getRawPostById: function getRawPostById(postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author' })
            .exec();
    },

    // 通过用户id和文章id更新文章
    updatePostById: function updatePostById(postId, author, data) {
        return Post.update({ author: author, _id: postId }, { $set: data }).exec();
    },

    // 通过用户id和文章id删除文章
    delPostById: function delPostById(postId, author) {
        return Post.remove({ author: author, _id: postId })
            .exec()
            // .then(function(res) {
            //     // 文章删除后，再删除该文章下的所有留言
            //     if (res.result.ok && res.result.n > 0) { //?????
            //         return CommentModel.delCommentsByPostId(postId);
            //     }
            // })
    },

    // 更新评论数
    updateCommentsCount: function updateCommentsCount(postId, updateNum) {
        return Post.update({ _id: postId }, { $inc: { commentsCount: updateNum } });
    }

};
const marked = require('marked');
const mongoose = require('mongoose');
const PostModel = require('../models/post');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');

// // GET /posts 所有用户或特定用户的文章页
// // eg： GET /posts?author=xxx
exports.list = async(ctx) => {
    let author = ctx.request.query.author;
    let posts = await PostModel.getPosts(author);
    let user = await UserModel.getUserById(author);
    posts.map(post => {
        post.content = marked(post.content);
    });
    await ctx.render('posts', {
        authorHead: author,
        author: user,
        posts: posts
    });
};


// GET /posts/create 发表文章页
exports.createPage = async(ctx) => {
    let user = ctx.session.user
    if (!user) {
        ctx.flash = { error: '请先登录' };
        return ctx.redirect('/posts');
    } else {
        await ctx.render('create', {
            author: user,
            authorHead: 1
        });
    }
};


// POST /posts 发表一篇文章
exports.create = async(ctx) => {
    let req = ctx.request.body;
    let author = ctx.session.user._id;
    let title = req.title;
    let label = req.label;
    let content = req.content;
    console.log(label)
        // 校验参数
    try {
        if (!author) {
            throw new Error('不要瞎搞，请先登录');
        }
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!label.length) {
            throw new Error('请选择分类');
        }
        if (!content.length) {
            throw new Error('请填写正文');
        }
    } catch (e) {
        ctx.flash = { error: e.message };
        return ctx.redirect('back');
    };

    let post = {
        author: author,
        title: title,
        label: label,
        content: content,
        pv: 0
    };

    // 存入数据库
    try {
        await PostModel.create(post);
    } catch (e) {
        ctx.flash = { error: '文章保存失败，请重试' };
        return ctx.redirect('back');
    }
    ctx.flash = { success: '文章发布成功' };
    return ctx.redirect('/posts')
};


// GET /posts/:postId 文章详情页
exports.postDetail = async(ctx) => {
    let postId = ctx.request.url.split('posts/')[1];
    result = await Promise.all([
        PostModel.getPostById(postId), // 获取文章信息
        CommentModel.getComments(postId), // 获取文章留言
        PostModel.incPv(postId) // 浏览数+1
    ]);
    let post = result[0];
    let comments = result[1];
    if (!post) {
        ctx.flash = { error: '文章不存在！' };
        return ctx.redirect('/posts')
    };
    post.content = marked(post.content);
    // //************************************* */
    // delete post.author; //????
    // console.log(post.author);
    // //************************************* */
    await ctx.render('post', {
        post: post,
        author: post.author,
        comments: comments,
        authorHead: 1
    });
};


// GET /posts/:postId/edit 更新文章页
exports.editPage = async(ctx) => {
    let postId = ctx.request.url.split('/')[2];
    let author = ctx.session.user;
    let post = await PostModel.getPostById(postId);
    try {
        if (!author) {
            throw new Error('请先登录！');
        }
        if (!post) {
            throw new Error('该文章不存在！');
        }
        if (author._id.toString() !== post.author._id.toString()) {
            throw new Error('您没有修改权限');
        }
        await ctx.render('edit', {
            author: author,
            post: post,
            authorHead: 1
        })
    } catch (e) {
        ctx.flash = { error: e.message };
        return ctx.redirect('/posts');
    }
};


// // POST /posts/:postId/edit 更新文章
exports.edit = async(ctx) => {
    let postId = ctx.request.url.split('/')[2];
    let author = ctx.session.user._id;
    let title = ctx.request.body.title;
    let content = ctx.request.body.content;

    try {
        await PostModel.updatePostById(postId, author, { title: title, content: content });
    } catch (e) {
        ctx.flash = { error: '保存出错，请重试' };
        return ctx.redirect('back');
    }
    ctx.flash = { success: '修改成功' };
    return ctx.redirect(`/posts/${postId}`);
};


// // GET /posts/:postId/remove 删除文章
exports.remove = async(ctx) => {
    let postId = ctx.request.url.split('/')[2];
    let author = ctx.session.user._id;

    try {
        await PostModel.delPostById(postId, author)
            .then(function(res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            })
    } catch (e) {
        ctx.flash = { error: '删除文章失败，请重试' };
        return ctx.redirect('back');
    }
    ctx.flash = { success: '删除文章成功' };
    return ctx.redirect('/posts');
};


// // GET /posts/:postId/comment 创建留言
exports.comment = async(ctx) => {
    let postId = ctx.request.url.split('/')[2];
    let author = ctx.session.user._id;
    let content = ctx.request.body.content;
    // 校验参数
    try {
        if (!author) {
            throw new Error('不要瞎搞，请先登录');
        }
        if (!content.length) {
            throw new Error('请填写留言内容');
        }
        comment = {
            author: author,
            postId: postId,
            content: content
        }
        await CommentModel.create(comment);
    } catch (e) {
        ctx.flash = { error: e.message };
        return ctx.redirect('back');
    };
    ctx.flash = { success: '留言成功' };
    return ctx.redirect('back')
};


// // GET /posts/:postId/comment/:commentId/remove 删除留言
exports.commentDel = async(ctx) => {
    let commentId = ctx.request.url.split('/')[4];
    let postId = ctx.request.url.split('/')[2];
    let author = ctx.session.user._id;
    try {
        await CommentModel.delCommentById(commentId, postId, author);
    } catch (e) {
        ctx.flash = { error: e.message };
        return ctx.redirect('back');
    }
    ctx.flash = { success: '删除留言成功' };
    return ctx.redirect('back');
};
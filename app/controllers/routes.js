const router = require('koa-router')()
const Signup = require('./signup')
const Posts = require('./posts')
const Signin = require('./signin')
module.exports = function() {
    router
        .get('/', async(ctx) => {
            ctx.redirect('/posts');
        })
        // 用户操作
        .get('/signup', Signup.signupPage)
        .post('/signup', Signup.signup)
        .get('/signin', Signin.signinPage)
        .post('/signin', Signin.signin)
        .get('/signout', Signin.signout)
        // 文章操作
        .get('/posts', Posts.list)
        .get('/posts/create', Posts.createPage)
        .post('/posts/create', Posts.create)
        .get('/posts/:postId', Posts.postDetail)
        .get('/posts/:postId/edit', Posts.editPage)
        .post('/posts/:postId/edit', Posts.edit)
        .get('/posts/:postId/remove', Posts.remove)
        .post('/posts/:postId/comment', Posts.comment)
        .get('/posts/:postId/comment/:commentId/remove', Posts.commentDel)
        // 404
        .get('*', async(ctx) => {
            await ctx.render('404');
        })

    return router
}
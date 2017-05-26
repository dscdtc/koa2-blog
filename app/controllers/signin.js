const md5 = require('md5');
const User = require('mongoose').model('User');

// GET /signin 登录页
exports.signinPage = async(ctx) => {
    await ctx.render('signin');
};

// POST /signin 登录
exports.signin = async(ctx) => {
    let req = ctx.request.body
    let name = req.name;
    let password = req.password;

    let user = await User.findOne({ name: name }).exec()
    try {
        if (!user) {
            ctx.flash = { error: '用户不存在' };
            ctx.redirect('back');
        } else if (md5(password) !== user.password) {
            ctx.flash = { error: '用户名或密码错误' };
            ctx.redirect('back');
        } else {
            ctx.flash = { success: '登陆成功' };
            // 用户信息写入session
            delete user.password;
            ctx.session.user = user;
            ctx.redirect('/posts');
        }
    } catch (e) {
        console.log(e.message)
        ctx.flash = { error: e.message };
        ctx.redirect('back');
    }
};

// GET /signout 注销
exports.signout = async(ctx) => {
    // 清空 session 中用户信息
    ctx.session.user = null;
    ctx.flash = { success: '注销成功' };
    ctx.redirect('/posts');
};
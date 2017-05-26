const fs = require('fs');
const md5 = require('md5');
const UserModel = require('../models/user');


exports.signupPage = async(ctx) => {
    await ctx.render('signup')
}

exports.signup = async(ctx) => {
    let req = ctx.request.body;
    let name = req.fields.name;
    let password = req.fields.password;
    let repassword = req.fields.repassword;
    let gender = req.fields.gender;
    let avatar = req.files.avatar.path.split('/').pop();
    let bio = req.fields.bio;

    //校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('用户名请限制在 1-10 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1) {
            throw new Error('请选择性别');
        }
        if (!avatar) {
            throw new Error('请上传头像');
        }
        if (req.files.avatar.type.split('/')[0] !== 'image') {
            throw new Error('请上传图片作为头像');
        }
        if (!(bio.length >= 1 && bio.length <= 50)) {
            throw new Error('个人简介请限制在 1-50 个字符');
        }
    } catch (e) {
        //注册失败，异步删除上传头像
        fs.unlink(req.files.avatar.path);
        ctx.flash = { error: e.message };
        return ctx.redirect('back');
    }

    // 检测用户名唯一
    let nameCheck = await UserModel.getUserByName(name)
    if (!nameCheck) {
        let user = {
            name: name,
            password: md5(password),
            avatar: avatar,
            gender: gender,
            bio: bio
        }
    } else {
        //注册失败，异步删除上传头像
        fs.unlink(req.files.avatar.path, function() {
            console.log('removed avatar file')
        });
        ctx.flash = { error: '注册失败：该用户名已被注册' }
        return ctx.redirect('back')
    }

    // 存入数据库
    try {
        let result = await UserModel.create(user);
        // 此 user 是插入 mongodb 后的值，包含 _id
        user = result;
        // 将用户信息存入 session
        delete user.password;
        ctx.session.user = user;
    } catch (e) {
        //注册失败，异步删除上传头像
        fs.unlink(req.files.avatar.path, function() {
            console.log('removed avatar file')
        });
        console.log(e.message);
        ctx.flash = { error: '用户保存失败，请重试' }
        return ctx.redirect('back')
    }
    ctx.flash = { success: '注册成功' }
    return ctx.redirect('/posts')
}
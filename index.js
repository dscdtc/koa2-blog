const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const marked = require('marked');
const render = require('koa-ejs');
const koaBody = require('koa-body');
const serve = require('koa-static');
const hljs = require('highlight.js');
const mongoose = require('mongoose');
const logger = require('koa-logger');
const Router = require('koa-router');
const convert = require('koa-convert');
const session = require('koa-session');
//koa@1 middleware
const flash = require('koa-flash');

// const config = require('./config/default');
const config = require('./config/production');
const router = require('./app/controllers/routes')();
// 遍历引入数据模型
const models_path = path.join(__dirname, './app/models');

function walk(modelPath) {
    fs
        .readdirSync(modelPath)
        .forEach(function(file) {
            let filePath = path.join(modelPath, '/' + file)
            let stat = fs.statSync(filePath)
            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(filePath)
                }
            } else if (stat.isDirectory()) {
                walk(filePath)
            }
        })
};
walk(models_path);

// 连接数据库
mongoose.Promise = require('bluebird');
mongoose.connect(config.mongodb);


const app = new Koa();
app.keys = ['koa-blog'];

app.use(convert(flash())); //TODO
// 设置全局变量
app.use(async(ctx, next) => {
    /* 设置消息提示 */
    ctx.flash = {
        success: '',
        error: ''
    };
    ctx.state = {
        blog: {
            title: config.blog.title,
            description: config.blog.description
        },
        user: ctx.session.user,
        authorHead: '',
        success: ctx.flash.success,
        error: ctx.flash.error
    };
    await next();
});

// 设置markdown解析器
// Synchronous highlighting with highlight.js
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code) {
        return hljs.highlightAuto(code).value;
    }
});

// 设置模板引擎
render(app, {
    root: path.join(__dirname, 'app/views'),
    layout: false,
    viewExt: 'ejs',
    cache: false
});

// 配置body解析中间件
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/static/img'), // 上传文件目录
        keepExtensions: true // 保留后缀
    }
}));


// 加载中间件
app.use(serve(path.join(__dirname, '/static'), { maxage: 30 * 24 * 60 * 60 }));
app.use(logger());
app.use(session(app));
app.use(router.routes()).use(router.allowedMethods()); // router必须放在最后！！！


// 直接启动 index.js 则会监听端口启动程序，如果 index.js 被 require 了，则导出 app，通常用于测试
if (module.parent) {
    module.exports = app;
} else {
    // 监听端口，启动程序
    const port = process.env.PORT || config.port;
    app.listen(port, function() {
        console.log(`${config.blog.title} listening on port ${config.port}`)
    });
}
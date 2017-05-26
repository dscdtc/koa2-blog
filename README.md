# [Koa1 Mulit-user Blog](https://dscdtc.herokuapp.com/)
#### Rebuild [private-blog project](https://github.com/dscdtc/node-express-blog)  based on koa1

使用 koa1 + MongoDB 搭建多人博客

[![TeamCity CodeBetter](https://img.shields.io/teamcity/codebetter/bt428.svg)]()[![Jenkins coverage](https://img.shields.io/jenkins/c/https/jenkins.qa.ubuntu.com/view/Utopic/view/All/job/address-book-service-utopic-i386-ci.svg)]()[![npm](https://img.shields.io/npm/v/npm.svg)]()[![Github Releases](https://img.shields.io/github/downloads/atom/atom/latest/total.svg)]()[![MyGet](https://img.shields.io/myget/mongodb/v/MongoDB.Driver.Core.svg)]()[![Github Releases](https://img.shields.io/github/downloads/atom/atom/latest/total.svg)]()


### 1. Develop Environment
- Node.js: `7.9.0`
- MongoDB: `3.2.11`
- Koa: `1.2.4`
### 2. Features
* Using MVC framework
* Using mongoose to control mongoDB
* Multi-user blog system
* Blog content support markdown
* Support [SimpleMDE - Markdown Editor](https://simplemde.com) 
* Deploy on free platform Heroku
### 3.Quickly start
```
# Under Linux
# clone this project
git clone git@github.com:dscdtc/koa1-blog.git
cd koa1-blog
# install dependencies
npm install

# 开发,跑在本地3000端口
# need superbisor
npm -g install supervisor
npm run local
# or directly use 
node index

# 测试(未完成)
# Use mocha + supertest 
# npm i mocha supertest --save-dev
# 测试覆盖率(未完成)
# Use istanbul
# npm i istanbul --save-dev
# 打包(未完成)
# npm run build-admin
```
### 4.Todo List
* ~~ Using Koa2 instead Koa1 ~~
* Add test plugin
* ~~ Add markdown edit plugin ~~
* ~~ Change user's homePage ~~
* Add user manage platform
* Add user info edit/remove
* Modify home page

### 5.Directory Tree
```txt
./koa1-blog/
├── app
│   ├── controllers
│   │   ├── app.js
│   │   ├── posts.js
│   │   ├── routes.js
│   │   ├── signin.js
│   │   └── signup.js
│   ├── models
│   │   ├── comment.js
│   │   ├── post.js
│   │   └── user.js
│   └── views
│       ├── 404.ejs
│       ├── components
│       │   ├── comments.ejs
│       │   ├── nav.ejs
│       │   ├── nav-setting.ejs
│       │   ├── notification.ejs
│       │   └── post-content.ejs
│       ├── create.ejs
│       ├── edit.ejs
│       ├── error.ejs
│       ├── footer.ejs
│       ├── header.ejs
│       ├── post.ejs
│       ├── posts.ejs
│       ├── signin.ejs
│       └── signup.ejs
├── config
│   └── default.js
├── index.js
├── LICENSE
├── package.json
├── README.md
├── static
│   ├── css
│   │   └── style.css
│   ├── favicon.ico
│   └── img
├── test
│   ├── avatar.jpg
│   └── signup.js
└── tree.txt

10 directories, 36 files
```

### Change Log
- v0.0.1 星期一, 03. 五月 2017 05:23下午
first blood! 创建项目
- v1.0.0 星期二, 16. 五月 2017 11:26上午
正式版上线
- v1.0.1 星期一, 22. 五月 2017 11:37上午 
 添加md编辑器[SimpleMDE - Markdown Editor](https://simplemde.com) 
 页面标题修改
### Contribution
有任何意见或建议都欢迎提 issue，或者直接提给 @[dscdtc](https://github.com/dscdtc)

### Thanks
Specially thank to [nswbmw](https://maninboat.gitbooks.io/n-blog/content/) this is a perfect studing project

<p>Copyright © 2017 <a href="https://github.com/dscdtc">dscdtc</a>.All Rights Reserved</p>

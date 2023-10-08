# node-mongo-backend
通用 node 后端模块

`nodejs` + `mongodb` + `mongoose`

## 项目启动

**安装依赖**

```
npm install
```

**启动项目**

在 MacOS 或 Linux 中，通过如下命令启动此应用：

```console
$ DEBUG=myapp:* npm start
```

在 Windows 命令行中，使用如下命令：

```console
> set DEBUG=myapp:* & npm start
```

在 Windows 的 PowerShell 中，使用如下命令：

```console
PS> $env:DEBUG='myapp:*'; npm start
```

**部署项目**

使用 pm2 管理工具进行处理

```javascript
pm2 list
// 删除指定实例或全部实例
pm2 delete <app_name_or_id || all>
pm2 start ./bin/www
```

## 模型构建

利用 mongoose 创建模型，进行 MongoDB 数据库操作

```js
const mongoose = require('mongoose')

const StaffSchema = mongoose.Schema({
    name: String,
    phone: String,
    entryTime: String,
    station: String,
    status: { type: Number, default: 0 }
})

module.exports = StaffSchema;
```

## 鉴权处理

创建全局鉴权信息

```javascript
app.use(
    jwt({
        secret: config.jwtSecretKey,
        algorithms: ["HS256"],
    }).unless({ path: [/^\/api\/user/, /^\/img/] })
);
```

生成 token 信息

```javascript
const user = { ...staffs[0]._doc }
// 对用户的信息进行加密，生成 token 字符串 
const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
```

## 
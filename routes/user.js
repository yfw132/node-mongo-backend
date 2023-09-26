var express = require('express');
var router = express.Router();
var { result_data, Rule, Staff, Verify } = require('../db/mongo.js')
const axios = require('axios')

// 导入 bcryptjs 加密包
const bcrypt = require('bcryptjs')
// 导入生成Token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件（里面有token的密钥）
const config = require('../config.js')

router.post('/message', async function (req, res, next) {
  let messageData = req.body
  const staffs = await Staff.find({ phone: messageData.phone });
  if (staffs.length !== 1) return res.send(result_data(400, staffs, '账户不存在'))

  let code = ''
  for (let i = 0; i < 6; i++) {
    let num = Math.round(Math.random() * 9);
    code += num
  }

  axios.get('https://fc-mp-93abee98-7f96-4382-bc60-481b028c7d96.next.bspapp.com/messageService?phone=' + messageData.phone + '&code=' + code)
    .then(async myRes => {
      const verifys = await Verify.find({ phone: messageData.phone })
      const time = new Date()
      if (verifys.length == 0) {
        const verify = new Verify({ phone: messageData.phone, code: code, time })
        await verify.save()
      }
      else {
        await Verify.updateOne({ phone: messageData.phone }, { code: code, time });
      }
      res.send(result_data(200, myRes.data, '发送成功'))
    })
    .catch(error => {
      res.send(result_data(400, error, '发送失败'))
    })
});

router.post('/login', async function (req, res, next) {
  // 获取客户端提交到服务器的用户信息
  const { code, phone } = req.body

  const verifys = await Verify.find({ phone })
  let now = new Date()
  if (verifys.length == 0) {
    return res.send(result_data(400, null, '验证码错误'))
  }
  else if (verifys[0].code !== code) {
    return res.send(result_data(400, null, '验证码错误'))
  }
  else if (parseInt((now - verifys[0].time) / 1000 / 60) > 30) {
    return res.send(result_data(400, null, '验证码过期'))
  }
  else {
    const staffs = await Staff.find({ phone });
    if (staffs.length !== 1) return res.send(result_data(400, null, '账户不存在'))
    const user = { ...staffs[0]._doc }
    // 对用户的信息进行加密，生成 token 字符串 
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 调用 res.send 将Token响应给客户端
    const rules = await Rule.find({ _id: user.station })

    res.send(result_data(
      200,
      {
        token: 'Bearer ' + tokenStr,
        info: user,
        rule: rules[0]
      },
      '登录成功'))
  }
});

module.exports = router;

// router.post('/rule', async function (req, res, next) {
//   var rule = new Rule(req.body)
//   await rule.save()
//   res.send(result_data(200, null, '创建成功'))
// });

// router.post('/staff', async function (req, res, next) {
//   var staff = new Staff(req.body)
//   await staff.save()
//   res.send(result_data(200, null, '创建成功'))
// });

// router.get('/find/staff', async function (req, res, next) {
//   const query = req.query
//   const staffs = await Staff.find(query);
//   res.send(result_data(200, staffs, '获取成功'))
// });
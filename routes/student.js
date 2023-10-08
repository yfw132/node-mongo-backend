var express = require('express');
var router = express.Router();
var { result_data, check_rule, Student } = require('../db/mongo.js')

// 导入生成Token的包
const jwt = require('jsonwebtoken')
const RULE = 'student_list'
const NO_TOKEN = result_data(401, null, '无权限')

router.get('/getList', async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    const jwtDecode = jwt.decode(token);
    if (!check_rule(jwtDecode.station, RULE)) {
        return res.send(NO_TOKEN)
    }

    const page = req.query.page ?? 1
    const size = req.query.size ?? 10

    const list = await Student.find().skip((page - 1) * size).limit(size);
    const total = await Student.count()
    res.send(result_data(200, {
        total: total,
        list: list
    }, '获取成功'))
});

router.post('/create', async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    const jwtDecode = jwt.decode(token);
    if (!check_rule(jwtDecode.station, RULE)) {
        return res.send(NO_TOKEN)
    }

    const list = await Student.find({ phone: req.body.phone })
    if (list.length !== 0) {
        return res.send(result_data(400, null, '电话号码重复'))
    }

    var item = new Student(req.body)
    await item.save()
    res.send(result_data(200, null, '创建成功'))
});

router.post('/update/:id', async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    const jwtDecode = jwt.decode(token);
    if (!check_rule(jwtDecode.station, RULE)) {
        return res.send(NO_TOKEN)
    }

    if (req.body.phone) {
        const list = await Student.find({ phone: req.body.phone, _id: { $ne: req.params.id } })
        if (list.length !== 0) {
            return res.send(result_data(400, null, '电话号码重复'))
        }
    }

    await Student.findByIdAndUpdate(req.params.id, req.body)
    res.send(result_data(200, null, '修改成功'))
});

router.post('/delete/:id', async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    const jwtDecode = jwt.decode(token);
    if (!check_rule(jwtDecode.station, RULE)) {
        return res.send(NO_TOKEN)
    }

    await Student.findByIdAndDelete(req.params.id)
    res.send(result_data(200, null, '删除成功'))
});

router.get('/item/:id', async function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    const jwtDecode = jwt.decode(token);
    if (!check_rule(jwtDecode.station, RULE)) {
        return res.send(NO_TOKEN)
    }

    const item = await Student.findById(req.params.id)
    res.send(result_data(200, item, '获取成功'))
});

module.exports = router;
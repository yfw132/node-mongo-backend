const mongoose = require('mongoose')

const USERNAME = 'early_education'		//用户名
const PASSWORD = 'GsLiC8DCM6HSAxPa'		//数据库密码
const HOST = '47.99.130.213'		//本地地址
const PORT = 27017  		//端口号
const DATABASE = 'early_education'	//数据库名字

const url = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}`

mongoose.connect(url)

const result_data = (status, data, message) => {
  return {
    status,
    data,
    message
  }
}

const RuleSchema = require('./schema/rule')
const StaffSchema = require('./schema/staff')
const VerifySchema = require('./schema/verify')
const StudentSchema = require('./schema/student')

// 定义权限表模块
const Rule = mongoose.model('Rule', RuleSchema)
const Staff = mongoose.model('Staff', StaffSchema)
const Verify = mongoose.model('Verify', VerifySchema)
const Student = mongoose.model('Student', StudentSchema)

const check_rule = async (station_id, rule_name) => {
  const rules = await Rule.findById(station_id)
  if (rules.length !== 1) {
    return false
  }
  else if (rules[0].rulePage.indexOf(rule_name) === -1) {
    return false
  }
  else {
    return true
  }
}

module.exports = { result_data, check_rule, Rule, Staff, Verify, Student };
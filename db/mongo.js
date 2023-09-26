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

// 定义权限表模块
const RuleSchema = mongoose.Schema({
  ruleName: String,
  rulePage: Array,
  notes: String
})
const Rule = mongoose.model('Rule', RuleSchema)

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

const StaffSchema = mongoose.Schema({
  name: String,
  phone: String,
  entryTime: String,
  station: String,
  status: { type: Number, default: 0 }
})
const Staff = mongoose.model('Staff', StaffSchema)

const VerifySchema = mongoose.Schema({
  code: String,
  phone: String,
  time: Date,
})
const Verify = mongoose.model('Verify', VerifySchema)

module.exports = { result_data, check_rule, Rule, Staff, Verify };
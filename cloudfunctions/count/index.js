// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    var shut = -1
    var boom = -1
    await db.collection('guests').where({
      state: 2
    }).get()
    .then(res => {
      boom = res.data.length
    })
    await db.collection('guests').where({
      state: 1
    }).get()
    .then(res => {
      shut = res.data.length
    })
    
  } catch (e) {
    console.error(e)
  }

  return {
    shut: shut,
    boom: boom
  }


}
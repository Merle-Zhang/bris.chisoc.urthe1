// miniprogram/pages/dashboard/dashboard.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guestsArray: [],
    remainder: 0,

    multiIndex: [0, 0],
    multiArray: [['一号男嘉宾', '二号男嘉宾', '三号男嘉宾', '四号男嘉宾', '五号男嘉宾'], ['第一轮', '第二轮']]

  },


  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const db = wx.cloud.database()
    db.collection('guests').where({
      multiIndex: e.detail.value
    }).get().then(res => {
      this.setData({
        guestsArray: res.data,
        multiIndex: e.detail.value
      })
      console.log("get guests array ssuccess")
      console.log(res)
    }).catch(console.error)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('guests').where({
      multiIndex: this.data.multiIndex
    }).get().then(res => {
      this.setData({
        guestsArray: res.data
      })
      wx.showToast({
        title: 'Success',
      })
      console.log(res.data)
      console.log("get guests array success")
    })
    db.collection('guests').where({
      multiIndex: this.data.multiIndex,
      state: _.neq(1)
    }).get().then(res => {
      this.setData({
        remainder: res.data.length
      })
      console.log(res.data)
      console.log("get remainder success")
    })
    console.log(app.globalData)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
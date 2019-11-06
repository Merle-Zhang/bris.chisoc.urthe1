// miniprogram/pages/status/status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    state: 0,
    intervalId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    var inId = setInterval(this.getState, 2000)
    this.setData({
      intervalId : inId
    })
  },

  getState: function () {
    const db = wx.cloud.database()
    db.collection('guests').doc(this.data.id).get()
      .then(res => {
        this.setData({
          state: res.data.state
        })
        console.log("[onLoad] get statse success")
        console.log(res)
      }).catch(res => {
        console.error("[onLoad] get statse failed" + this.data.id)
        console.error(res)
      })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.intervalId)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.intervalId)
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
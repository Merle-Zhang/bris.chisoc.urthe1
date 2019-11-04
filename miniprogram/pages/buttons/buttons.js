// miniprogram/pages/buttons/buttons.js

const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    disabled: false,
    loading: false,
    openid: '',
    docId: '',
    name: '',
    isEditingName: false,
    inputName: ''
  },

  bindInputName: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },

  onTapName: function (e) {
    if (this.data.isEditingName) {
      const db = wx.cloud.database()
      db.collection("guests").doc(this.data.docId).update({
        data: {
          name: this.data.inputName
        }
      })
        .then(r => {
          if (r.stats.updated == 0) {
            console.error(r)
          } else {
            this.setData({
              name: this.data.inputName,
              inputName: ''
            })
            console.log(r)
          }
        })
        .catch(console.error)
    }
    this.setData({
      isEditingName: !this.data.isEditingName
    })
  },

  onShut: function (e) {
    this.setData({
      disabled: true
    })
    const db = wx.cloud.database()

    // db.collection('guests').add({
    //   data: {
    //     count: 1
    //   },
    //   success: res => {
    //     // 在返回结果中会包含新创建的记录的 _id
    //     this.setData({
    //       docId: res._id,
    //     })
    //     wx.showToast({
    //       title: '新增记录成功',
    //     })
    //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '新增记录失败'
    //     })
    //     console.error('[数据库] [新增记录] 失败：', err)
    //   }
    // })

    db.collection("guests").doc(this.data.docId).update({
      data: {
        shut: true
      }
    })
      .then(console.log)
      .catch(console.error)
  },


  onBoom: function (e) {
    this.setData({
      disabled: true
    })
    const db = wx.cloud.database()

    // db.collection('guests').add({
    //   data: {
    //     count: 1
    //   },
    //   success: res => {
    //     // 在返回结果中会包含新创建的记录的 _id
    //     this.setData({
    //       docId: res._id,
    //     })
    //     wx.showToast({
    //       title: '新增记录成功',
    //     })
    //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '新增记录失败'
    //     })
    //     console.error('[数据库] [新增记录] 失败：', err)
    //   }
    // })

    db.collection("guests").doc(this.data.docId).update({
      data: {
        boom: true
      }
    })
      .then(console.log)
      .catch(console.error)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    } else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            openid: res.result.openid
          })
          // wx.showToast({
          //   title: 'Get openid success',
          // })

          const db = wx.cloud.database()
          db.collection('guests').add({
            data: {
              shut: false,
              boom: false,
              name: ''
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              this.setData({
                docId: res._id,
              })
              wx.showToast({
                title: 'openid&新增记录成功',
              })
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: 'openid&新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
  },


  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
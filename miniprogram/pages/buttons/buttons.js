// miniprogram/pages/buttons/buttons.js

const app = getApp()

var dummydata = {
  name: 'ttestt',
  state: 0, // 0: default, 1: shut, 2: boom
  boynum: 1,
  term: 1
}

Page({
  data: {
    openid: '',
    termDocId: '',
    
    state: 0,
    
    isEditingName: false,
    name: '',
    inputName: '',

    multiIndex: [0,0],
    multiArray: [['一号男嘉宾', '二号男嘉宾', '三号男嘉宾', '四号男嘉宾', '五号男嘉宾'], ['第一轮', '第二轮']]

  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const db = wx.cloud.database()
    db.collection('guests').where({
      _openid: this.data.openid,
      multiIndex: e.detail.value
    }).get().then(res => {
      if (res.data.length == 0) {
        // add doc
        db.collection('guests').add({
          data: {
            // update state!!!!!!!!!!!!!!!!
            state: 0,
            multiIndex: e.detail.value
          }
        })
        .then(res => {
          this.setData({
            termDocId: res._id,
            state: 0,
            multiIndex: e.detail.value
          })
          console.log('add termdoc success!!!')
          console.log(res)
        })
        .catch(console.error)
      } else {
        db.collection('guests')
          .doc(res.data[0]._id)
          .get()
          .then(r => {
            console.log('[bindMultiPickerChange]get termdoc success!!!')
            console.log(r)
            this.setData({
              termDocId: res.data[0]._id,
              multiIndex: e.detail.value,
              state: r.data.state,
            })
          }).catch(r => {
            console.error('[bindMultiPickerChange]get termdoc failed!!!')
            console.error(r)
          })
      }
    }).catch(console.error)
  },
  
  bindInputName: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },

  onTapName: function (e) {
    if (this.data.isEditingName) {
      const db = wx.cloud.database()
      db.collection('profile').where({
        _openid: this.data.openid
      }).get().then(res => {
        if (res.data.length == 0) {
          // add doc
          db.collection('profile').add({
            data: {
              name: this.data.inputName
            }
          })
            .then(res => {
              console.log('add name success!!!')
              console.log(res)
            })
            .catch(console.error)
        } else {
          db.collection('profile')
            .doc(res.data[0]._id)
            .update({
              data: {
                name: this.data.inputName
              }
            })
            .then(res => {
              console.log('update name success!!!')
              console.log(res)
              this.setData({
                name: this.data.inputName
              })
            })
        }
      }).catch(console.error)
    }
    this.setData({
      isEditingName: !this.data.isEditingName
    })
  },

  onShut: function (e) {
    const db = wx.cloud.database()
    db.collection("guests").doc(this.data.termDocId).update({
      data: {
        state: 1
      }
    })
    .then(res => {
      this.setData({
        state: 1
      })
      wx.showToast({
        title: '灭灯成功',
      })
      console.log("[onShut]update state to 1 success")
      console.log(res)
    })
    .catch(res => {
      console.error("[onShut]update state to 1 failed")
      console.error(res)
    })
  },


  onBoom: function (e) {
    const db = wx.cloud.database()
    db.collection("guests").where({
      multiIndex: this.data.multiIndex,
      state: 2
    }).get().then(res => {
      if (res.data.length == 0) {
        db.collection("guests").doc(this.data.termDocId).update({
          data: {
            state: 2
          }
        })
        .then(res => {
          this.setData({
            state: 2
          })
          wx.showToast({
            title: '爆灯成功',
          })
          console.log("[onBoom]update state to 2 success")
          console.log(res)
        })
        .catch(res => {
          console.error("[onBoom]update state to 2 failed")
          console.error(res)
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '爆灯失败',
        })
        console.error("[onBoom]boom failed")
      }
    })
  },

  // unused
  getOpenId: function() {
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

          // const db = wx.cloud.database()
          // db.collection('guests').add({
          //   data: {
          //     shut: false,
          //     boom: false,
          //     name: 'name'
          //   },
          //   success: res => {
          //     // 在返回结果中会包含新创建的记录的 _id
          //     this.setData({
          //       docId: res._id,
          //     })
          //     wx.showToast({
          //       title: 'openid&新增记录成功',
          //     })
          //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          //   },
          //   fail: err => {
          //     wx.showToast({
          //       icon: 'none',
          //       title: 'openid&新增记录失败'
          //     })
          //     console.error('[数据库] [新增记录] 失败：', err)
          //   }
          // })

        },
        fail: err => {
          // wx.showToast({
          //   icon: 'none',
          //   title: '获取 openid 失败，请检查是否有部署 login 云函数',
          // })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
  },

  // unused
  updateName: function(inputName) {
    const db = wx.cloud.database()
    db.collection('profile').where({
      _openid: this.data.openid
    }).get().then(res => {
      if (res.data.length == 0) {
        // add doc
        db.collection('profile').add({
          data: {
            name: inputName
          }
        })
        .then(res => {
          console.log('add name success!!!')
          console.log(res)
        })
        .catch(console.error)
      } else {
        db.collection('profile')
          .doc(res.data[0]._id)
          .update({
            data: {
              name: inputName
            }
          })
          .then(res => {
            console.log('update name success!!!')
            console.log(res)
            this.setData({
              name: inputName
            })
          })
      }
    }).catch(console.error)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  getState: function () {
    const db = wx.cloud.database()
    db.collection('guests').where({
      _openid: this.data.openid,
      multiIndex: this.data.multiIndex
    }).get().then(res => {
      if (res.data.length == 0) {
        // add doc
        db.collection('guests').add({
          data: {
            state: 0,
            multiIndex: this.data.multiIndex
          }
        })
          .then(r => {
            this.setData({
              termDocId: r._id,
              state: 0,
            })
            console.log('[getState]add termdoc success!!!')
            console.log(r)
          })
          .catch(console.error)
      } else {
        db.collection('guests')
          .doc(res.data[0]._id)
          .get()
          .then(r => {
            this.setData({
              termDocId: res.data[0]._id,
              state: r.data.state,
            })
            console.log('[getState]get termdoc success!!!')
            console.log(r)
          })
      }
    }).catch(console.error)
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
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })
        console.log('openid get success')
        // getname
        const db = wx.cloud.database()
        db.collection('profile').where({
          _openid: this.data.openid
        }).get().then(res => {
          if (res.data.length == 0) {
            // add doc
            db.collection('profile').add({
              data: {
                name: ''
              }
            })
              .then(res => {
                console.log('add name success!!!')
                console.log(res)
                this.getState()
              })
              .catch(console.error)
          } else {
            db.collection('profile')
              .doc(res.data[0]._id)
              .get()
              .then(res => {
                this.setData({
                  name: res.data.name
                })
                console.log('get name success!!!')
                console.log(res)
                this.getState()
              })
              .catch(console.error)
          }
        }).catch(console.error)

      },
      fail: err => {
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })

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

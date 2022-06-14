<template>
  <view class="content">
    <view class="main">
      <view v-for="(item, index) in listData" :key="index" class="main-item" @touchend="checkDetail(item)">
        <img src="@/static/img/attention.png" alt="" style="width: 50rpx; height: 50rpx" />
        <view class="main-text">
          <text class="text-s">{{ item.companyName }}</text>
          <img
            src="@/static/img/zcx.png"
            alt=""
            style="width: 40rpx; height: 40rpx; margin-left: 10rpx"
            v-if="item.zhongchengxin == 1"
          />
          <img
            src="@/static/img/tyc.png"
            alt=""
            style="width: 40rpx; height: 40rpx; margin-left: 10rpx"
            v-if="item.tianyancha == 1"
          />
        </view>
        <view class="tag" v-if="Number(item.messageNumber)">
          <img
            src="@/static/img/tag.png"
            alt=""
            style="width: 100%; height: 100%; position: absolute; left: 0; top: 0"
          />
          <text style="position: relative; top: 6rpx; left: 6rpx; z-index: 1">{{
            Number(item.messageNumber) > 99 ? '99+' : item.messageNumber
          }}</text>
        </view>
      </view>
    </view>
    <uni-load-more :status="loadStatus"></uni-load-more>
  </view>
</template>

<script>
import { userAPI } from '@/api/index.js'
export default {
  data() {
    return {
      listData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      loadStatus: 'more',
      touchNum: 0,
    }
  },
  onShow() {
    this.currentPage = 1
    this.listData = []
    this.getData()
  },
  //上拉加载更多
  onReachBottom() {
    if (this.listData.length < this.currentPage * this.pageSize) {
      this.loadStatus = 'noMore'
      return
    }
    this.currentPage++
    this.getData()
  },
  //下拉刷新
  onPullDownRefresh() {
    this.currentPage = 1
    this.listData = []
    this.getData()

    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    getData() {
      let param = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        userId: uni.getStorageSync('userId'),
      }
      userAPI.getCareList(param).then((res) => {
        if (res.data.code == '0') {
          this.total = res.data.total
          let temp = res.data.careList ? JSON.parse(res.data.careList) : []
          console.log(JSON.parse(res.data.careList))
          this.loadStatus = 'loading'
          this.listData = [...this.listData, ...temp]
          if (this.listData.length < this.currentPage * this.pageSize) {
            this.loadStatus = 'noMore'
            return
          }
          this.loadStatus = 'more'
        }
      })
    },
    checkDetail(item) {
      this.touchNum++
      setTimeout(() => {
        if (this.touchNum == 1) {
          uni.navigateTo({
            url: `/pages/enterpriseBaseInfo/index?title=关注清单&companyName=${item.companyName}&companyId=${item.companyId}`,
          })
        }
        if (this.touchNum >= 2) {
          uni.showToast({
            icon: 'none',
            title: item.companyName,
            mask: true,
            duration: 2000,
          })
        }
        this.touchNum = 0
      }, 250)
      // this.touchNum=0
    },
    showCompanyName(item) {
      console.log(item.companyName)
    },
  },
}
</script>

<style scoped>
.main {
  padding: 20rpx;
}

.main-item {
  margin-top: 20rpx;
  padding: 20rpx 10rpx;
  /* border: 1px solid #efefef; */
  box-shadow: #efefef 0 0 10rpx;
  border-radius: 10rpx;
  /* background-color: rgba(239,239,239,0.2); */
  display: flex;
  align-items: center;
  background-color: rgba(53, 144, 223, 0.1);
}

.main-text {
  margin-left: 10rpx;
  flex: 1;
  display: flex;
  align-items: center;
  /* max-width: 56vw; */
}

.text-s {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 50vw;
  margin-right: 10rpx;
}

.tag {
  width: 80rpx;
  height: 50rpx;
  vertical-align: bottom;
  margin-left: 40rpx;
  position: relative;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
}
</style>

<template>
	<view class="content">
		
		<view class="main">
			<view v-for="(item,index) in listData" :key="index" class="main-item">
				<img src="@/static/img/attention.png" alt="" style="width: 50rpx;height: 50rpx;" >
				<text class="main-text">{{item.companyName}}
				<img src="@/static/img/zcx.png" alt="" style="width: 40rpx;height: 40rpx;margin-left: 10rpx;vertical-align: bottom;" v-if="item.zhongchengxin==1">
				<img src="@/static/img/tyc.png" alt="" style="width: 40rpx;height: 40rpx;margin-left: 10rpx;vertical-align: bottom;" v-if="item.tianyancha==1">
				</text>
			</view>

		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
	import {userAPI} from '@/api/index.js'
	export default {
		data() {
			return {
				listData:[],
				currentPage: 1,
				pageSize: 20,
				total: 0,
				loadStatus: 'more',
			}
		},
		onShow() {
			this.currentPage = 1;
			this.listData = [];
			this.getData();
		},
		//上拉加载更多
		onReachBottom() {
			if (this.listData.length < this.currentPage * this.pageSize) {
				this.loadStatus = 'noMore';
				return;
			}
			this.currentPage++;
			this.getData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.currentPage = 1;
			this.listData = [];
			this.getData();
			
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			getData(){
				let param = {
					pageIndex:this.currentPage,
					pageSize:this.pageSize,
					userId:uni.getStorageSync('userId')
				}
				userAPI.getCareList(param).then(res=>{
					if(res.data.code=='0'){
						this.total=res.data.total
						let temp=res.data.careList?JSON.parse(res.data.careList):[]
						console.log(JSON.parse(res.data.careList))
						this.loadStatus = 'loading';
						this.listData=[...this.listData,...temp]
						if (this.listData.length < this.currentPage * this.pageSize) {
							this.loadStatus = 'noMore';
							return;
						}
						this.loadStatus = 'more';
					}
				})
			},
			
		}
	}
</script>

<style scoped>
.main{
	padding: 20rpx
}
.main-item{
	margin-top: 20rpx;
	padding:20rpx 10rpx ;
	/* border: 1px solid #efefef; */
	box-shadow: #efefef 0 0 10rpx;
	border-radius: 10rpx;
	/* background-color: rgba(239,239,239,0.2); */
	display: flex;
	align-items: center;
	background-color: rgba(53,144,223,0.1);
}
.main-text{
	margin-left: 10rpx;
	flex:1;
}
</style>

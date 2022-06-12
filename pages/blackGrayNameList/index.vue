<template>
	<view class="content">
		
		<view class="uni-padding-wrap uni-common-mt" style="background-color: rgba(239,239,239,0.5);">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#007aff"
				@clickItem="onClickItem"></uni-segmented-control>
		</view>
		<view style="padding:20rpx 20rpx 0;color: gray;font-size: 24rpx;">
			<text style="margin-right: 20rpx;" :style="{color:sortType=='startDate'?'#409eff':''}" @click="sort('startDate')">时间排序<uni-icons type="bottom" size="10" color="#409eff" v-if="sortType=='startDate'"></uni-icons></text>
			<text @click="sort('amount')" :style="{color:sortType=='amount'?'#409eff':''}">金额排序<uni-icons type="bottom" size="10" color="#409eff" v-if="sortType=='amount'"></uni-icons></text>
		<uni-icons type="help-filled" size="20" style="float: right;" @click="showNote"></uni-icons>
		</view>
		<view class="main">
			<view v-for="(item,index) in listData" :key="index" class="main-item">
				<img src="@/static/img/black.png" alt="" style="width: 50rpx;height: 50rpx;" v-if="current==0">
				<img src="@/static/img/gray.png" alt="" style="width: 50rpx;height: 50rpx;" v-if="current==1">
				<text class="main-text">{{item.companyName}}</text>
			</view>

		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
		<uni-popup ref="popup" type="message">
			<uni-popup-message type="warn" >
				{{content}}
			</uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				items: ['黑名单', '灰名单'],
				listData:[],
				currentPage: 1,
				pageSize: 15,
				total: 0,
				loadStatus: 'more',
				sortType:'startDate',
				content:'存在历史交易且对手违约导致形成一定金额以上历史风险资产的交易对手。'
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
				let temp=[]
				if(this.current==0){
					 temp=[
						{companyName:'安徽江淮汽车集团股份有限公司轿车分公司'},
						{companyName:'知豆电动汽车有限公司'},
						{companyName:'浙江鸿源汽车集团有限公司'},
						{companyName:'黑龙江中升生物科技有限公司'},
						{companyName:'浙江康恒医药有限公公司'},
						{companyName:'安徽江淮汽车集团股份有限公司轿车分公司'},
						{companyName:'知豆电动汽车有限公司'},
						{companyName:'浙江鸿源汽车集团有限公司'},
						{companyName:'黑龙江中升生物科技有限公司'},
						{companyName:'浙江康恒医药有限公公司'},
					]
					
				}else if(this.current==1){
					 temp=[
						{companyName:'马钢（上海）工贸有限公司'},
					]
				}
				this.loadStatus = 'loading';
				this.listData=[...this.listData,...temp]
				if (this.listData.length < this.currentPage * this.pageSize) {
					this.loadStatus = 'noMore';
					return;
				}
				this.loadStatus = 'more';
			},
			onClickItem(e) {
				console.log(e)
				this.current = e.currentIndex
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			sort(type){
				this.sortType=type
			},
			showNote(){
				if(this.current==0){
					this.content='存在历史交易且对手违约导致形成一定金额以上历史风险资产的交易对手。'
				}else if(this.current==1){
					this.content='存在历史交易且对手违约导致形成一定金额以下历史风险资产的交易对手。'
				}
				this.$refs.popup.open()
			}
		}
	}
</script>

<style scoped>
.main{
	padding: 20rpx
}
.main-item{
	margin-bottom: 20rpx;
	padding:20rpx 10rpx ;
	/* border: 1px solid #efefef; */
	box-shadow: #efefef 0 0 10rpx;
	border-radius: 10rpx;
	background-color: rgba(239,239,239,0.5);
	display: flex;
	align-items: center;
	/* background-color: rgba(53,144,223,0.1); */
}
.main-text{
	margin-left: 10rpx;
	flex:1;
}
</style>

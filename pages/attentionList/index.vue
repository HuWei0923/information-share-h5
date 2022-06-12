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
						{companyName:'上海百度人才咨询有限公司',tianyancha:1},
						{companyName:'中信证券股份有限公司',tianyancha:1,zhongchengxin:1},
						{companyName:'中信证券股份有限公司山西分公司',tianyancha:1},
						{companyName:'兰溪市诸葛旅游发展有限公司寿春堂',tianyancha:1},
						{companyName:'北京恒沙科技有限责任公司',zhongchengxin:1},
						{companyName:'北京百度网讯科技有限公司',tianyancha:1,zhongchengxin:1},
						{companyName:'台州伟隆新型金属材料有限公司',tianyancha:1},
						{companyName:'山东英特力集团有限公司',tianyancha:1},
						{companyName:'广东康美药业有限公司',tianyancha:1},
						{companyName:'广州市丝丝苗苗文化有限公司',tianyancha:1,zhongchengxin:1},
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
			}
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

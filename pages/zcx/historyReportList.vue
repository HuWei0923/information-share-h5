<template>
	<view class="content">
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">报告类型：{{ item.reportType }}</text>
				</view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
					<view>区域：{{ item.area||'/' }}</view>
					<view>行业：{{ item.industry||'/' }}</view>
					<view>企业类型：{{ item.industryType||'/' }}</view>
					<view>更新时间：{{ item.updateTime||'/' }}</view>
					<view class="btn-box"><uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons></view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="预览" type="primary" style="margin-right: 10rpx;"></uni-tag>
						<uni-tag text="下载" type="success" style="margin-right: 10rpx;"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more'
		};
	},
	onLoad() {},
	onShow() {
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
		// setTimeout(() => {
		// 	uni.stopPullDownRefresh();
		// }, 1000);
	},
	methods: {
		getData() {
			let temp = [
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
				{reportType: '财务排雷',area: null,industry: '综合',industryType: '中央国有企业',updateTime: '2022-05-14 11:35:11',showMenu: false},
			];
			this.loadStatus = 'loading';
			setTimeout(() => {
				this.listData = [...this.listData, ...temp];
			}, 1000);
		}
	}
};
</script>

<style scoped>
::v-deep .uni-group__title {
	background-color: #4f9be1;
}
::v-deep .uni-group__title-text {
	color: #fff;
}
.btn-box {
	position: absolute;
	bottom: 0;
	right: 0;
}
.card-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	height: 40px;
	background-color: #4f9be1;
	font-weight: normal;
	color: #fff;
}
</style>

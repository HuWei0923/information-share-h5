<template>
	<view class="content">
		<scroll-view style="height: 80vh;" scroll-x scroll-y>
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">报告类型：{{ item.reportType }}</view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;" @click="goToPage(item)">
					<view>区域：{{ item.area || '/' }}</view>
					<view>行业：{{ item.industry || '/' }}</view>
					<view>企业类型：{{ item.industryType || '/' }}</view>
					<view>更新时间：{{ item.updateTime || '/' }}</view>
					<view class="btn-box">
						<uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons>
					</view>
				</view>
				
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag  text="预览" type="primary" style="margin-right: 10rpx;" ></uni-tag>
						<uni-tag  text="下载" type="success" style="margin-right: 10rpx;"  ></uni-tag>
						<uni-tag  text="查看历史报告" type="warning"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
		</scroll-view>
		<view style="margin: 30rpx auto;text-align: center;"><button type="primary" size="mini" @click="$refs.popup.open('bottom')">跳转至</button></view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="header" style="text-align: center;margin: 20rpx auto;">跳转至</view>
			<view class="popup-content popup-height" style="display: flex;justify-content: space-between;">
				<view v-for="item in items" style="margin: 20rpx 20rpx;text-align: center;" @click="goToPage(item)">
					<image :src="item.img" style="width: 80rpx;height: 80rpx;"></image>
					<view>{{ item.name }}</view>
				</view>
			</view>
			<view class="padding flex flex-direction"><button class="cu-btn lg" @click="$refs.popup.close()">取 消</button></view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			items: [
				{ img: '/static/img/index/fxcs.png', code: 'fxcs', name: '风险初筛' },
				{ img: '/static/img/index/cwpl.png', code: 'cwpl', name: '财务排雷' },
				{ img: '/static/img/index/cyqypj.png', code: 'cyqyxypj', name: '产业企业评价' },
				{ img: '/static/img/index/qyxypj.png', code: 'qyxypj', name: '区域信用评价' },
				{ img: '/static/img/index/ctqypj.png', code: 'ctqyxypj', name: '城投企业评价' },
			],
			listData: [
				{
					reportType: '产业企业信用评价',
					area: null,
					industry: '综合',
					industryType: '民企上市公司',
					updateTime: '2022-05-14 09:22:12',
					showMenu:false
				},
				{
					reportType: '产业企业信用评价',
					area: null,
					industry: '综合',
					industryType: '民企上市公司',
					updateTime: '2022-05-14 09:22:12',
					showMenu:false
				},
				{
					reportType: '区域信用评价',
					area: null,
					industry: '综合',
					industryType: '民企上市公司',
					updateTime: '2022-05-14 09:22:12',
					showMenu:false
				},
				{
					reportType: '财务排雷',
					area: null,
					industry: '综合',
					industryType: '民企上市公司',
					updateTime: '2022-05-14 09:22:12',
					showMenu:false
				},
				{
					reportType: '产业企业信用评价',
					area: null,
					industry: '综合',
					industryType: '民企上市公司',
					updateTime: '2022-05-14 09:22:12',
					showMenu:false
				}
			],
			companyId: '',
			companyName: '',
			creditCode: '',
		};
	},
	onLoad(options) {
		console.log(options);
		this.companyId = options.companyId;
		this.companyName = options.companyName;
		this.creditCode = options.creditCode;
	},
	methods:{
		goToPage(item){
			uni.navigateTo({
				url:`/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}`
			})
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
.btn-box {
	position: absolute;
	bottom: 0;
	right: 0;
}
</style>

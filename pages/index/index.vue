<template>
	<view class="container">
		<div class="top">
			<image src="@/static/img/index/logo_trans.png" class="logo"></image>
			<view class="title">{{ title }}</view>
			<view class="sub-title">数字化技术下的资信共享新模式</view>
		</div>
		<div class="content-box">
			<uni-collapse ref="collapse" v-model="activeMenu">
				<uni-collapse-item :title="item.title" v-for="(item, index) in menuData" :key="index" :border="false">
					<view slot="title" class="menu-title">
						<text class="cuIcon-titles text-blue"></text>
						{{ item.title }}
					</view>
					<uni-row class="content">
						<uni-col :span="6" v-for="(i, id) in item.children" :key="id" class="content-item">
							<image :src="i.icon" style="width: 60rpx;height:60rpx;"></image>
							<text class="text">{{ i.title }}</text>
						</uni-col>
					</uni-row>
				</uni-collapse-item>
			</uni-collapse>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: process.uniEnv['APP_NAME'],
			activeMenu: ['0', '1', '2', '3'],
			menuData: [
				{
					title: '通用',
					children: [
						{
							title: '关注清单',
							icon: require('@/static/img/index/gzqd.png')
						},
						{
							title: '消息中心',
							icon: require('@/static/img/index/xxzx.png')
						},
						{
							title: '黑灰名单',
							icon: require('@/static/img/index/hhmd.png')
						}
					]
				},
				{
					title: '中诚信',
					children: [
						{
							title: '风险初筛',
							icon: require('@/static/img/index/fxcs.png')
						},
						{
							title: '财务排雷',
							icon: require('@/static/img/index/cwpl.png')
						},
						{
							title: '产业企业评价',
							icon: require('@/static/img/index/cyqypj.png')
						},
						{
							title: '区域信用评价',
							icon: require('@/static/img/index/qyxypj.png')
						},
						{
							title: '城投企业评价',
							icon: require('@/static/img/index/ctqypj.png')
						}
					]
				},
				{
					title: '中信保',
					children: [
						{
							title: '信保报告申请',
							icon: require('@/static/img/index/xbbgsq.png')
						},
						{
							title: '信保报告审核',
							icon: require('@/static/img/index/xbbgsh.png')
						},
						{
							title: '我的信保报告',
							icon: require('@/static/img/index/wdxbbg.png')
						},
						{
							title: '信保报告列表',
							icon: require('@/static/img/index/xbbglb.png')
						}
					]
				},
				{
					title: '天眼查',
					children: [
						{
							title: '检索入口',
							icon: require('@/static/img/index/jsrk.png')
						}
					]
				}
			]
		};
	},
	methods: {}
};
</script>

<style scoped>
.container {
	/* height: 100%; */
}
.top {
	height: 400rpx;
	background: url('@/static/img/index/index_bg.jpg');
	background-size: 100% 100%;
	text-align: center;
	position: relative;
}
.logo {
	width: 170rpx;
	height: 54rpx;
	position: absolute;
	top: 20rpx;
	right: 20rpx;
}
.title {
	font-size: 46rpx;
	font-weight: 700;
	color: #fff;
	padding: 120rpx 0 40rpx 0;
	letter-spacing: 8rpx;
}
.sub-title {
	font-size: 28rpx;
	color: #f5f9cc;
}
.content {
	padding: 0 20rpx;
}
.content-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}
.text {
	font-size: 26rpx;
	margin-top:10rpx;
	color: #333;
}
.menu-title{
	padding-left:20rpx;
	font-weight: bold;
	line-height: 80rpx;
}
</style>

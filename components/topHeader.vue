<template>
	<view class="top">
		<image src="@/static/img/index/logo_trans.png" class="logo"></image>
		<view class="title">{{ title }}</view>
		<view class="sub-title">数字化技术下的资信共享新模式</view>
	</view>
</template>

<script>
	export default {
		name:"topHeader",
		data() {
			return {
				title: process.uniEnv['APP_NAME'],
			};
		}
	}
</script>

<style scoped>
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
	letter-spacing: 7rpx;
}
</style>

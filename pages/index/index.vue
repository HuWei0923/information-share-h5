<template>
	<view class="container">
		<TopHeader></TopHeader>
		<div class="content-box">
			<uni-collapse ref="collapse" v-model="activeMenu">
				<uni-collapse-item :title="item.title" v-for="(item, index) in menuData" :key="index" :border="false">
					<view slot="title" class="menu-title">
						<text class="cuIcon-titles text-blue"></text>
						{{ item.title }}
					</view>
					<uni-row class="content">
						<uni-col :span="6" v-for="(i, id) in item.children" :key="id">
							<view @click="goToPage(i)" class="content-item">
								<image :src="i.icon" style="width: 60rpx;height:60rpx;"></image>
								<text class="text">{{ i.title }}</text>
							</view>
						</uni-col>
					</uni-row>
				</uni-collapse-item>
			</uni-collapse>
		</div>
	</view>
</template>

<script>
import TopHeader from '@/components/topHeader.vue';
export default {
	components: {
		TopHeader
	},
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
							icon: require('@/static/img/index/xbbgsq.png'),
							url: '/pages/apply/apply'
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
	onLoad() {
		console.log(33333);
	},
	methods: {
		goToPage(item) {
			if (!item.url) return;
			uni.navigateTo({
				url: item.url
			});
		}
		
		
	}
};
</script>

<style scoped>
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
	margin-top: 10rpx;
	color: #333;
}
.menu-title {
	padding-left: 20rpx;
	font-weight: bold;
	line-height: 80rpx;
}
</style>

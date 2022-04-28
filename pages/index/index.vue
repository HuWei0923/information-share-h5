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
							<view @click="goToPage(i)" class="content-item" v-if="i.flag">
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
import { userAPI } from 'api/index.js';
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
							icon: require('@/static/img/index/gzqd.png'),
							flag:true
						},
						{
							title: '消息中心',
							icon: require('@/static/img/index/xxzx.png'),
							flag:true
						},
						{
							title: '黑灰名单',
							icon: require('@/static/img/index/hhmd.png'),
							flag:true
						},
						{
							title: '用户中心',
							icon: require('@/static/img/index/hhmd.png'),
							flag:false
						}
					]
				},
				{
					title: '中诚信',
					children: [
						{
							title: '风险初筛',
							icon: require('@/static/img/index/fxcs.png'),
							flag:true
						},
						{
							title: '财务排雷',
							icon: require('@/static/img/index/cwpl.png'),
							flag:true
						},
						{
							title: '产业企业评价',
							icon: require('@/static/img/index/cyqypj.png'),
							flag:true
						},
						{
							title: '区域信用评价',
							icon: require('@/static/img/index/qyxypj.png'),
							flag:true
						},
						{
							title: '城投企业评价',
							icon: require('@/static/img/index/ctqypj.png'),
							flag:true
						}
					]
				},
				{
					title: '中信保',
					children: [
						{
							title: '信保报告申请',
							icon: require('@/static/img/index/xbbgsq.png'),
							url: '/pages/apply/apply',
							flag:false
						},
						{
							title: '信保报告审核',
							icon: require('@/static/img/index/xbbgsh.png'),
							flag:false
						},
						{
							title: '我的信保报告',
							icon: require('@/static/img/index/wdxbbg.png'),
							flag:false
						},
						{
							title: '信保报告列表',
							icon: require('@/static/img/index/xbbglb.png'),
							flag:false
						}
					]
				},
				{
					title: '天眼查',
					children: [
						{
							title: '检索入口',
							icon: require('@/static/img/index/jsrk.png'),
							flag:true
						}
					]
				}
			]
		};
	},
	
	async onLoad(option) {
		debugger;
		await this.verifyPermissions();
		
	        
		this.menuData=[
				{
					title: '通用',
					children: [
						{
							title: '关注清单',
							icon: require('@/static/img/index/gzqd.png'),
							flag:true
						},
						{
							title: '消息中心',
							icon: require('@/static/img/index/xxzx.png'),
							flag:true
						},
						{
							title: '黑灰名单',
							icon: require('@/static/img/index/hhmd.png'),
							flag:true
						},
						{
							title: '用户中心',
							icon: require('@/static/img/index/hhmd.png'),
							flag:uni.getStorageSync('userManage')||uni.getStorageSync('sub_manage')
						}
					]
				},
				{
					title: '中诚信',
					children: [
						{
							title: '风险初筛',
							icon: require('@/static/img/index/fxcs.png'),
							flag:true
						},
						{
							title: '财务排雷',
							icon: require('@/static/img/index/cwpl.png'),
							flag:true
						},
						{
							title: '产业企业评价',
							icon: require('@/static/img/index/cyqypj.png'),
							flag:true
						},
						{
							title: '区域信用评价',
							icon: require('@/static/img/index/qyxypj.png'),
							flag:true
						},
						{
							title: '城投企业评价',
							icon: require('@/static/img/index/ctqypj.png'),
							flag:true
						}
					]
				},
				{
					title: '中信保',
					children: [
						{
							title: '信保报告申请',
							icon: require('@/static/img/index/xbbgsq.png'),
							url: '/pages/apply/apply',
							flag:uni.getStorageSync('zxbReportApply')
						},
						{
							title: '信保报告审核',
							icon: require('@/static/img/index/xbbgsh.png'),
							flag:uni.getStorageSync('zxbreportAudit')
						},
						{
							title: '我的信保报告',
							icon: require('@/static/img/index/wdxbbg.png'),
							flag:uni.getStorageSync('zxbReportApply')
						},
						{
							title: '信保报告列表',
							icon: require('@/static/img/index/xbbglb.png'),
							flag:uni.getStorageSync('zxbReportlist')
						}
					]
				},
				{
					title: '天眼查',
					children: [
						{
							title: '检索入口',
							icon: require('@/static/img/index/jsrk.png'),
							flag:true
						}
					]
				}
			];
		
		
	},
	methods: {
		goToPage(item) {
			if (!item.url) return;
			uni.navigateTo({
				url: item.url
			});
		},
		async verifyPermissions() {
			await userAPI
				.verifyPermissions({
					userId: uni.getStorageSync('userId'),
					permissionPoint:"user.manage,user.sub_manage,blacklist.audit,blacklist.apply,zxbreport.audit,merchant.screening,news.all,zxbreport.apply,zxbreport.list,zxbMessage.list"
				})
				.then(res => {
					if(res.data.code==0){
						
					// 	this.blacklistAudit = res.data.verifyPermissionResult['blacklist.audit'];
					// 	this.blacklistApply = res.data.verifyPermissionResult['blacklist.apply']
					// 	this.userManage = res.data.verifyPermissionResult['user.manage']
					// 	this.sub_manage = res.data.verifyPermissionResult['user.sub_manage']
					// 	this.zxbreportAudit = res.data.verifyPermissionResult['zxbreport.audit'];
					// 	this.merchant = res.data.verifyPermissionResult['merchant.screening'];
					// 	this.newsAll = res.data.verifyPermissionResult['news.all'];
						
						uni.setStorageSync('blacklistAudit',res.data.verifyPermissionResult['blacklist.audit']);
						uni.setStorageSync('blacklistApply',res.data.verifyPermissionResult['blacklist.apply']);
						uni.setStorageSync('userManage',res.data.verifyPermissionResult['user.manage']);
						uni.setStorageSync('sub_manage',res.data.verifyPermissionResult['user.sub_manage']);
						uni.setStorageSync('zxbreportAudit',res.data.verifyPermissionResult['zxbreport.audit']);
						uni.setStorageSync('merchant',res.data.verifyPermissionResult['merchant.screening']);
						uni.setStorageSync('newsAll',res.data.verifyPermissionResult['news.all']);
						
						uni.setStorageSync('zxbReportApply',res.data.verifyPermissionResult['zxbreport.apply']);
						uni.setStorageSync('zxbReportlist',res.data.verifyPermissionResult['zxbreport.list'])
						uni.setStorageSync('zxbMessageList',res.data.verifyPermissionResult['zxbMessage.list'])
						
						if(res.data.verifyPermissionResult['user.manage']||res.data.verifyPermissionResult['user.sub_manage']){
						   uni.setStorageSync('userManage', 'true');
						}
						 console.log(res.data);
					}
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

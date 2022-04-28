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
							<view @click="goToPage(i)" class="content-item" v-if="permissionList.includes(i.flag) || permissionList.includes(i.flag2)">
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
import { whiteList, menuData } from '@/config/menuConfig';
export default {
	components: {
		TopHeader
	},
	data() {
		return {
			title: process.uniEnv['APP_NAME'],
			activeMenu: ['0', '1', '2', '3'],
			menuData: menuData,
			permissionList: []
		};
	},
	onLoad(option) {
		this.verifyPermissions();
	},
	methods: {
		goToPage(item) {
			if (!item.url) return;
			uni.navigateTo({
				url: item.url
			});
		},
		verifyPermissions() {
			userAPI
				.verifyPermissions({
					userId: uni.getStorageSync('userId'),
					permissionPoint:
						'user.manage,user.sub_manage,blacklist.audit,blacklist.apply,zxbreport.audit,merchant.screening,news.all,zxbreport.apply,zxbreport.list,zxbMessage.list'
				})
				.then(res => {
					if (res.data.code == 0) {
						let list = [];
						if (res.data.verifyPermissionResult) {
							for (let i in res.data.verifyPermissionResult) {
								if (res.data.verifyPermissionResult[i]) list.push(i);
							}
						}
						this.permissionList = [...whiteList, ...list];
						uni.setStorageSync('permissionList', this.permissionList);
						console.log(uni.getStorageSync('permissionList'));
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

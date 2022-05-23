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
					<text style="font-weight: bold;">
						{{ item.roleName }}
					</text>
				</view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
					<view>角色编号：{{ item.roleId }}</view>
					<view style="display: flex;">
						<view style="width: 120rpx;">权限：</view>
					<view style="display: flex;flex-wrap: wrap;">
						<uni-tag :text="item" inverted type="primary" class="uni-mr-2 uni-mb-2" v-for="(item,index) in item.permissions" :key="index"></uni-tag>
					</view>
					</view>
					<view class="btn-box"><uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons></view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="编辑" type="primary" style="margin-right: 10rpx;" @click="edit(item)"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
		<uni-fab ref="fab" :horizontal="horizontal" :vertical="vertical" :popMenu="false" @fabClick="fabClick" />
	</view>
</template>

<script>
	import { companyAPI, userAPI } from 'api/index.js';
	export default {
		data() {
			return {
				listData: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				loadStatus: 'more',
				vertical: 'bottom',
				horizontal: 'right'
			}
		},
		onLoad() {
			this.getData()
		},
		onShow() {
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
		},
		methods: {
			getData(){
				let temp =[
					{roleName:'子管理员',roleId:'9894423425523',permissions:['用户子管理权限','客商初筛权限','黑名单审批权限'],showMenu:false},
					{roleName:'黑名单审核专员',roleId:'9894423425123',permissions:['客商初筛权限','黑名单审批权限','黑名单申请权限'],showMenu:false},
					{roleName:'信保审核专员',roleId:'943253423425523',permissions:['信保报告申请权限','信保报告列表权限','客商初筛权限'],showMenu:false},
				]
				this.loadStatus = 'more';
				setTimeout(()=>{
					this.listData = [...this.listData, ...temp];
				},1000)
				if (this.listData.length < this.currentPage * this.pageSize) {
					this.loadStatus = 'noMore';
				}
			},
			getAllRole(){
				
			},
			fabClick() {
				
				uni.navigateTo({
					url: '/pages/roleManage/create'
				});
			},
			edit(item) {
				uni.navigateTo({
					url: `/pages/roleManage/create?roleId=${item.roleId}`
				});
			},
		}
	}
</script>

<style scoped>
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

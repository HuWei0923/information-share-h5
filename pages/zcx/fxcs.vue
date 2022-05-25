<template>
	<view class="content">
		<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
		<!-- <scroll-view v-if="active == 0" scroll-y scroll-x style="width: 100vw;height:60vh;position: relative;" class="uni-mt-10">
			<view class="html-text-box" v-html="html"></view>
		</scroll-view> -->
		<iframe v-if="active == 0" frameborder="no" border="0" :srcdoc="html" style="width: 100vw;height:60vh;position: relative;" class="uni-mt-10">
			<!-- <view class="html-text-box" v-html="html"></view> -->
		</iframe>
		<view v-else class="uni-mt-10 download-box">
			<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
			<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
		</view>
		<view class=" flex flex-direction" style="padding: 50rpx 50rpx 0;" v-if="active == 0">
			<button class="cu-btn line-blue " @click="goToPage({ code: 'historyReportList' })">查看历史报告</button>
		</view>
		<uni-row :gutter="10" style="padding: 50rpx;text-align: center;">
			<uni-col :span="6"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
			<uni-col :span="6"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
			<uni-col :span="6"><button class="button" size="mini" type="primary" @click="$refs.popup.open('bottom')">跳转至</button></uni-col>
			<uni-col :span="6"><button class="button" size="mini" type="primary" @click="goToFirstPage">首 页</button></uni-col>
		</uni-row>
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
import { zcxAPI, companyAPI } from 'api/index.js';
export default {
	data() {
		return {
			active: 0,
			stepList: [
				{
					title: '风险评价'
				},
				{
					title: '评价结果下载'
				}
			],
			html: '',
			items: [
				{ img: '/static/img/index/cwpl.png', code: 'cwpl', name: '财务排雷' },
				{ img: '/static/img/index/cyqypj.png', code: 'cyqyxypj', name: '产业企业评价' },
				{ img: '/static/img/index/qyxypj.png', code: 'qyxypj', name: '区域信用评价' },
				{ img: '/static/img/index/ctqypj.png', code: 'ctqyxypj', name: '城投企业评价' }
				// { img: '/static/img/index/xxzx.png', code: 'historyReportList', name: '历史报告' }
			]
		};
	},
	onLoad(options) {
		console.log(options);
		this.companyId = options.companyId;
		this.creditCode = options.creditCode;
		this.getRiskScreenHtml();
	},
	methods: {
		getRiskScreenHtml() {
			let param = {
				companyId: this.companyId,
				creditCode: this.creditCode,
				userId: uni.getStorageSync('userId')
			};
			zcxAPI.getRiskScreenHtml(param).then(res => {
				console.log(res);
				this.html = res.data;
			});
		},
		preview() {
			if (this.active !== 0) this.active--;
		},
		next() {
			if (this.active < this.stepList.length - 1) this.active++;
		},
		goToPage(item) {
			uni.navigateTo({
				url: `/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}&pageFrom=风险初筛`
			});
		},
		goToFirstPage() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		}
	}
};
</script>

<style scoped></style>

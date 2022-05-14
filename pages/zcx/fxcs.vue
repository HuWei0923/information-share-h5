<template>
	<view class="content">
		<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
		<scroll-view v-if="active == 0" scroll-y scroll-x style="width: 100vw;height:70vh;position: relative;" class="uni-mt-10">
			<text class="html-text-box" v-html="html"></text>
		</scroll-view>
		<view v-else class="uni-mt-10 download-box">
			<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
			<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
		</view>
		<uni-row :gutter="10" style="padding: 50rpx 150rpx;text-align: center;">
			<uni-col :span="12"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
			<uni-col :span="12"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
		</uni-row>
	</view>
</template>

<script>
import { zcxAPI } from 'api/index.js';
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
			html: ''
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
				userId: '1'
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
		}
	}
};
</script>

<style scoped>

</style>

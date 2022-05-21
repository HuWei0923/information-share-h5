<template>
	<view class="content">
		<view class="content">
			<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
			<view v-if="active == 0" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							所属行业
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<uni-data-picker
								ref="picker"
								placeholder="请选择"
								:localdata="dataTree"
								v-model="industry"
								:map="{ text: 'text', value: 'text' }"
								@change="onchange"
							></uni-data-picker>
							<view class="error-style" v-if="errMsg.industry != ''">{{ errMsg.industry }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							企业性质
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<picker :value="industryType" @change="changeIndustryType" :range="industryTypeOptions">
								<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="industryType" readonly style="float:right" />
							</picker>
							<view class="error-style" v-if="errMsg.industryType != ''">{{ errMsg.industryType }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							是否行业头部企业
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<picker :value="ifHeader" @change="changeIfHeader" :range="ifHeaderOptions">
								<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="ifHeader" readonly style="float:right" />
							</picker>
							<view class="error-style" v-if="errMsg.ifHeader != ''">{{ errMsg.ifHeader }}</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class=" flex flex-direction" style="padding: 50rpx 50rpx 0;" >
					<button class="cu-btn line-blue " @click="goToPage({ code: 'historyReport' })">查看历史报告</button>
				</view>
			</view>
			<view v-else-if="active == 1" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item title="所属行业" :rightText="allIndustry.join('/')"></uni-list-item>
					<uni-list-item title="财报信息" rightText="数据取自近两年财报"></uni-list-item>
				</uni-list>
			</view>
			<scroll-view v-else-if="active == 2" scroll-y scroll-x class="uni-mt-10 main-box"><text class="html-text-box" v-html="html"></text></scroll-view>
			<view v-else class="uni-mt-10 download-box">
				<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
				<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
			</view>
			<uni-row :gutter="10" style="padding: 50rpx;text-align: center;">
					<uni-col :span="6"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
					<uni-col :span="6"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
					<uni-col :span="6"><button class="button" size="mini" type="primary" @click="$refs.popup.open('bottom')">跳转至</button></uni-col>
					<uni-col :span="6"><button class="button" size="mini" type="primary" @click="goToFirstPage">首页</button></uni-col>
				</uni-row>
			</view>
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
import { zcxAPI } from 'api/index.js';
export default {
	data() {
		return {
			active: 0,
			stepList: [{ title: '主体信息' }, { title: '财务信息' }, { title: '风险评价' }, { title: '评价结果下载' }],
			html: '',
			companyId: '',
			companyName: '',
			creditCode: '',
			industry: '',
			ifHeader: '',
			allIndustry: [],
			industryType: '',
			dataTree: [],
			industryTypeOptions: ['中央国有企业', '国企非上市公司', '国企上市公司', '民企非上市公司', '民企上市公司'],
			ifHeaderOptions: ['是', '否'],
			errMsg: {
				industry: '',
				industryType: '',
				ifHeader: ''
			},
			items: [
				{ img: '/static/img/index/fxcs.png', code: 'fxcs', name: '风险初筛' },
				{ img: '/static/img/index/cwpl.png', code: 'cwpl', name: '财务排雷' },
				{ img: '/static/img/index/qyxypj.png', code: 'qyxypj', name: '区域信用评价' },
				{ img: '/static/img/index/ctqypj.png', code: 'ctqyxypj', name: '城投企业评价' },
				// { img: '/static/img/index/xxzx.png', code: 'historyReport', name: '历史报告' }
			]
		};
	},
	onLoad(options) {
		console.log(options);
		this.companyId = options.companyId;
		this.companyName = options.companyName;
		this.creditCode = options.creditCode;
		this.getIndustry();
	},
	methods: {
		getIndustry() {
			zcxAPI.getIndustry({}).then(res => {
				let obj = res.data.areaList;
				let list = [];
				for (let i in obj) {
					let tempObj = {};
					tempObj.text = ' ' + i;
					let children = obj[i].map(item => {
						return { text: item };
					});
					tempObj.children = children;
					list.push(tempObj);
				}
				this.dataTree = list;
			});
		},
		onchange(e) {
			console.log(e);
			let list = [];
			list.push();
			e.detail.value.map(item => {
				list.push(item.text);
			});
			this.allIndustry = list;
			this.errMsg.industry = '';
		},
		changeIndustryType(e) {
			this.industryType = this.industryTypeOptions[e.detail.value];
			this.errMsg.industryType = '';
		},
		changeIfHeader(e) {
			this.ifHeader = this.ifHeaderOptions[e.detail.value];
			this.errMsg.ifHeader = '';
		},
		check() {
			let flag = true;
			if (this.industry == '') {
				this.errMsg.industry = '请选择所属行业';
				flag = false;
			}
			if (this.industryType == '') {
				this.errMsg.industryType = '请选择企业性质';
				flag = false;
			}
			if (this.ifHeader == '') {
				this.errMsg.ifHeader = '请选择是否为头部企业';
				flag = false;
			}
			return flag;
		},
		preview() {
			if (this.active !== 0) this.active--;
		},
		next() {
			let flag = this.check();
			if (flag) {
				if (this.active < this.stepList.length - 1) this.active++;
			}
		},
		goToPage(item){
			uni.navigateTo({
				url:`/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}`
			})
		},
		goToFirstPage() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
	}
};
</script>

<style scoped>
.main-box {
	width: 100vw;
	height: 70vh;
	position: relative;
}
input {
	text-align: right;
}
::v-deep .placeholder {
	color: rgb(181, 181, 181);
}
::v-deep .input-value {
	border: none;
	line-height: 50rpx;
	padding: 0;
}
::v-deep .selected-list {
	flex-wrap: wrap;
}
::v-deep .uni-data-tree {
	max-width: 65vw;
}
::v-deep .arrow-area {
	display: none;
}
::v-deep .uni-list-item__extra {
	text-align: right;
	flex: 1;
}
::v-deep .form-title {
	min-width: 120rpx;
}
</style>

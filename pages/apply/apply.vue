<template>
	<view class="container">
		<TopHeader></TopHeader>
		<view class="title">信保报告申请</view>
		<view class="content">
			<uni-list>
				<uni-list-item title="是否有信保代码">
					<view slot="footer"><switch checked @change="switchIfCreditCode" /></view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						买方代码
					</view>
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.clientNo"  />
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业中国信保企业代码">
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.reportbuyerNo" @input="inputreportbuyerNo" />
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业国别">
					<view slot="footer">
						<text class="cuIcon-right right-icon"></text>
						<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpCountryName" readonly style="float:right" @click="showNationList" />
						<!-- <picker :value="form.type" @change="changeNation" :range="nationOptions" range-key="name">
							<text class="cuIcon-right right-icon"></text>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.nation" readonly style="float:right" />
						</picker> -->
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						待调查企业中文名称
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpChnName" @input="inputreportCorpChnName" />
						<view class="error-style" v-if="errMsg.reportCorpChnName != ''">{{ errMsg.reportCorpChnName }}</view>
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业英文名称">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpEngName" @input="inputreportCorpEngName" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业地址">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpaddress" @input="inputreportCorpaddress" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业统一社会信用代码">
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.creditno" @input="inputcreditno" />
					</view>
				</uni-list-item>
				<uni-list-item title="是否导读">
					<view slot="footer"><switch checked @change="switchIfRead" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业联系电话">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.phone" @input="inputPhone" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业邮箱">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.email" @input="inputEmail" /></view>
				</uni-list-item>
				<uni-list-item title="紧急度">
					<view slot="footer">
						<picker :value="form.speed" @change="changeSpeed" :range="emergencyOptions" range-key="name">
							<text class="cuIcon-right right-icon"></text>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.speed" readonly style="float:right" />
						</picker>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-row class="content" :gutter="20" style="padding: 50rpx;">
			<uni-col :span="12"><button class="cu-btn lg block text-white btn-style">点击申请</button></uni-col>
			<uni-col :span="12"><button class="cu-btn lg block text-white btn-style">重置</button></uni-col>
		</uni-row>
	</view>
</template>

<script>
import TopHeader from '@/components/topHeader.vue';
import { compayAPI } from 'api/index.js';

export default {
	components: {
		TopHeader
	},
	data() {
		return {
			form: {
				userId: uni.getStorageSync('userId'),
				buyerCode: '',
				clientNo: '',
				reportbuyerNo: '',
				reportCorpCountryCode:'',
				reportCorpCountryName:'',
				reportCorpChnName: '',
				reportCorpEngName: '',
				reportCorpaddress: '',
				creditno: '',
				istranslation:'',
				phone: '',
				email: '',
				speed: '普通'
			},
			errMsg: {
				buyerCode: '',
				nationNameC: ''
			},
			emergencyOptions: ['普通','加急','特急']
		};
	},
	onLoad(options) {
		uni.removeStorageSync('reportCorpCountryName');
		uni.removeStorageSync('reportCorpCountryCode');
		this.getCodeInfo();
	},
	onShow(){
		if(uni.getStorageSync('reportCorpCountryName')) this.form.reportCorpCountryName=uni.getStorageSync('reportCorpCountryName')
		if(uni.getStorageSync('reportCorpCountryCode')) this.form.reportCorpCountryCode=uni.getStorageSync('reportCorpCountryCode')
	
	},
	methods: {
		showNationList() {
			uni.navigateTo({url:`/pages/nationList/nationList?nationCode=${this.form.reportCorpCountryCode}&nationName=${this.form.reportCorpCountryName}`})
		},
		switchIfCreditCode(event) {
			console.log(event);
			if(event.detail){
				
			}
		},
		
		
		inputreportbuyerNo(event) {
			this.form.reportbuyerNo = event.detail.value;
			
		},
		
		inputreportCorpChnName(event){
			this.form.reportCorpChnName = event.detail.value;
		},
		inputreportCorpEngName(event){
			this.form.reportCorpEngName = event.detail.value;
		},
		inputreportCorpaddress(event){
			this.form.treportCorpaddress = event.detail.value;
		},
		inputcreditno(event){
			this.form.creditno = event.detail.value;
		},
		switchIfRead(event){
			console.log(event);
			if(event.detail){
				form.istranslation='1';
			}else{
				form.istranslation='0';
			}
		},
		changeSpeed(event) {
			debugger;
			this.form.speed = this.emergencyOptions[event.detail.value];
		},
		getCodeInfo(){
			compayAPI.getCodeInfoByUserId({
					userId:  uni.getStorageSync('userId')
			}).then(res => {
				if (res.data.code == '0') {
					if (res.data.codeInfo) {
						this.form.clientNo=res.data.codeInfo;
					}
				}
			})
		
		}
	}
};
</script>

<style scoped>
.container {
	height: 100vh;
	padding-bottom: 20rpx;
}
input {
	text-align: right;
}
.title {
	font-size: 32rpx;
	position: absolute;
	top: 340rpx;
	left: 50%;
	transform: translateX(-50%);
	font-weight: 500;
	color: #303133;
}

.right-icon {
	top: -4rpx;
}
.content {
	padding: 40rpx 14rpx;
}
.btn-style {
	background: #318fe7;
	font-size: 28rpx;
}
.popup-content {
	height: 40vh;
	overflow: auto;
}
::v-deep uni-switch .uni-switch-input.uni-switch-input-checked {
	background-color: #62bc63 !important;
}
::v-deep uni-switch::after,
uni-switch::before {
	color: transparent !important;
}
::v-deep .uni-list-item__container {
	padding: 10px;
}
</style>

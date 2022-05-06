<template>
	<view class="container">
		<!-- <TopHeader></TopHeader> -->
		<!-- <view class="title">信保报告申请</view> -->
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
						<input disabled="true" placeholder-style="color:#B5B5B5;" name="input" :value="form.clientNo"  />
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业中国信保企业代码">
					<view slot="footer">
						<input placeholder="请填写" v-if="form.buyerCode" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.reportbuyerNo" @input="inputreportbuyerNo" />
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业国别">
					<view slot="footer">
						<text class="cuIcon-right right-icon"></text>
						
						<input placeholder="请选择" v-if="!form.buyerCode" disabled="true" placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpCountryName" readonly style="float:right" @click="showNationList" />
						<!-- <picker :value="form.type" @change="changeNation" :range="nationOptions" range-key="name">
							<text class="cuIcon-right right-icon"></text>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.nation" readonly style="float:right" />
						</picker> -->
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						待调查企业中文名称
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
					<view slot="footer"><input v-if="!form.buyerCode" placeholder="请填写"  placeholder-style="color:#B5B5B5;" name="input" :value="form.reportCorpaddress" @input="inputreportCorpaddress" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业统一社会信用代码">
					<view slot="footer">
						<input placeholder="请填写" v-if="!form.buyerCode" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.creditno" @input="inputcreditno" />
					</view>
				</uni-list-item>
				<uni-list-item title="是否导读">
					<view slot="footer"><switch  @change="switchIfRead" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业联系电话">
					<view slot="footer"><input placeholder="请填写" v-if="!form.buyerCode" placeholder-style="color:#B5B5B5;" name="input" :value="form.phone" @input="inputPhone" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业邮箱">
					<view slot="footer"><input placeholder="请填写" v-if="!form.buyerCode" placeholder-style="color:#B5B5B5;" name="input" :value="form.email" @input="inputEmail" /></view>
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
			<uni-col :span="12"><button class="cu-btn lg block text-white btn-style" @click="applyxbbg" >点击申请</button></uni-col>
			<uni-col :span="12"><button class="cu-btn lg block text-white btn-style"  @click="resetinput" >重置</button></uni-col>
		</uni-row>
	</view>
</template>

<script>
// import TopHeader from '@/components/topHeader.vue';
import { companyAPI,userAPI } from 'api/index.js';

export default {
	components: {
		// TopHeader
	},
	data() {
		return {
			form: {
				userId: uni.getStorageSync('userId'),
				buyerCode: true,
				clientNo: '',
				reportbuyerNo: '',
				reportCorpCountryCode:'',
				reportCorpCountryName:'',
				reportCorpChnName: '',
				reportCorpEngName: '',
				reportCorpaddress: '',
				creditno: '',
				istranslation:'0',
				phone: '',
				email: '',
				speed: '普通'
			},
			errMsg: {
				buyerCode: '',
				nationNameC: ''
			},
			emergencyOptions: ['普通','加急','特急'],
			buyerCodeflag:false,
			isZxbreportAudit:false,
			isClientNo:false,
		};
	},
	onLoad(options) {
		uni.removeStorageSync('reportCorpCountryName');
		uni.removeStorageSync('reportCorpCountryCode');
		this.getCodeInfo();
		this.getReviewer();
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
				this.form.buyerCode=event.detail.value;
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
			this.form.reportCorpaddress = event.detail.value;
		},
		inputcreditno(event){
			this.form.creditno = event.detail.value;
		},
		switchIfRead(event){
			console.log(event);
			if(event.detail.value){
				this.form.istranslation='1';
			}else{
				this.form.istranslation='0';
			}
		},
		changeSpeed(event) {
			debugger;
			this.form.speed = this.emergencyOptions[event.detail.value];
		},
		getCodeInfo(){
			companyAPI.getCodeInfoByUserId({
					userId:  uni.getStorageSync('userId')
			}).then(res => {
				if (res.data.code == '0') {
					if (res.data.codeInfo) {
						this.form.clientNo=res.data.codeInfo.clientNo;
						if(res.data.codeInfo.clientNo){
							this.isClientNo = true;
						}
					}
				}
			})
		
		},
		resetinput(){
			this.form.reportbuyerNo='';
			this.form.reportCorpCountryCode='';
			uni.removeStorageSync('reportCorpCountryName');
			uni.removeStorageSync('reportCorpCountryCode');
			this.form.reportCorpCountryCode='';
			this.form.reportCorpCountryName='';
			this.form.reportCorpChnName='';
			this.form.reportCorpEngName='';
			this.form.reportCorpaddress='';
			this.form.creditno='';
			this.form.phone='';
			this.form.email='';
			
		},
		getReviewer(){
			userAPI
				.getReviewer({
					username: uni.getStorageSync('userCode'),
				})
				.then(res => {
					if (res.data.code == '0') {
						this.isZxbreportAudit = res.data.isReviewer;
						console.log(res.data.isReviewer)
					}
				});
		},
		applyxbbg(){
			var speed1 = '';
			if(this.form.speed==='普通'){
				speed1='1';
			}else if(this.form.speed==='加急'){
				speed1='2';
			}else if(this.form.speed==='特急'){
				speed1='3';
			}
			if((!this.isClientNo && !this.isZxbreportAudit) || !this.isClientNo){
				uni.showToast({
					icon:'none',
					title:'您所在的二级公司没有开通信保通业务，如需使用该功能请咨询公司管理员。',
				})
				return;
			}else if(!this.isZxbreportAudit){
				uni.showToast({
					icon:'none',
					title:'您所在的二级公司没有设置信保审核专员，如需使用该功能请咨询公司管理员。',
				})
                return;
			}
			if(!this.form.buyerCode){
				if (this.form.reportCorpCountryCode === '') {
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业国别',
					})
					return;
				} else if (this.form.reportCorpChnName === '' && this.form.reportCorpEngName === '') {
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业中文名称或英文名称',
					})
					return;
				} else if (this.form.reportCorpaddress === '') {
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业地址',
					})
					return;
				} else if (this.form.creditno === '' && this.form.reportCorpEngName === '') {
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业统一社会信用代码',
					})
					return;
				}else if (this.form.istranslation === '') {
					uni.showToast({
						icon:'none',
						title:'请输入是否导读',
					})
					return;
				}
			}else{
				if (!this.form.reportbuyerNo || this.form.reportbuyerNo == '') {
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业中国信保企业代码',
					})
					return;
				} else if (this.form.reportCorpChnName === '' && this.form.reportCorpEngName === '') {
					
					uni.showToast({
						icon:'none',
						title:'请输入待调查企业中文名称或英文名称',
					})
					return;
				}
			}
			if(!this.form.buyerCode){
				var noCreditCode={
					clientNo: this.form.clientNo,
					userId: this.form.userId,
					reportbuyerNo: this.form.reportbuyerNo,
					reportCorpCountryCode: this.form.reportCorpCountryCode,
					reportCorpChnName: this.form.reportCorpChnName,
					reportCorpEngName: this.form.reportCorpEngName,
					reportCorpaddress: this.form.reportCorpaddress,
					creditno: this.form.creditno,
					istranslation: this.form.istranslation,
					speed:speed1
				}
				
				
				companyAPI.zhongxinbaoApply(noCreditCode)
					.then(res => {
						console.log(!this.isClientNo)
						console.log(!this.isZxbreportAudit)
						if (res.statusCode == 200) {
							
							
							uni.showModal({
								title: '提示',
								content: res.data.returnMsg,
								showCancel:false,
								success:()=>{
									this.timer=setTimeout(()=>{
										uni.switchTab({
											url: '/pages/index/index'
										})
									},1000)
									
								}
							});
							
						}
					});
				
				return;
			}else{
				

				var haveCreditCode={
					clientNo: this.form.clientNo,
					userId: this.form.userId,
					reportbuyerNo: this.form.reportbuyerNo,
					reportCorpCountryCode: this.form.reportCorpCountryCode,
					reportCorpChnName: this.form.reportCorpChnName,
					reportCorpEngName: this.form.reportCorpEngName,
					reportCorpaddress: this.form.userId,
					creditno: this.form.creditno,
					istranslation: this.form.istranslation,
					speed: speed1,
					forcedApply: false
				}
				companyAPI.zhongxinbaoApply(haveCreditCode)
					.then(res => {
						
						console.log(!this.isClientNo)
						console.log(!this.isZxbreportAudit)
						console.log("============================")
						console.log(res.data.isExist)
						console.log("============================")
						if (res.statusCode == 200) {
							if(res.data.isExist == true){
								console.log("============================")
								console.log(res.data.isExist)
								console.log("============================")
								
								uni.showModal({
									title: '提示',
									cancelText:'放弃',
									confirmText:'是',
									content: res.data.confirmMessage,
									success: function (res) {
										if (res.confirm) {
											haveCreditCode.forcedApply = true;
											companyAPI.zhongxinbaoApply(haveCreditCode)
												.then(res => {
													if (res.statusCode == 200) {
														uni.showModal({
															title: '提示',
															content: res.data.returnMsg,
															showCancel:false,
															success:()=>{
																this.timer=setTimeout(()=>{
																	uni.switchTab({
																		url: '/pages/index/index'
																	})
																},1000)
																
															}
														});
													}
											
												});
											console.log('用户点击确定');
											
											
											
										} else if (res.cancel) {
											if(res.data.isPreview){
												console.log(res.data.pdfName);
												
											}
											console.log('放弃');
										}
									}
								});
							}else{
								
								uni.showModal({
									title: '提示',
									content: res.data.returnMsg,
									showCancel:false,
									success:()=>{
										this.timer=setTimeout(()=>{
											uni.switchTab({
												url: '/pages/index/index'
											})
										},1000)
										
									}
								});
							}
						}
					});

			}
			
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
	/* position: absolute;
	top: 340rpx;
	left: 50%;
	transform: translateX(-50%); */
	font-weight: 700;
	color: #303133;
	text-align: center;
	line-height: 100rpx;
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

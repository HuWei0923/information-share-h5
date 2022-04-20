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
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.buyerCode" @input="inputBuyerCode" />
						<view class="error-style" v-if="errMsg.buyerCode != ''">{{ errMsg.buyerCode }}</view>
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业中国信保企业代码">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.creditCode" @input="inputCreditCode" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业国别">
					<view slot="footer">
						<picker :value="form.type" @change="changeNation" :range="nationOptions" range-key="name">
							<text class="cuIcon-right right-icon"></text>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.nation" readonly style="float:right" />
						</picker>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						待调查企业中文名称
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.nationNameC" @input="inputNationNameC" />
						<view class="error-style" v-if="errMsg.nationNameC != ''">{{ errMsg.nationNameC }}</view>
					</view>
				</uni-list-item>
				<uni-list-item title="待调查企业英文名称">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.nationNameE" @input="inputNationNameE" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业地址">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" :value="form.address" @input="inputAddress" /></view>
				</uni-list-item>
				<uni-list-item title="待调查企业统一社会信用代码">
					<view slot="footer"><input placeholder="请填写" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.credit" @input="inputCredit" /></view>
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
						<picker :value="form.emergency" @change="changeEmergency" :range="emergencyOptions" range-key="name">
							<text class="cuIcon-right right-icon"></text>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.emergency" readonly style="float:right" />
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
export default {
	components: {
		TopHeader
	},
	data() {
		return {
			form: {
				buyerCode: '',
				creditCode: '',
				nation: '',
				nationNameC: '',
				nationNameE: '',
				address: '',
				credit: '',
				phone: '',
				email: '',
				emergency: ''
			},
			errMsg: {
				buyerCode: '',
				nationNameC: ''
			},
			nationOptions: [],
			emergencyOptions: []
		};
	},
	onLoad(){
	},
	methods: {
		switchIfCreditCode(event) {
			console.log(event);
		},
		inputBuyerCode(event) {
			this.form.buyerCode = event.detail.value;
			this.errMsg.buyerCode = '';
		},
		inputCreditCode(event) {
			this.form.creditCode = event.detail.value;
		},
		changeNation(event) {
			this.form.nation = this.nationOptions[event.detail.value].value;
		},
		inputNationNameC(event) {
			this.form.nationNameC = event.detail.value;
			this.errMsg.nationNameC = '';
		},
		inputNationNameE(event) {
			this.form.nationNameE = event.detail.value;
		},
		inputAddress(event) {
			this.form.address = event.detail.value;
		},
		inputCredit(event) {
			this.form.credit = event.detail.value;
		},
		switchIfRead(event) {},
		inputPhone(event) {
			this.form.phone = event.detail.value;
		},
		inputEmail(event) {
			this.form.email = event.detail.value;
		},
		changeEmergency(event) {
			this.form.emergency = this.emergencyOptions[event.detail.value].value;
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

<template>
	<view class="container">
		<TopHeader></TopHeader>
		<uni-card title="账号设置" is-shadow is-full>
			<uni-list>
				<uni-list-item>
					<view slot="header" class="form-title">
						<text class="required-s">*</text>
						姓名
					</view>
					<view slot="footer">
						<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.name" @input="inputName" />
						<view class="error-style" v-if="errMsg.name != ''">{{ errMsg.name }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						<text class="required-s">*</text>
						密码
					</view>
					<view slot="footer">
						<input placeholder="请输入" placeholder-style="color:#B5B5B5;" type="password" name="input" :value="form.password" @input="inputPassword" />
						<view class="error-style" v-if="errMsg.password != ''">{{ errMsg.password }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						<text class="required-s">*</text>
						手机
					</view>
					<view slot="footer">
						<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.mobile" @input="inputPhone" />
						<view class="error-style" v-if="errMsg.mobile != ''">{{ errMsg.mobile }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						<text class="required-s">*</text>
						邮箱
					</view>
					<view slot="footer">
						<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.email" @input="inputEmail" />
						<view class="error-style" v-if="errMsg.email != ''">{{ errMsg.email }}</view>
					</view>
				</uni-list-item>
			</uni-list>
		</uni-card>
		<view class="flex flex-direction" style="padding: 50rpx 150rpx">
			<button class="cu-btn round text-white" @click="login" style="background-image: linear-gradient(to right,#2d56f6,#5ba1ff);">保 存</button>
		</view>
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
			form: {
				name: '',
				password: '',
				email: '',
				mobile: ''
			},
			errMsg: {
				name: '',
				password: '',
				email: '',
				mobile: ''
			}
		};
	},
	onLoad() {
		userAPI
			.getUserInfo({
				userId: uni.getStorageSync('userId')
			})
			.then(res => {
				this.form = res.data.user;
			});
	},
	methods: {
		inputUserName(event) {
			this.form.username = event.detail.value;
			this.errMsg.username = '';
		},
		inputName(event) {
			this.form.name = event.detail.value;
			this.errMsg.name = '';
		},
		inputPassword(event) {
			this.form.password = event.detail.value;
			this.errMsg.password = '';
		},
		inputPhone(event) {
			this.form.mobile = event.detail.value;
			this.errMsg.mobile = '';
		},
		inputEmail(event) {
			this.form.email = event.detail.value;
			this.errMsg.email = '';
		}
	}
};
</script>

<style scoped>
input {
	text-align: right;
}
::v-deep .uni-card .uni-card__content {
	padding: 0 !important;
}
</style>

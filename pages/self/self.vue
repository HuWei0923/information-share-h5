<template>
	<view class="container">
		<TopHeader></TopHeader>
		<uni-section title="账号设置" type="line">
			<uni-card is-shadow>
				<uni-list>
					<uni-list-item>
						<view slot="header" class="form-title">用户名</view>
						<view slot="footer"><input placeholder="请输入" disabled placeholder-style="color:#B5B5B5;" name="input" :value="form.username" /></view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">姓名</view>
						<view slot="footer">
							<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.name" @input="inputName" />
							<view class="error-style" v-if="errMsg.name != ''">{{ errMsg.name }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							密码
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<input placeholder="请输入" placeholder-style="color:#B5B5B5;" type="password" name="input" :value="form.password" @input="inputPassword" />
							<view class="error-style" v-if="errMsg.password != ''">{{ errMsg.password }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">手机</view>
						<view slot="footer">
							<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.mobile" @input="inputPhone" />
							<view class="error-style" v-if="errMsg.mobile != ''">{{ errMsg.mobile }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">邮箱</view>
						<view slot="footer">
							<input placeholder="请输入" placeholder-style="color:#B5B5B5;" name="input" :value="form.email" @input="inputEmail" />
							<view class="error-style" v-if="errMsg.email != ''">{{ errMsg.email }}</view>
						</view>
					</uni-list-item>
				</uni-list>
			</uni-card>
		</uni-section>

		<view style="padding: 50rpx 150rpx;text-align: center;display: flex;justify-content: space-between;">
			<button class="cu-btn round text-white" @click="saveUserInfo" style="background-image: linear-gradient(to right,#2d56f6,#5ba1ff);margin-right: 20rpx;width:100%" >保 存</button>
			<button class="cu-btn round text-white"  @click="logOut" style="background-image: linear-gradient(to right,#EE4F4F,#DE6F6F);width:100%">退出登录</button>
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
				username: uni.getStorageSync('userCode'),
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
			},
			flag: true
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
		},
		checkForm() {
			let flag = true;
			if (this.form.password == '') {
				this.errMsg.password = '请填写密码';
				flag = false;
			} else {
				let modes = 0;
				let value = this.form.password;
				if (value.length < 8) {
					this.errMsg.password = '密码长度不小于8位';
					flag = false;
					return;
				}
				if (/\d/.test(value)) modes++; //数字
				if (/[a-z]/.test(value) || /[A-Z]/.test(value)) modes++; //字母
				// if (/[A-Z]/.test(value)) modes++; //大写
				if (/\W/.test(value)) modes++; //特殊字符
				if (value && modes < 2) {
					this.errMsg.password = '需由数字、字母、字符中的两种组成。';
					flag = false;
				}
			}
			if (this.form.phone !== '') {
				var value = this.form.mobile;
				let TEL_REGEXP = /^[1][3,4,5,7,8,9][0-9]{9}$/;
				if (!TEL_REGEXP.test(value)) {
					this.errMsg.mobile = '请输入正确的手机号!';
					flag = false;
				}
			}
			return flag;
		},
		saveUserInfo() {
			let flag = this.checkForm();
			if (flag) {
				userAPI
					.updateUser({
						userId: uni.getStorageSync('userId'),
						username: uni.getStorageSync('userCode'),
						name: this.form.name,
						password: this.form.password,
						email: this.form.email,
						mobile: this.form.mobile
					})
					.then(res => {
						if (res.data.code == 0) {
							uni.showToast({
								icon: 'none',
								title: '保存成功。'
							});
						}
					});
			}
		},
		logOut(){
			
			uni.removeStorageSync('token');
			uni.removeStorageSync('username');
			uni.removeStorageSync('userId');
			uni.removeStorageSync('userCode');
			uni.showToast({
				icon: 'none',
				title: '退出成功。',
				success:()=>{
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/login/index'
						})
					},2000)
				}
			})
			
		},
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
::v-deep .uni-card--border{
		border: none!important;
	}
</style>

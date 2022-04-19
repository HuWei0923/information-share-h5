<template>
	<view class="container">
		<div class="top">
			<image src="@/static/img/index/logo_trans.png" class="logo"></image>
			<view class="title">{{ title }}</view>
			<view class="sub-title">数字化技术下的资信共享新模式</view>
		</div>
		<!-- <uni-section title="账号设置" type="line"> -->
			<uni-card title="账号设置" is-shadow is-full>
				<uni-list>
					<uni-list-item>
						<view slot="header" class="form-title">
							<text class="required-s">*</text>
							用户名
						</view>
						<view slot="footer">
							<input placeholder="请输入" name="input" :value="form.username" @input="inputUserName" />
							<view class="error-style" v-if="errMsg.username != ''">{{ errMsg.username }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							<text class="required-s">*</text>
							姓名
						</view>
						<view slot="footer">
							<input placeholder="请输入" name="input" :value="form.name" @input="inputName" />
							<view class="error-style" v-if="errMsg.name != ''">{{ errMsg.name }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							<text class="required-s">*</text>
							密码
						</view>
						<view slot="footer">
							<input placeholder="请输入" type="password" name="input" :value="form.password" @input="inputPassword" />
							<view class="error-style" v-if="errMsg.password != ''">{{ errMsg.password }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							<text class="required-s">*</text>
							手机
						</view>
						<view slot="footer">
							<input placeholder="请输入" name="input" :value="form.phone" @input="inputPhone" />
							<view class="error-style" v-if="errMsg.phone != ''">{{ errMsg.phone }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							<text class="required-s">*</text>
							邮箱
						</view>
						<view slot="footer">
							<input placeholder="请输入" name="input" :value="form.email" @input="inputEmail" />
							<view class="error-style" v-if="errMsg.email != ''">{{ errMsg.email }}</view>
						</view>
					</uni-list-item>
				</uni-list>
			</uni-card>
		<!-- </uni-section> -->
		<view class="flex flex-direction" style="padding: 50rpx 150rpx">
			<button class="cu-btn round text-white" @click="login" style="background-image: linear-gradient(to right,#2d56f6,#5ba1ff);">保 存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: process.uniEnv['APP_NAME'],
			form: {
				username: 'anglela baby',
				name: '张三',
				password: '123456',
				email: '453543@163.com',
				phone: '13524321345'
			},
			errMsg: {
				username: '',
				name: '',
				password: '',
				email: '',
				phone: ''
			}
		};
	},
	methods: {
		inputUserName() {},
		inputName() {},
		inputPassword() {}
	}
};
</script>

<style scoped>
.top {
	height: 400rpx;
	background: url('@/static/img/index/index_bg.jpg');
	background-size: 100% 100%;
	text-align: center;
	position: relative;
}
.logo {
	width: 170rpx;
	height: 54rpx;
	position: absolute;
	top: 20rpx;
	right: 20rpx;
}
.title {
	font-size: 46rpx;
	font-weight: 700;
	color: #fff;
	padding: 120rpx 0 40rpx 0;
	letter-spacing: 8rpx;
}
.sub-title {
	font-size: 28rpx;
	color: #f5f9cc;
}
input {
	text-align: right;
}
</style>

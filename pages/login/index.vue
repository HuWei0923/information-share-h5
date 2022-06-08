<template>
	<view class="container">
		<view class="title">{{title}}</view>
		<view class="sub-title">数字化技术下的资信共享新模式</view>
		<view class="login-box">
			<view class="cu-form-group">
				<text class="cuIcon-my input-icon"></text>
				<input placeholder-style="color:#DEDEDE;" placeholder="请输入用户名" name="input" :value="user.username"  @input="(e)=>{user.username=e.detail.value}"></input>
			</view>
			<view class="cu-form-group" >
				<text class="cuIcon-lock input-icon"></text>
				<input :type="showPwd?'text':'password'" placeholder-style="color:#DEDEDE" placeholder="请输入密码" name="input" :value="user.password" @input="(e)=>{user.password=e.detail.value}"></input>
				<text class="input-icon" :class="{'cuIcon-attention':showPwd,'cuIcon-attentionforbid':!showPwd}"  @click="showPwd=!showPwd"></text>
			</view>
			<view class="flex flex-direction" style="margin-top:100rpx">
				<button class="cu-btn lg round text-white"  @click="login" style="background-image: linear-gradient(to right,#2d56f6,#5ba1ff);">登录</button>
			</view>
		</view>
		<view>
			<image src="@/static/img/index/logo.png" style="width:150rpx;height: 50rpx;margin-top: 50rpx;"></image>
		</view>
	</view>
</template>

<script>
	import {
		userAPI
	} from "api/index.js"
	export default {
		data() {
			return {
				title: process.uniEnv['APP_NAME'],
				user: {
					username: '',
					password: ''
				},
				showPwd:false,
				timer:null
			}
		},
		onLoad() {
			if(uni.getStorageSync('token')){
				uni.showToast({
					icon:'none',
					title:'您已登录，将为您自动跳转至首页',
					success:()=>{
						uni.setStorageSync('token', uni.getStorageSync('token'));
						uni.setStorageSync('username', uni.getStorageSync('name'));
						uni.setStorageSync('userId', uni.getStorageSync('userId'));
						uni.setStorageSync('userCode', uni.getStorageSync('username'));
						uni.setStorageSync('companyCode', uni.getStorageSync('companyCode'));
						this.timer=setTimeout(()=>{
							uni.switchTab({
								url: '/pages/index/index'
							})
						},2000)
						
					}
				})
			}
		},
		onHide(){
			clearTimeout(this.timer)
		},
		methods: {
			login() {
				userAPI.login({
					username: this.user.username,
					password: this.user.password,
				}).then(res => {
					if (res.data.code == 0) {
						if(res.isOverdue=='1'){
							uni.showToast({
								icon:'none',
								title:'密码过期，请及时修改。',
							})
							return
						}
						uni.showToast({
							icon:'none',
							title:'登录成功',
							success:()=>{
								uni.setStorageSync('token', res.data.token);
								uni.setStorageSync('username', res.data.name);
								uni.setStorageSync('userId', res.data.userId);
								uni.setStorageSync('userCode', res.data.username);
								uni.setStorageSync('companyCode', res.data.companyCode);
								this.timer=setTimeout(()=>{
									uni.switchTab({
										url: '/pages/index/index'
									})
								},1000)
								
							}
						})
					} else{
						uni.showToast({
							icon:'none',
							title:res.data.msg
						})
						return
					}
				})
	
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		background: url('@/static/img/index/main-bg.jpg') ;
		background-size: 100vw 100vh;
		text-align: center;
	}
	.cu-form-group+.cu-form-group{
		border-top:none;
	}
	.cu-form-group{
		background: transparent;
		border-bottom: 1px solid #DEDEDE;
		input{
			color:#333;
			text-align: left;
			margin-left: 10rpx;
		}
		.input-icon{
			color:#409eff;
		}
	}
	.title {
		font-size: 46rpx;
		font-weight: 700;
		color: #fff;
		padding:90rpx 0 40rpx 0;
		letter-spacing: 8rpx;
	}
	.sub-title{
		font-size: 28rpx;
		color:#f5f9cc;
	}

	.login-box {
		margin: 200rpx 80rpx 120rpx;
	}

</style>

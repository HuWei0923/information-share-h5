<template>
	<view>
	</view>
</template>

<script>
	import {
		userAPI
	} from "api/index.js"
	export default {
		data() {
			return {
				username:'',
				timer:null
			}
		},
		onLoad(options){
			this.username=options.username
		},
		onHide(){
			clearTimeout(this.timer)
		},
		watch:{
			username:{
				handler(val){
					if(val&&val!=''){
						this.skipLogin()
					}else{
						uni.redirectTo({
							url:'/pages/login/index'
						})
					}
				},
			}
		},
		methods: {
			skipLogin(){
				userAPI.login({
					username: this.username,
					loginType:'skip',
				}).then(res => {
					uni.showLoading({
						mask: true
					})
					if (res.code == 0) {
						uni.setStorageSync('token', res.token);
						uni.setStorageSync('username', res.username);
						this.timer=setTimeout(()=>{
							uni.switchTab({
								url: '/pages/index/index'
							})
						},1000)
					}
				}).catch(err=>{
					this.timer=setTimeout(()=>{
						uni.redirectTo({
							url:'/pages/login/index'
						})
					},1000)
				})
			}
		}
	}
</script>

<style>

</style>

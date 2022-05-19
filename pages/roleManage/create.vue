<template>
	<view class="container">
		<view class="content">
			<uni-list>
				<uni-list-item>
					<view slot="header" class="form-title">
						角色名称
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.roleName"
							@input="inputChange($event, 'roleName')"
						/>
						<view class="error-style" v-if="errMsg.roleName != ''">{{ errMsg.roleName }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						<view style="width: 100rpx;">权限<text class="required-s">*</text></view>
					</view>
					<view slot="footer">
						<view >
							<uni-data-checkbox multiple v-model="form.permissions" :localdata="permissionList" @change="changePermissions"></uni-data-checkbox>
						</view>
						<view class="error-style" v-if="errMsg.permissions != ''">{{ errMsg.permissions }}</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-row class="content" :gutter="20" style="padding: 50rpx;">
			<uni-col :span="24"><button class="cu-btn lg block text-white btn-style bg-blue" @click="commit">提交</button></uni-col>
		</uni-row>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				roleName: '',
				permissions: []
			},
			errMsg: {
				roleName: '',
				permissions:''
			},
			permissionList: [
				{value:'客商初筛权限',text:'客商初筛权限'},
				{value:'黑名单审批权限',text:'黑名单审批权限'},
				{value:'用户子管理权限',text:'用户子管理权限'},
				{value:'信保报告审批权限',text:'信保报告审批权限'},
				{value:'信保报告申请权限',text:'信保报告申请权限'},
				{value:'信保报告列表权限',text:'信保报告列表权限'},
				{value:'消息中心权限',text:'消息中心权限'},
				{value:'访问日志权限',text:'访问日志权限'},
			]
		};
	},
	onLoad(options) {
		console.log(options);
		if (options.roleId) {
			uni.setNavigationBarTitle({
				title: '编辑角色'
			});
			this.getDetailData()
		}
	},
	methods: {
		getDetailData(){
			this.form = {
				roleName:'黑名单审核专员',
				permissions:['客商初筛权限','黑名单审批权限','黑名单申请权限']
			}
		},
		inputChange(event, field) {
			console.log(event, field);
			this.form[field] = event.detail.value;
			if (this.errMsg[field]) this.errMsg[field] = '';
		},
		changePermissions(val){
			// console.log(val)
			this.errMsg.permissions=''
		},
		checkForm(){
			let flag = true;
			if (this.form.roleName == '') {
				this.errMsg.roleName = '请填写角色名称';
				flag = false;
			}
			if (this.form.permissions.length == 0) {
				this.errMsg.permissions = '请选择权限';
				flag = false;
			}
			return flag;
		},
		commit(){
			let flag=this.checkForm()
			if(flag){
				
			}
		}
	}
};
</script>

<style scoped>
	input {
		text-align: right;
	}
</style>

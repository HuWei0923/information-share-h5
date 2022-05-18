<template>
	<view class="container">
		<view class="content">
			<uni-list>
				<uni-list-item>
					<view slot="header" class="form-title">
						工号
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.username"
							@input="inputChange($event, 'username')"
						/>
						<view class="error-style" v-if="errMsg.username != ''">{{ errMsg.username }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						姓名
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.name"
							@input="inputChange($event, 'name')"
						/>
						<view class="error-style" v-if="errMsg.name != ''">{{ errMsg.name }}</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						密码
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							type="password"
							style="width: 280rpx;"
							:value="form.password"
							@input="inputChange($event, 'password')"
						/>
						<view class="error-style" v-if="errMsg.password != ''">{{ errMsg.password }}</view>
					</view>
				</uni-list-item>
				<uni-list-item title="手机">
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.mobile"
							@input="inputChange($event, 'mobile')"
						/>
					</view>
				</uni-list-item>
				<uni-list-item title="邮箱">
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.email"
							@input="inputChange($event, 'email')"
						/>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						公司名称
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<uni-data-picker
							ref="picker"
							placeholder="请选择"
							:localdata="dataTree"
							v-model="form.companyCode"
							:map="{ text: 'name', value: 'code' }"
							@change="onchange"
						>
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" style="width: 280rpx;" :value="form.companyName" readonly />
						</uni-data-picker>
						<view class="error-style" v-if="errMsg.companyCode != ''">{{ errMsg.companyCode }}</view>
					</view>
				</uni-list-item>
				<uni-list-item :rightText="form.companyCode">
					<view slot="header" class="form-title">
						公司代码
						<text class="required-s">*</text>
					</view>
				</uni-list-item>
				<uni-list-item title="部门">
					<view slot="footer">
						<input
							placeholder="请填写"
							placeholder-style="color:#B5B5B5;"
							name="input"
							style="width: 280rpx;"
							:value="form.deptName"
							@input="inputChange($event, 'dept')"
						/>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view slot="header" class="form-title">
						角色
						<text class="required-s">*</text>
					</view>
					<view slot="footer">
						<!-- <uni-data-picker
				ref="picker"
				placeholder="请选择"
				:localdata="roleOptions"
				v-model="form.roleName"
				@change="changeRole"
			></uni-data-picker> -->
						<picker :value="form.roleName" @change="changeRole" :range="roleOptions">
							<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="form.roleName" readonly style="float:right" />
						</picker>
						<view class="error-style" v-if="errMsg.roleName != ''">{{ errMsg.roleName }}</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<uni-row class="content" :gutter="20" style="padding: 50rpx;">
			<uni-col :span="24"><button class="cu-btn lg block text-white btn-style" @click="commit">提交</button></uni-col>
		</uni-row>
	</view>
</template>

<script>
import { companyAPI, userAPI } from 'api/index.js';
import Utils from '@/utils/tool.js';
export default {
	data() {
		return {
			form: {
				username: '',
				name: '',
				password: '',
				mobile: '',
				email: '',
				companyCode: '',
				companyName: '',
				deptName: '',
				roleName: ''
			},
			errMsg: {
				username: '',
				name: '',
				password: '',
				companyCode: ''
			},
			dataTree: [],
			roleOptions: []
		};
	},
	onLoad(options) {
		console.log(options);
		if (options.userId) {
			this.getUserDetail(options.userId);
			uni.setNavigationBarTitle({
				title: '编辑用户'
			});
		}
		this.getAllCompanyLevel();
		this.getAllRole();
		// this.getData();
	},
	methods: {
		getUserDetail(userId) {
			userAPI
				.getUserInfo({
					userId: userId
				})
				.then(res => {
					this.form = res.data.user;
				});
		},
		getAllCompanyLevel() {
			//组织架构查询
			companyAPI.getAllCompanyLevel({ userId: uni.getStorageSync('userId') }).then(res => {
				if (res.data.code == 0) {
					let arr = Utils.formatTreeData(res.data.treeData, 'code', 'scode', null);
					this.dataTree = arr;
				}
			});
		},
		getAllRole() {
			this.roleOptions = [];
			userAPI.getRole().then(res => {
				this.roleOptions = res.data.allRole;
				// this.roleOptions =res.data.allRole.map(item=>{
				// 	return{
				// 		text:item,
				// 		value:item
				// 	}
				// })
				console.log(this.roleOptions);
			});
		},

		inputChange(event, field) {
			console.log(event, field);
			this.form[field] = event.detail.value;
			if (this.errMsg[field]) this.errMsg[field] = '';
		},
		changeRole(e) {
			this.form.roleName = this.roleOptions[e.detail.value];
			this.errMsg.roleName = '';
		},
		onchange(e) {
			if (e.detail.value.length > 0) {
				this.form.companyName = e.detail.value[e.detail.value.length - 1].text;
			}
			this.errMsg.companyCode = '';
		},
		checkForm() {
			let flag = true;
			if (this.form.username == '') {
				this.errMsg.username = '请填写工号';
				flag = false;
			}
			if (this.form.name == '') {
				this.errMsg.name = '请填写姓名';
				flag = false;
			}
			if (this.form.password == '') {
				this.errMsg.password = '请填写密码';
				flag = false;
			}
			if (this.form.companyCode == '') {
				this.errMsg.companyCode = '请选择公司名称';
				flag = false;
			}
			if (this.form.roleName == '') {
				this.errMsg.roleName = '请选择角色';
				flag = false;
			}
			return flag;
		},
		commit() {
			let flag = this.checkForm();
			if (flag) {
				userAPI
					.updateUser({
						userId: this.form.userId,
						username: this.form.username,
						name: this.form.name,
						password: this.form.password,
						mobile: this.form.mobile,
						email: this.form.email,
						companyCode: this.form.companyCode,
						companyName: this.form.companyName,
						deptName: this.form.dept,
						//因为后台接口根据permissionRoles字段判断角色则取
						permissionRoles: this.form.roleName
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
.required-s {
	margin-left: 10rpx;
}
::v-deep uni-switch .uni-switch-input.uni-switch-input-checked {
	background-color: #62bc63 !important;
}
::v-deep uni-switch::after,
uni-switch::before {
	color: transparent !important;
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
	/* justify-content: flex-end; */
}
::v-deep .uni-data-tree {
	max-width: 65vw;
}
::v-deep .arrow-area {
	display: none;
}
</style>

<template>
	<view class="content">
		<uni-row :gutter="20" style="padding: 0 20rpx;">
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="search.name" placeholder="姓名"></uni-easyinput></uni-col>
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="search.code" placeholder="工号"></uni-easyinput></uni-col>
			<uni-col :span="8">
				<uni-data-select class="uni-mt-5" v-model="search.status" placeholder="状态" :localdata="statusOptions"></uni-data-select>
				<!-- <uni-combox class="uni-mt-5" :candidates="statusOptions" placeholder="状态" v-model="search.status"></uni-combox> -->
			</uni-col>
			<uni-col :span="8">
				<uni-data-select class="uni-mt-5" v-model="search.role" placeholder="角色" :localdata="roleOptions" v-if="roleOptions.length > 0"></uni-data-select>
				<!-- <uni-combox class="uni-mt-5" :candidates="roleOptions" placeholder="角色" v-model="search.role"></uni-combox> -->
			</uni-col>
			<uni-col :span="16" style="position: relative;">
				<uni-data-picker
					placeholder="组织机构"
					:localdata="dataTree"
					class="uni-mt-5"
					v-model="search.institution"
					:map="{ text: 'name', value: 'code' }"
					@change="onchange"
					@nodeclick="nodeclick"
					@popupclosed="popupclosed"
					ref="dataPicker"
				></uni-data-picker>
				<view style="background: #fff;position: absolute;left:0;top:0;z-index:2;width: 100%;">
					<uni-easyinput
						class="uni-mt-5"
						:suffixIcon="search.institutionName !== '' ? 'clear' : ''"
						trim="all"
						v-model="search.institutionName"
						placeholder="组织机构"
						readonly
						@focus="$refs.dataPicker.show()"
						@iconClick="closeDataPicker"
					></uni-easyinput>
				</view>
			</uni-col>
		</uni-row>
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">
						<uni-icons
							style="position: relative;top:1px"
							type="person-filled"
							size="18"
							color="#fff"
							v-if="item.permissionRoles && item.permissionRoles.indexOf('sub_admin') > -1"
						></uni-icons>
						{{ item.name }}-{{ item.username }}
					</text>
					<text>
						<uni-tag text="已启用" type="primary" v-if="item.status == 1"></uni-tag>
						<uni-tag text="已停用" v-else-if="item.status == 0"></uni-tag>
					</text>
					<!-- <text>{{ item.code }}</text> -->
				</view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
					<view>邮箱：{{ item.email }}</view>
					<view>手机号：{{ item.mobile }}</view>
					<view>所属公司名称：{{ item.companyName }}</view>
					<view class="btn-box"><uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons></view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="编辑" type="primary" style="margin-right: 10rpx;" @click="edit(item)"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
		<uni-fab ref="fab" :horizontal="horizontal" :vertical="vertical" :popMenu="false" @fabClick="fabClick" />
	</view>
</template>

<script>
import { companyAPI, userAPI } from 'api/index.js';
import Utils from '@/utils/tool.js';
export default {
	data() {
		return {
			search: {
				name: '',
				code: '',
				status: '',
				role: '',
				institution: '',
				institutionName: ''
			},
			statusOptions: [{ value: '1', text: '已启用' }, { value: '0', text: '已停用' }],
			roleOptions: [{}],
			//roleOptions: [],
			dataTree: [],
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more',
			vertical: 'bottom',
			horizontal: 'right'
		};
	},
	watch: {
		search: {
			handler(val) {
				//console.log(val);
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			deep: true
		}
	},
	onLoad() {
		this.getAllRole();
		this.getAllCompanyLevel();
	},
	onShow() {
		this.getData();
	},
	//上拉加载更多
	onReachBottom() {
		if (this.listData.length < this.currentPage * this.pageSize) {
			this.loadStatus = 'noMore';
			return;
		}
		this.currentPage++;
		this.getData();
	},
	//下拉刷新
	onPullDownRefresh() {
		this.currentPage = 1;
		this.listData = [];
		this.getData();
		// setTimeout(() => {
		// 	uni.stopPullDownRefresh();
		// }, 1000);
	},
	methods: {
		getAllCompanyLevel() {
			//组织架构查询
			companyAPI.getAllCompanyLevel({ userId: uni.getStorageSync('userId') }).then(res => {
				if (res.data.code == 0) {
					console.log(res.data);
					let arr = Utils.formatTreeData(res.data.treeData, 'code', 'scode', null);
					this.dataTree = arr;
				}
			});
		},
		//查询角色

		getAllRole() {
			this.roleOptions = [];
			userAPI.getRole().then(res => {
				this.roleOptions = res.data.allRole.map(item => {
					return {
						text: item,
						value: item
					};
				});
				// let dataArray = [];
				// for (let j = 0; j < res.data.allRole.length; j++) {
				// 	let roleTemp = {
				// 		value: res.data.allRole[j],
				// 		text: res.data.allRole[j]
				// 	};
				// 	dataArray.push(roleTemp);
				// }
				// this.roleOptions = dataArray;
				console.log(this.roleOptions);
			});
		},

		getData() {
			// let temp = [
			// 	{ name: '沈旗', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药浙江康恩贝制药浙江康恩贝制药浙江康恩贝制药浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '应春晓', code: '80007532', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 1, showMenu: false },
			// 	{ name: '王蕾', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '贾琼', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '黎婷', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '刘鹏伟', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '沈旗', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '沈旗', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '沈旗', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false },
			// 	{ name: '沈旗', code: '70107165', email: 'test@163.com', mobile: '13513213322', company: '浙江康恩贝制药', status: 0, showMenu: false }
			// ];
			this.loadStatus = 'loading';
			userAPI
				.getUserList({
					pageIndex: this.currentPage,
					pageSize: this.pageSize,
					username: this.search.code,
					name: this.search.name,
					status: this.search.status,
					operator: uni.getStorageSync('userCode'),
					isSubAdmin: this.search.role,
					companyCode: this.search.institution,
					isLevel: true
				})
				.then(res => {
					this.total = res.data.totalRecords;
					if (res.data.userList) {
						for (let i in res.data.userList) {
							res.data.userList[i].showMore = false;
							res.data.userList[i].showMenu = false;
							if (res.data.userList[i].reportbuyerno == null) {
								res.data.userList[i].reportbuyerno = '';
							}
						}
						this.loadStatus = 'more';
						this.listData = [...this.listData, ...res.data.userList];
					}
				});

			// setTimeout(() => {
			// 	this.listData = [...this.listData, ...temp];
			// }, 1000);
		},
		fabClick() {
			uni.navigateTo({
				url: '/pages/user/create'
			});
		},
		edit(item) {
			uni.navigateTo({
				url: `/pages/user/create?userId=${item.userId}`
			});
		},
		onchange(e) {
			console.log(e);
			if (e.detail.value.length > 0) this.search.institutionName = e.detail.value[e.detail.value.length - 1].text;
		},
		nodeclick(e) {
			this.tempInstitute = e;
		},
		popupclosed() {
			if (this.tempInstitute) {
				this.search.institution = this.tempInstitute.code;
				this.search.institutionName = this.tempInstitute.name;
			}
		},
		closeDataPicker() {
			this.$refs.dataPicker.hide();
			this.$refs.dataPicker.clear();
			this.search.institutionName = '';
		}
	}
};
</script>

<style scoped>
::v-deep .uni-combox__input-plac {
	font-size: 24rpx;
	font-weight: 200;
}
::v-deep .input-value {
	line-height: 68rpx;
}
::v-deep .placeholder {
	font-size: 24rpx;
	font-weight: 200;
}
::v-deep .uni-group__title {
	background-color: #4f9be1;
}
::v-deep .uni-group__title-text {
	color: #fff;
}
.content {
	color: #666666;
}
.select_down_ {
	border: 1px solid #e3e3e3;
	width: 300rpx;
	position: absolute;
}
.btn-box {
	position: absolute;
	bottom: 0;
	right: 0;
}
.card-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	height: 40px;
	background-color: #4f9be1;
	font-weight: normal;
	color: #fff;
}
::v-deep .uni-select__input-text {
	width: 170rpx;
}
::v-deep .uni-stat__select {
	padding: 0;
}
::v-deep .uni-stat__actived {
	outline: none;
}
::v-deep .uni-select__input-box {
	min-height: 34px;
}
::v-deep .uni-select__input-placeholder {
	font-weight: 100;
	font-size: 12px;
}
</style>

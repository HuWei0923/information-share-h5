<template>
	<view class="content">
		<uni-row :gutter="20" style="padding: 0 20rpx;">
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.xcode" placeholder="信保代码"></uni-easyinput></uni-col>
			<uni-col :span="8">
				<uni-data-select class="uni-mt-5" v-model="form.approve" placeholder="审批标识" :localdata="selectOptions" ></uni-data-select>
				<!-- <uni-combox class="uni-mt-5" :candidates="candidates" placeholder="审批标识" v-model="form.approve"></uni-combox> -->
			</uni-col>
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.informant" placeholder="填报人"></uni-easyinput></uni-col>
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.approver" placeholder="审批人"></uni-easyinput></uni-col>
			<uni-col :span="16"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.companyName" placeholder="中/英文名称"></uni-easyinput></uni-col>
		</uni-row>
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text>信保代码：{{ item.reportbuyerNo }}</text>
					<uni-tag text="普通" type="primary" v-if="item.speed == '普通'"></uni-tag>
					<uni-tag text="加急" type="warning" v-if="item.speed == '加急'"></uni-tag>
					<uni-tag text="特级" type="error" v-if="item.speed == '特级'"></uni-tag>
				</view>
				<view style="position: relative;line-height: 48rpx;">
					<view>中英文名称：{{ item.reportCorpChnName }}/{{ item.reportCorpEngName }}</view>
					<view>
						审批标识：
						<text>
							<uni-tag text="待审核" inverted type="primary" v-if="item.approveCode == 2"></uni-tag>
							<uni-tag text="通过" inverted type="success" v-else-if="item.approveCode == 1"></uni-tag>
							<uni-tag text="不通过" inverted type="error" v-else-if="item.approveCode == 999"></uni-tag>
						</text>
					</view>
					<uni-transition mode-class="fade" :duration="200" :show="item.showMore">
						<view>统一社会信用代码：{{ item.creditno }}</view>
						<view>
							是否导读：
							<text v-if="item.istranslation == '0'">否</text>
							<text v-if="item.istranslation == '1'">是</text>
						</view>
						<view>审批结果：{{ item.approveMsg }}</view>
						<view>填报人：{{ item.updateName }}</view>
						<view>
							填报时间：
							<uni-dateformat :date="item.updateTime" format="yyyy/MM/dd hh:mm:ss"></uni-dateformat>
						</view>
						<view>审核人：{{ item.approveName }}</view>
						<view>
							审核时间：
							<uni-dateformat :date="item.approveDate" format="yyyy/MM/dd hh:mm:ss"></uni-dateformat>
						</view>
					</uni-transition>
					<view class="btn-box">
						<uni-icons :type="item.showMore ? 'top' : 'bottom'" size="20" style="margin-right: 20rpx;" @click="item.showMore = !item.showMore"></uni-icons>
						<!-- <uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons> -->
					</view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="true">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag :disabled="item.approveby != null" text="通过" type="primary" style="margin-right: 10rpx;" @click="audit(item, 1)"></uni-tag>
						<uni-tag :disabled="item.approveby != null" text="不通过" type="error" @click="audit(item, 999)"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
	</view>
</template>

<script>
import { commonAPI, companyAPI } from 'api/index.js';
export default {
	data() {
		return {
			form: {
				xcode: '',
				companyName: '',
				approve: '',
				informant: '',
				approver: ''
			},
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more', //more/loading/noMore，
			// candidates: ['通过', '不通过', '待审核', '异常'],
			selectOptions: [{ value: '通过', text: '通过' }, { value: '不通过', text: '不通过' },{ value: '待审核', text: '待审核' }, { value: '异常', text: '异常' }],
		};
	},
	watch: {
		form: {
			handler(val) {
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			deep: true
		}
	},
	onLoad() {
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
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		getData() {
			this.loadStatus = 'loading';
			commonAPI
				.searchApplyList({
					pageIndex: this.currentPage,
					pageSize: this.pageSize,
					zxbCode: this.form.xcode,
					zxbCompanyName: this.form.companyName,
					zxbApprove: this.form.approve,
					zxbInformant: this.form.informant,
					zxbApprover: this.form.approver,
					operator: uni.getStorageSync('userCode')
				})
				.then(res => {
					this.total = res.data.totalRecords;
					if (res.data.applyList) {
						for (let i in res.data.applyList) {
							res.data.applyList[i].showMore = false;
							res.data.applyList[i].showMenu = false;
						}
						this.loadStatus = 'more';
						this.listData = [...this.listData, ...res.data.applyList];
					}
				});
		},
		changeApprove(event) {
			this.form.approve = this.candidates[event.detail.value];
		},
		audit(row, code) {
			companyAPI
				.zhongxinbaoApprove({
					corpSerialNo: row.corpSerialNo,
					approve: uni.getStorageSync('userId'),
					approveCode: code
				})
				.then(res => {
					//uni.hideLoading();
					if (res.statusCode == 200) {
						if (res.data.returnCode == 0) {
							uni.showModal({
								title: '提示',
								content: res.data.returnMsg,
								showCancel: false,
								success: () => {
									this.listData = [];
									this.currentPage = 1;
									this.getData();
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: res.data.returnMsg,
								showCancel: false,
								success: () => {
									this.listData = [];
									this.currentPage = 1;
									this.getData();
								}
							});
						}
					}
				});
		},
	}
};
</script>

<style scoped>
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
.approve-s {
	background-color: #67c23a;
}
.reject-s {
	background-color: #f56c6c;
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
::v-deep .uni-combox__input-plac {
	font-size: 24rpx;
	font-weight: 100;
}
::v-deep .uni-select__input-text {
	width: 160rpx;
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
::v-deep .uni-select__input-placeholder{
	font-weight: 100;
	font-size: 12px;
}
</style>

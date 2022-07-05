<template>
	<view style="padding: 20rpx;">
		<uni-row :gutter="10">
			<uni-col :span="16" style="position: relative;">
				<view style="width: 100%;height: 76rpx;border: 1px solid rgb(229, 229, 229);display: flex;align-items: center;border-radius: 4px;">
					<view class="ins_style" :class="{ 'no-style': form.companyName.length == 0 }" @click="showCompanyPopup">
						<text v-if="form.companyName.length == 0">企业名称</text>
						<text v-else>
							<uni-tag :text="form.companyName[0]"></uni-tag>
							<uni-tag :text="`+${form.companyName.length - 1}`" style="margin-left: 2px;" v-if="form.companyName.length > 1"></uni-tag>
						</text>
					</view>
					<view style="width: 25px;" v-if="form.companyName.length !== 0"><uni-icons type="clear" size="18px" color="#e3e3e3" @click="cancleCompany"></uni-icons></view>
				</view>
			</uni-col>
			<uni-col :span="8"><uni-data-select v-model="form.riskLevel" :localdata="riskLevelOptions" @change="changeRiskLevel" placeholder="风险等级"></uni-data-select></uni-col>
			<uni-col :span="16"><uni-datetime-picker v-model="form.dateRange" :clear-icon="false" class="uni-mt-2" type="daterange" /></uni-col>
			<uni-col :span="8">
				<view style="width: 100%;height: 76rpx;border: 1px solid rgb(229, 229, 229);display: flex;align-items: center;border-radius: 4px;" class="uni-mt-2">
					<view class="ins_style" :class="{ 'no-style': form.eventType.length == 0 }" @click="showEventPopup">
						<text v-if="form.eventType.length == 0">事件类型</text>
						<text v-else>
							<uni-tag :text="form.eventType[0]"></uni-tag>
							<uni-tag :text="`+${form.eventType.length - 1}`" style="margin-left: 2px;" v-if="form.eventType.length > 1"></uni-tag>
						</text>
					</view>
					<view style="width: 25px;" v-if="form.eventType.length !== 0"><uni-icons type="clear" size="18px" color="#e3e3e3" @click="cancleEventType"></uni-icons></view>
				</view>
			</uni-col>
		</uni-row>
		<view style="color: orange;font-size: 12px;">注：部分第三方网站由于网站本身问题可能存在过期或封停导致无法查看，请见谅。</view>
		<view style="padding: 10rpx 20rpx 0;display: flex;justify-content: space-between;">
			<text>
				共
				<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
				条数据
			</text>
			<text>数据来源：天眼查</text>
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">【{{ item.typeName }}】- {{ item.companyName }}</text>
				</view>
				<view style="padding: 15px;">
					<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
						<view>
							风险等级：
							<uni-tag :text="item.riskLevel" :type="item.riskLevel == '高风险' ? 'error' : 'warning'"></uni-tag>
						</view>
						<view>{{ item.a }}</view>
						<view>推送时间：{{ item.updateTime }}</view>
						<view>
							链接：
							<uni-link :href="item.url" :text="item.url" color="#007BFF" v-if="item.url"></uni-link>
						</view>
					</view>
				</view>
			</uni-group>
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
		<!-- 企业名称弹框 -->
		<uni-drawer ref="popup" mode="right" :mask-click="false">
			<view class="popup-title">
				<text @click="$refs.popup.close()">取消</text>
				<text style="color: #409eff;" @click="selectAll">{{ multipleSelect.length == companyOptions.length ? '取消全选' : '全选' }}</text>
				<text style="color: #409eff;" @click="confirm">确定</text>
			</view>
			<scroll-view class="popup-content" scroll-y="true">
				<checkbox-group @change="changeCompany">
					<label v-for="(item, index) in companyOptions" :key="item.companyName" class="popup-item">
						<view class="left-text">{{ item.companyName }}</view>
						<view><checkbox :value="item.companyName" :checked="item.checked" /></view>
					</label>
				</checkbox-group>
			</scroll-view>
		</uni-drawer>
		<!-- 事件类型弹框 -->
		<uni-drawer ref="eventPopup" mode="right" :mask-click="false">
			<view class="popup-title">
				<text @click="$refs.eventPopup.close()">取消</text>
				<text style="color: #409eff;" @click="eventSelectAll">{{ eventMultipleSelect.length == eventTypeOptions.length ? '取消全选' : '全选' }}</text>
				<text style="color: #409eff;" @click="eventConfirm">确定</text>
			</view>
			<scroll-view class="popup-content">
				<checkbox-group @change="changeEventType">
					<label v-for="(item, index) in eventTypeOptions" :key="item.eventType" class="popup-item">
						<view class="left-text">{{ item.eventType }}</view>
						<view><checkbox :value="item.eventType" :checked="item.checked" /></view>
					</label>
				</checkbox-group>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
import { messageAPI } from '@/api/index.js';
import moment from 'moment';
export default {
	props: {
		searchMoreFlag: Boolean,
		companyName:String
	},
	data() {
		return {
			form: {
				companyName: [],
				dateRange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				riskLevel: '',
				riskLevelOpt: [],
				eventType: []
			},
			companyOptions: [],
			riskLevelOptions: [{ text: '全选', value: '全选' }, { text: '高风险', value: '高风险' }, { text: '一般风险', value: '一般风险' }],
			eventTypeOptions: [],
			total: 0,
			pageSize: 15,
			currentPage: 1,
			listData: [],
			loadStatus: 'more',
			multipleSelect: [],
			eventMultipleSelect: []
		};
	},
	watch: {
		form: {
			handler(val) {
				this.getEventTypeList();
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			deep: true,
			// immediate: true
		},
		searchMoreFlag(val) {
			//上拉显示更多
			if (this.listData.length < this.currentPage * this.pageSize) {
				this.loadStatus = 'noMore';
				return;
			}
			this.currentPage++;
			this.getData();
		}
	},
	mounted() {
		this.form.dateRange=[moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
		if(this.companyName!=='') this.form.companyName=[this.companyName]
		this.$forceUpdate()
		this.getCompayNameList();
	},
	onShow() {},

	methods: {
		getData() {
			let param = {
				pageIndex: this.currentPage,
				pageSize: this.pageSize,
				userName: uni.getStorageSync('userCode'),
				companyName: this.form.companyName,
				riskleve: this.form.riskLevelOpt,
				eventType: this.form.eventType,
				startDate: this.form.dateRange[0],
				endDate: this.form.dateRange[1]
			};
			this.loadStatus = 'loading';
			messageAPI.getRealTimeWarning(param).then(res => {
				if (res.data.code == '0') {
					this.total = res.data.totalRecords;
					this.listData = [...this.listData, ...res.data.realTimeWarningList];
					if (this.listData.length < this.currentPage * this.pageSize) {
						this.loadStatus = 'noMore';

						return;
					}
					this.loadStatus = 'more';
				}
			});
		},
		getCompayNameList() {
			messageAPI.getCompayNameList({ userName: uni.getStorageSync('userCode') }).then(res => {
				if (res.data.code == 0) {
					this.companyOptions = res.data.companyNameList.map(item => {
						return {
							companyName: item,
							checked: false
						};
					});
				}
			});
		},
		getEventTypeList() {
			let param = {
				companyName: this.form.companyName,
				startDate: this.form.dateRange[0],
				endDate: this.form.dateRange[1],
				riskLevel: this.form.riskLevelOpt,
				userName: uni.getStorageSync('userCode')
			};
			messageAPI.getEventTypeList(param).then(res => {
				if (res.data.code == 0) {
					this.eventTypeOptions = res.data.eventTypeList.map(item => {
						return {
							eventType: item,
							checked: false
						};
					});
				}
			});
		},
		changeCompany(e) {
			this.multipleSelect = e.detail.value;
		},
		changeEventType(e) {
			this.eventMultipleSelect = e.detail.value;
		},
		confirm() {
			this.form.companyName = this.multipleSelect;
			this.$refs.popup.close();
		},
		eventConfirm() {
			console.log(this.eventMultipleSelect);
			this.form.eventType = this.eventMultipleSelect;
			this.$refs.eventPopup.close();
		},
		cancleCompany() {
			this.form.companyName = [];
		},
		cancleEventType() {
			this.form.eventType = [];
		},
		changeRiskLevel(val) {
			console.log(val);
			if (val == '全选') {
				this.form.riskLevelOpt = ['高风险', '一般风险'];
			} else if (val && val !== '') {
				this.form.riskLevelOpt = [val];
			}
		},
		showCompanyPopup() {
			//打开企业弹框
			this.$refs.popup.open('right');
			this.companyOptions.map(item => {
				item.checked = false;
				if (this.form.companyName.includes(item.companyName)) {
					item.checked = true;
				}
				return item;
			});
		},
		showEventPopup() {
			this.$refs.eventPopup.open('right');
			this.eventTypeOptions.map(item => {
				item.checked = false;
				if (this.form.eventType.includes(item.eventType)) {
					item.checked = true;
				}
				return item;
			});
		},
		selectAll() {
			if (this.multipleSelect.length == this.companyOptions.length) {
				//已全选  再次点击取消全选
				this.companyOptions.map(item => {
					item.checked = false;
					this.multipleSelect = [];
					return item;
				});
			} else {
				let list = [];
				this.companyOptions.map(item => {
					item.checked = true;
					list.push(item.companyName);
				});
				this.multipleSelect = list;
			}
		},
		eventSelectAll() {
			if (this.eventMultipleSelect.length == this.eventTypeOptions.length) {
				//已全选  再次点击取消全选
				this.eventTypeOptions.map(item => {
					item.checked = false;
					this.eventMultipleSelect = [];
					return item;
				});
			} else {
				let list = [];
				this.eventTypeOptions.map(item => {
					item.checked = true;
					list.push(item.eventType);
				});
				this.eventMultipleSelect = list;
			}
		}
	}
};
</script>

<style scoped>
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
::v-deep .uni-select {
	display: block;
}
::v-deep .uni-stat__select {
	padding: 0;
	display: block;
}
::v-deep .uni-stat__actived {
	outline: none;
}
::v-deep .uni-select__input-box {
	min-height: 38px;
}
::v-deep .uni-select__input-placeholder {
	font-weight: 100;
	font-size: 12px;
}
::v-deep .uni-input-placeholder {
	font-weight: 100;
	font-size: 13px;
}
::v-deep .uni-group__content {
	padding: 0;
}
::v-deep .uni-link {
	word-break: break-all;
}
::v-deep .uni-date-x {
	height: 38px;
	/* border-radius: 0; */
}
::v-deep .uni-drawer__content {
	width: 85vw !important;
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
	font-weight: normal;
	background-color: #4f9be1;
	color: #fff;
}
.active {
	background-color: #4f9be1;
	color: #fff;
}
.ins_style {
	flex: 1;
	height: 100%;
	line-height: 70rpx;
	padding-left: 20rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #333;
}
.no-style {
	font-weight: 100;
	font-size: 12px;
}

.disabled {
	background-color: #e3e3e3;
	color: gray;
}
.popup-content {
	padding: 15px 0;
	height: 50px;
	background-color: #fff;
	/* width: 85vw; */
	/* overflow: auto; */
	height: 90vh;
}
.popup-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #efefef;
	padding: 10px 15px;
}
.left-text {
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.popup-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid #efefef;
	padding: 10px 15px;
}
</style>

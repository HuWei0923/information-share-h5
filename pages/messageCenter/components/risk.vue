<template>
	<view style="padding: 20rpx;">
		<uni-row :gutter="10">
			<uni-col :span="16" style="position: relative;">
				<view
					style="width: 100%;height: 76rpx;border: 1px solid rgb(229, 229, 229);display: flex;align-items: center;border-radius: 4px;">
					<view class="ins_style" :class="{ 'no-style': form.companyName.length == 0 }"
						@click="showCompanyPopup">
						<text v-if="form.companyName.length == 0">企业名称</text>
						<text v-else>
							<uni-tag :text="form.companyName[0]"></uni-tag>
							<uni-tag :text="`+${form.companyName.length - 1}`" style="margin-left: 2px;"
								v-if="form.companyName.length > 1"></uni-tag>
						</text>
					</view>
					<view style="width: 25px;" v-if="form.companyName.length !== 0">
						<uni-icons type="clear" size="18px" color="#e3e3e3" @click="cancleCompany"></uni-icons>
					</view>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view
					style="width: 100%;height: 76rpx;border: 1px solid rgb(229, 229, 229);display: flex;align-items: center;border-radius: 4px;">
					<view class="ins_style" :class="{ 'no-style': form.riskLevel.length == 0 }" @click="showRiskPopup">
						<text v-if="form.riskLevel.length == 0">风险等级</text>
						<text v-else>
							<uni-tag :text="form.riskLevel[0]"></uni-tag>
							<uni-tag :text="`+${form.riskLevel.length - 1}`" style="margin-left: 2px;"
								v-if="form.riskLevel.length > 1"></uni-tag>
						</text>
					</view>
					<view style="width: 25px;" v-if="form.riskLevel.length !== 0">
						<uni-icons type="clear" size="18px" color="#e3e3e3" @click="cancleRisk"></uni-icons>
					</view>
				</view>
				</uni-data-select>
			</uni-col>
			<uni-col :span="16">
				<uni-datetime-picker v-model="form.dateRange" class="uni-mt-2" :clear-icon="false" type="daterange" />
			</uni-col>

		</uni-row>
		<view style="padding: 10rpx 20rpx 0;display: flex;justify-content: space-between;">
			<text> 共
				<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
				条数据</text>
			<text>
				<text>数据来源：中诚信</text>
				<text class="uni-ml-10">更新时间：{{updateTime}}</text>
			</text>

		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">{{ item.enterpriseName }}</text>

				</view>
				<view style="padding: 15px;">
					<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
						<view>风险等级：
							<uni-tag text="一般" type="primary" v-if="item.levelType=='一般'"></uni-tag>
							<uni-tag text="重大" type="warning" v-if="item.levelType=='重大'"></uni-tag>
							<uni-tag text="警示" type="error" v-if="item.levelType=='警示'"></uni-tag>
						</view>
						<view>监控企业类别：{{ item.entType }}</view>
						<view>风险类别：{{ item.typeName }}</view>
						<view>风险事件：{{ item.description }}</view>
						<view>消息日期：{{ item.ud }}</view>
						<view>推送来源：{{ item.pushSource }}</view>
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
				<text style="color: #409eff;"
					@click="selectAll">{{ multipleSelect.length == companyOptions.length ? '取消全选' : '全选' }}</text>
				<text style="color: #409eff;" @click="confirm">确定</text>
			</view>
			<scroll-view class="popup-content" scroll-y="true">
				<checkbox-group @change="changeCompany">
					<label v-for="(item, index) in companyOptions" :key="item.companyName" class="popup-item">
						<view class="left-text">{{ item.companyName }}</view>
						<view>
							<checkbox :value="item.companyName" :checked="item.checked" />
						</view>
					</label>
				</checkbox-group>
			</scroll-view>
		</uni-drawer>
		<!-- 风险等级弹框 -->
		<uni-drawer ref="riskPopup" mode="right" :mask-click="false">
			<view class="popup-title">
				<text @click="$refs.riskPopup.close()">取消</text>
				<text style="color: #409eff;"
					@click="riskSelectAll">{{ riskMultipleSelect.length == riskLevelOptions.length ? '取消全选' : '全选' }}</text>
				<text style="color: #409eff;" @click="riskConfirm">确定</text>
			</view>
			<scroll-view class="popup-content">
				<checkbox-group @change="changeRiskType">
					<label v-for="(item, index) in riskLevelOptions" :key="item.riskLevel" class="popup-item">
						<view class="left-text">{{ item.riskLevel }}</view>
						<view>
							<checkbox :value="item.riskLevel" :checked="item.checked" />
						</view>
					</label>
				</checkbox-group>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		messageAPI
	} from '@/api/index.js';
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
					riskLevel: [],
				},
				companyOptions: [],
				riskLevelOptions: [{
						riskLevel: '警示',
						checked: false
					},
					{
						riskLevel: '重大',
						checked: false
					},
					{
						riskLevel: '一般',
						checked: false
					},
				],
				total: 0,
				pageSize: 15,
				currentPage: 1,
				listData: [],
				loadStatus: 'more',
				updateTime: '8:30 AM',
				multipleSelect: [],
				riskMultipleSelect: [],
			}
		},
		watch: {
			form: {
				handler(val) {
					// console.log(val);
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
			this.getCompayNameList();
		},
		methods: {
			getCompayNameList() {
				messageAPI.getCompayNameList({
					userName: uni.getStorageSync('userCode')
				}).then(res => {
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
			getData() {
				let param = {
					companyName: this.form.companyName,
					startDate: this.form.dateRange[0],
					endDate: this.form.dateRange[1],
					pageIndex: this.currentPage,
					pageSize: this.pageSize,
					userName: uni.getStorageSync('userCode'),
					// userName: 'admin',
					riskleve: this.form.riskLevel
				}
				this.loadStatus = 'loading';
				messageAPI.getRiskMorningPost(param).then(res => {
					if (res.data.code == '0') {
						this.total = res.data.totalRecords
						this.listData = [...this.listData, ...res.data.riskMorningPostList];
						if (this.listData.length < this.currentPage * this.pageSize) {
							this.loadStatus = 'noMore';

							return;
						}
						this.loadStatus = 'more';
					}
				})
			},
			changeCompany(e) {
				this.multipleSelect = e.detail.value;
			},
			confirm() {
				this.form.companyName = this.multipleSelect;
				this.$refs.popup.close();
			},
			cancleCompany() {
				this.form.companyName = [];
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
			changeRiskType(e) {
				this.riskMultipleSelect = e.detail.value;
			},
			showRiskPopup() {
				this.$refs.riskPopup.open('right');
				this.riskLevelOptions.map(item => {
					item.checked = false;
					if (this.form.riskLevel.includes(item.riskLevel)) {
						item.checked = true;
					}
					return item;
				});
			},
			riskSelectAll() {
				if (this.riskMultipleSelect.length == this.riskLevelOptions.length) {
					//已全选  再次点击取消全选
					this.riskLevelOptions.map(item => {
						item.checked = false;
						this.riskMultipleSelect = [];
						return item;
					});
				} else {
					let list = [];
					this.riskLevelOptions.map(item => {
						item.checked = true;
						list.push(item.riskLevel);
					});
					this.riskMultipleSelect = list;
				}
			},
			riskConfirm() {
				this.form.riskLevel = this.riskMultipleSelect;
				this.$refs.riskPopup.close();
			},
			cancleRisk() {
				this.form.riskLevel = [];
			}
		}
	}
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
		font-size: 13px;
	}

	::v-deep .uni-input-placeholder {
		font-weight: 100;
		font-size: 12px;
	}

	::v-deep .uni-group__content {
		padding: 0;
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
		color: #333
	}

	.no-style {
		font-weight: 100;
		font-size: 12px;
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

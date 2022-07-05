<template>
	<view style="padding: 20rpx;">
		<uni-row :gutter="10">
			<uni-col :span="16">
				<uni-datetime-picker v-model="form.dateRange" class="uni-mt-2" :clear-icon="false" type="daterange" />
			</uni-col>
		</uni-row>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">{{ item.pushType }}</text>
		
				</view>
				<view style="padding: 15px;">
					<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
						<view>推送内容：{{ item.promptinfo }}</view>
						<view>推送人：{{ item.userName }}</view>
						<view>推送时间：{{ item.updateTime }}</view>
					</view>
				</view>
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
	import {
		messageAPI
	} from '@/api/index.js';
	import moment from 'moment';
	export default {
		props: {
			searchMoreFlag: Boolean,
		},
		data() {
			return {
				form: {
					dateRange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				},
				total: 0,
				pageSize: 15,
				currentPage: 1,
				listData: [],
				loadStatus: 'more',
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
				immediate: true
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
		
		methods: {
			getData(){
				let param = {
					startDate: this.form.dateRange[0],
					endDate: this.form.dateRange[1],
					pageIndex: this.currentPage,
					pageSize: this.pageSize,
					userName: uni.getStorageSync('userCode'),
				}
				this.loadStatus = 'loading';
				messageAPI.getPlatformNews(param).then(res => {
					if (res.data.code == '0') {
						this.total = res.data.totalRecords
						this.listData = [...this.listData, ...res.data.platformNewsList];
						if (this.listData.length < this.currentPage * this.pageSize) {
							this.loadStatus = 'noMore';
				
							return;
						}
						this.loadStatus = 'more';
					}
				})
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

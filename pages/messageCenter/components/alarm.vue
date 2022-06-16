<template>
	<view style="padding: 20rpx;">
		<uni-row :gutter="10" >
			<uni-col :span="16" style="position: relative;">
				<uni-data-select v-model="form.companyName" :localdata="companyOptions" @change="changeCompany" placeholder="企业名称"></uni-data-select>
			</uni-col>
			<uni-col :span="8">
				<uni-data-select v-model="form.riskLevel" :localdata="riskLevelOptions" @change="changeRiskLevel" placeholder="风险等级"></uni-data-select></uni-col>
			<uni-col :span="16"><uni-datetime-picker v-model="form.dateRange" class="uni-mt-2" type="daterange"/></uni-col>
			<uni-col :span="8">
				<uni-data-select v-model="form.eventType" :localdata="eventTypeOptions" class="uni-mt-2" @change="changeEventType" placeholder="事件类型"></uni-data-select>
			</uni-col>
		</uni-row>
		<view style="color: orange;font-size: 12px;">注：部分第三方网站由于网站本身问题可能存在过期或封停导致无法查看，请见谅。</view>
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length>0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">
						【{{ item.type }}】- {{ item.companyName }}
					</text>
				</view>
				<view style="padding: 15px;">
					<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
						<view>标题：{{ item.title }}</view>
						<view v-if="item.showDetail">
							<view>案件类型：{{ item.eventType }}</view>
							<view>案号：{{ item.eventNo }}</view>
							<view>法院：{{ item.court }}</view>
							<view>案由：{{ item.eventReason }}</view>
							<view>发布时间：{{ item.publishTime }}</view>
							<view>链接：<uni-link :href="item.url" :text="item.url" color="#007BFF"></uni-link></view>
						</view>
						<view class="btn-box"><uni-icons :type="item.showDetail ? 'top' : 'bottom'" size="15" @click="item.showDetail = !item.showDetail"></uni-icons></view>
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
export default {
	data() {
		return {
			form: {
				companyName: '',
				dateRange: [new Date(),new Date()],
				riskLevel: '',
				eventType:''
			},
			companyOptions: [{ value: 123, text: '知豆电动汽车有限公司' }],
			riskLevelOptions: [],
			eventTypeOptions: [],
			total:0,
			currentPage:1,
			listData:[],
			loadStatus: 'more',
		};
	},
	watch: {
		form: {
			handler(val) {
				console.log(val);
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			deep: true,
			immediate:true
		}
	},
	onShow() {
		
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
	},
	methods: {
		getData(){
			let temp = [
				{type:'裁判文书',companyName:'浙江康恩贝制药股份有限公司',title:'《浙江康恩贝制药股份有限公司、吉林省东医生大药房连锁有限公司侵害商标权纠纷民事二审民事判决书》',eventType:'民事案件',eventNo:'(2021)吉民终872号',court:'吉林省最高级人民法院',eventReason:'侵害商标权纠纷',publishTime:'2022-06-22',url:'http://www.baidu.com',showDetail:false}
			]
			
			this.listData=[...this.listData,...temp]
		},
		changeCompany() {},
		changeRiskLevel() {},
		
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
	font-size: 13px;
}
::v-deep .uni-input-placeholder {
	font-weight: 100;
	font-size: 13px;
}
::v-deep .uni-group__content {
	padding: 0;
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
	line-height: 66rpx;
	padding-left: 20rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color:#333
}
.no-style{
	font-weight: 100;
	font-size: 12px;
}
</style>

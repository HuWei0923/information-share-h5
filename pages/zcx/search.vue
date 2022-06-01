<template>
	<view class="content">
		<uni-row>
			<uni-col :span="7" style="">
				<uni-data-select style="width: 25px;" v-model="selectType" :localdata="selectOptions" @change="changeSelectType" :clear="false"></uni-data-select>
			</uni-col>
			<uni-col :span="17"><uni-search-bar radius="5" placeholder="请输入搜索内容" clearButton="auto" cancelButton="none" @confirm="search" @clear="listData=[]" v-model="keyword" /></uni-col>
		</uni-row>
		<view style="padding:10rpx 20rpx;font-weight: bold;">搜索历史</view>
		<view style="padding:10rpx 20rpx;display: flex;flex-wrap: wrap;">
			<uni-tag :inverted="true" :text="item.keyWord" type="primary" @click="clickHistoryTag(item)" v-for="item in searchHistory" :key="item.id" class="uni-mr-2 uni-mb-2" />
		</view>
		<view style="padding:10rpx 20rpx;font-weight: bold;">搜索结果</view>
		<view v-if="listData.length > 0">
			<view style="padding: 10rpx 20rpx 0;">
				共搜索到
				<text style="color: #409eff;margin: 0 10rpx;">{{ listData.length }}</text>
				条数据结果，结果来自
				<text style="color: #409eff;margin: 0 10rpx;">{{ sourceType }}</text>
			</view>
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title"><text v-html="highLightKeyword(item.companyName)"></text></view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;" @click="goToPage(item)">
					<view>社会统一信用代码：{{ item.creditCode }}</view>
					<view>法人代表：{{ item.operName }}</view>
					<view>成立时间：{{ item.buildDate }}</view>
					<view>关联代码：{{ item.id }}</view>
					<!-- <view class="btn-box"><uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons></view> -->
				</view>
				<!-- <uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="编辑" type="primary" style="margin-right: 10rpx;" @click="edit(item)"></uni-tag>
					</view>
				</uni-transition> -->
			</uni-group>
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
	</view>
</template>

<script>
import { zcxAPI } from 'api/index.js';
export default {
	data() {
		return {
			selectType: 0,
			selectOptions: [{ value: 0, text: '站内搜索' }, { value: 1, text: '全网搜索' }],
			searchHistory: [],
			listData: [],
			sourceType: '',
			pageIndex: '',
			keyword: '',
			fxcsData:{},
		};
	},
	onLoad(options) {
		console.log(options)
		this.pageIndex = options.page;
		this.getLatestWords();
	},
	methods: {
		getLatestWords() {
			let param = {
				userId: uni.getStorageSync('userId')
			};
			zcxAPI.getLatestWords(param).then(res => {
				this.searchHistory = res.data.latestWords;
			});
		},
		clickHistoryTag(item){
			this.keyword = item.keyWord
			this.search()
		},
		search(val) {
			if(!this.keyword||this.keyword=='') return
			let param = {
				userId: uni.getStorageSync('userId'),
				page: 1,
				keyword: this.keyword
			};
			let api = ''
			if (this.selectType == 0) {	//站内搜索
				api='searchList'
			}else if(this.selectType==1){//全网搜索
				api='directSearchList'
			}
			zcxAPI[api](param).then(res => {
				this.sourceType = res.data.sourceType;
				this.listData = res.data.searchList;
			});
		},
		changeSelectType(val) {
			this.selectType=val
			this.search()
		},
		highLightKeyword(text) {
			var i,
				len = this.keyword.length,
				re;
			for (i = 0; i < len; i++) {
				// 正则匹配所有的文本
				re = new RegExp(this.keyword[i], 'g');
				if (re.test(text)) {
					text = text.replace(re, `<span style="color: yellow;font-weight:bold">${this.keyword[i]}</span>`);
				}
			}
			return text;
		},
		fxcsIsDay(item,fxcsData){
			// if (new Date().getTime() - this.fxcsData.updateTime < 86400000) {
			if(new Date(this.fxcsData.updateTime).toDateString() === new Date().toDateString()){
				//预览pdf
				uni.navigateTo({
					url: '/pages/pdf/zcxindex?fileName='+fxcsData.fileName+'&reportId='+fxcsData.reportId+'&reportType='+fxcsData.reportType+'&updateTime='+fxcsData.updateTime+'&isDownload=1'
				});
			} else {
				uni.showModal({
					title: '提示',
					cancelText:'取消',
					confirmText:'确定',
					content:'已有本地报告，是否直接查阅?',
					success: function (res1) {
						if (res1.confirm) {
						//预览pdf
							uni.navigateTo({
								url: '/pages/pdf/zcxindex?fileName='+fxcsData.fileName+'&reportId='+fxcsData.reportId+'&reportType='+fxcsData.reportType+'&updateTime='+fxcsData.updateTime+'&isDownload=1'
							});
							console.log('用户点击确定');
							
						} else if (res1.cancel) {
							uni.navigateTo({
								url:`/pages/zcx/fxcs?companyId=${item.companyId}&companyName=${item.companyName}&creditCode=${item.creditCode}`
							})
							console.log('放弃');
						}
					}
				});
			}
		},
		goToPage(item){
			console.log(item)
			
			if(item.creditCode == '' || item.creditCode == null){
				
				uni.showModal({
					title: '提示',
					content: '非常抱歉，此公司无统一社会信用代码，无法生成对应报告！',
					showCancel: false,
					success: () => {
						
					}
				});
						
				return;
			}
			debugger;
			if(this.pageIndex=='fxcs'){
				
				
				let fxcsData={
					companyId:item.companyId,
					reportType:'风险初筛'
				}
				zcxAPI.getReportList(fxcsData).then(res=>{
					if (res.data.code == '0') {
						if(res.data.reportList.length > 0){
							var fxcsData = res.data.reportList[0];
							console.log(res.data);
							//console.log(this.fxcsData)
							this.fxcsIsDay(item,fxcsData)
						}else{
							uni.navigateTo({
								url:`/pages/zcx/${this.pageIndex}?companyId=${item.companyId}&companyName=${item.companyName}&creditCode=${item.creditCode}`
							})
						}
					}
				})
				
				
				
			}else{
				uni.navigateTo({
					url:`/pages/zcx/${this.pageIndex}?companyId=${item.companyId}&companyName=${item.companyName}&creditCode=${item.creditCode}`
				})
			}
			
			
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
.btn-box {
	position: absolute;
	bottom: 0;
	right: 0;
}
::v-deep .uni-select__input-text {
	width: 160rpx;
}
::v-deep .uni-stat__select {
	padding: 10px 0 5px 8px;
}
::v-deep .uni-stat__actived {
	outline: none;
}
::v-deep .uni-select__input-box {
	min-height: 34px;
}
</style>

<template>
	<view class="content">
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index">
				<view slot="title" class="card-title">
					<text style="font-weight: bold;">报告类型：{{ item.reportType }}</text>
				</view>
				<view style="position: relative;line-height: 48rpx;padding-right: 60rpx;">
					<view>区域：{{ item.area||'/' }}</view>
					<view>行业：{{ item.industry||'/' }}</view>
					<view>企业类型：{{ item.companyType||'/' }}</view>
					<view>更新时间：{{ formatMsToDate(item.updateTime)||'/' }}</view>
					<view class="btn-box"><uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons></view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="预览" type="primary" style="margin-right: 10rpx;" @click="checkDetail(item)"></uni-tag>
						<uni-tag text="下载" type="success" style="margin-right: 10rpx;" @click="downnload(item)"></uni-tag>
					</view>
				</uni-transition>
			</uni-group>
			<!-- <uni-load-more :status="loadStatus"></uni-load-more> -->
		</view>
		<view class="empty-box" v-else>
			<image src="@/static/img/empty-image.png" class="empty-image"></image>
			<view class="empty-text">暂无数据</view>
		</view>
	</view>
</template>

<script>
	import { zcxAPI } from 'api/index.js';
	import Utils from '@/utils/tool.js';
export default {
	data() {
		return {
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more',
			companyId:'',
			reportType:''
		};
	},
	onLoad(options) {
		const script4 = document.createElement('script');
		script4.src = 'http://cmp/v1.0.0/js/cmp-i18n.js';
		document.body.appendChild(script4);
		
		const script = document.createElement('script');
		script.src = 'http://cmp/v1.0.0/js/cordova/__CMPSHELL_PLATFORM__/cordova.js';
		
		const script1 = document.createElement('script');
		script1.src = 'http://cmp/v1.0.0/js/cordova/cordova-plugins.js';
		
		const script2 = document.createElement('script');
		script2.src = 'http://cmp/v/js/cmp.js';
		
		const script3 = document.createElement('script');
		script3.src = 'http://cmp/v/js/cmp-att.js';
		
		script4.onload=function () {	
			document.body.appendChild(script);
		}
		script.onload=function () {	
			document.body.appendChild(script1);
		}
		script1.onload=function () {     
		    document.body.appendChild(script2);
		}
		script2.onload=function () {   
		    document.body.appendChild(script3);
		}
		console.log(options)
		this.companyId=options.companyId;
		
		this.reportType=options.pageFrom;
		this.getData();
	},
	onShow() {
		
	},
	//下拉刷新
	onPullDownRefresh() {
		
		this.listData = [];
		this.getData();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		getData() {
			let param={
				companyId:this.companyId,
				reportType:this.reportType
			}
			zcxAPI.getReportList(param).then(res=>{
				if(res.data.code==0){
					this.listData =res.data.reportList.map(item=>{
						item.showMenu=false
						return item
					})
					this.total=res.data.reportList.length
				}
			})
		},
		formatMsToDate(time){
			return	Utils.formatMsToDate(time)
		},
		downnload(item) {
			let param = {
				fileName: item.fileName,
				reportId:item.reportId,
				reportType:item.reportType,
				updateTime:item.updateTime,
				isDownload:"1"
			}
			
			var url1='http://zibchina.com:9001/api/company/ZCX/getPDF/'+item.pdfName;	
			// alert(url1);
			// alert(typeof(cmp.att));
			
			if(typeof(cmp)  == 'function'){
				
				var toDownloadFileOptions = {
					path:url1,//文件下载地址
					filename:item.pdfName,//文件名称
					
					success:function(result){ //下载成功的回调
					//返回的数据格式如下：
						//alert(JSON.stringify(result));
					},
					error:function(error){//下载失败的回调函数
						alert(JSON.stringify(error));
					
					}
				}
				cmp.att.read(toDownloadFileOptions);
			}else{
				zcxAPI.getLiteRatingPDF(param).then(res => {
					console.log(res)
					
					const content = res.data
					const blob = new Blob([content])
					const fileName = `${item.fileName}`.split('.')[0] + '.pdf'
					debugger;
					// const fileName = `${row.fileName}.pdf`
					if ('download' in document.createElement('a')) { // 非IE下载
						const elink = document.createElement('a')
						elink.download = fileName
						elink.style.display = 'none'
						elink.href = URL.createObjectURL(blob)
						console.log(elink.href);
						document.body.appendChild(elink)
						elink.click()
						URL.revokeObjectURL(elink.href) // 释放URL 对象
						document.body.removeChild(elink)
					} else { // IE10+下载
						navigator.msSaveBlob(blob, fileName)
					}
				});
			}
		},
		checkDetail(item) {
			//预览pdf
			uni.redirectTo({
				url: '/pages/pdf/zcxindex?fileName='+item.fileName+'&reportId='+item.reportId+'&reportType='+item.reportType+'&updateTime='+item.updateTime+'&isDownload=1'
			});
		},
	}
};
</script>

<style scoped>
::v-deep .uni-group__title {
	background-color: #4f9be1;
}
::v-deep .uni-group__title-text {
	color: #fff;
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
</style>

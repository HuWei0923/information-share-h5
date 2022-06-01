<template>
	<view class="content">
		<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
		<!-- <scroll-view v-if="active == 0" scroll-y scroll-x style="width: 100vw;height:60vh;position: relative;" class="uni-mt-10">
			<view class="html-text-box" v-html="html"></view>
		</scroll-view> -->
		<iframe v-if="active == 0" frameborder="no" border="0" :srcdoc="html" style="width: 100vw;height:60vh;position: relative;" class="uni-mt-10">
			<!-- <view class="html-text-box" v-html="html"></view> -->
		</iframe>
		<view v-else class="uni-mt-10 download-box">
			<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
			<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
		</view>
		<view class=" flex flex-direction" style="padding: 50rpx 50rpx 0;" v-if="active == 0">
			<button class="cu-btn line-blue " @click="goToPage({ code: 'historyReportList' })">查看历史报告</button>
		</view>
		<uni-row :gutter="10" style="padding: 50rpx;text-align: center;">
			<uni-col :span="6"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
			<uni-col :span="6"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
			<uni-col :span="6"><button class="button" size="mini" type="primary" @click="$refs.popup.open('bottom')">跳转至</button></uni-col>
			<uni-col :span="6"><button class="button" size="mini" type="primary" @click="goToFirstPage">首 页</button></uni-col>
		</uni-row>
		<uni-popup ref="popup" background-color="#fff">
			<view class="header" style="text-align: center;margin: 20rpx auto;">跳转至</view>
			<view class="popup-content popup-height" style="display: flex;justify-content: space-between;">
				<view v-for="item in items" style="margin: 20rpx 20rpx;text-align: center;" @click="goToPage(item)">
					<image :src="item.img" style="width: 80rpx;height: 80rpx;"></image>
					<view>{{ item.name }}</view>
				</view>
			</view>
			<view class="padding flex flex-direction"><button class="cu-btn lg" @click="$refs.popup.close()">取 消</button></view>
		</uni-popup>
	</view>
</template>

<script>
import { zcxAPI, companyAPI } from 'api/index.js';
export default {
	data() {
		return {
			active: 0,
			stepList: [
				{
					title: '风险评价'
				},
				{
					title: '评价结果下载'
				}
			],
			html: '',
			items: [
				{ img: '/static/img/index/cwpl.png', code: 'cwpl', name: '财务排雷' },
				{ img: '/static/img/index/cyqypj.png', code: 'cyqyxypj', name: '产业企业评价' },
				{ img: '/static/img/index/qyxypj.png', code: 'qyxypj', name: '区域信用评价' },
				{ img: '/static/img/index/ctqypj.png', code: 'ctqyxypj', name: '城投企业评价' }
				// { img: '/static/img/index/xxzx.png', code: 'historyReportList', name: '历史报告' }
			],
			fileName:'',
			companyName:'',
		};
	},
	onLoad(options) {
		console.log(options);
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
		this.companyId = options.companyId;
		this.creditCode = options.creditCode;
		this.companyName = options.companyName;
		this.getRiskScreenHtml();
	},
	methods: {
		getRiskScreenHtml() {
			let param = {
				companyId: this.companyId,
				creditCode: this.creditCode,
				userId: uni.getStorageSync('userId')
			};
			zcxAPI.getRiskScreenHtml(param).then(res => {
				if(res.data.code&&res.data.code!='0'){
					this.html=JSON.stringify(res.data);
				
				}else{
				
					if(res.data.toString().lastIndexOf("{\"code\":\"0\"}")){
				
						this.html =  res.data.toString().replace("{\"code\":\"0\"}","").replace('class="page-content"','class="page-content" style="overflow:auto"');
					}
				
				}
				let temp = 'content-disposition'
				let data = res.header[temp];
				this.fileName = data.split('=')[1];
				
			});
		},
		preview() {
			if (this.active !== 0) this.active--;
		},
		next() {
			var flag =true;
			if (this.active == 0){
				if(this.fileName==''){
					flag =false;
				}
			}
			if(flag){
				if (this.active < this.stepList.length - 1) this.active++;
			}
			
		},
		goToPage(item) {
			uni.navigateTo({
				url: `/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}&pageFrom=风险初筛`
			});
		},
		goToFirstPage() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		download() {
			let param = {
				fileName: this.fileName,
			}
			var pdfname = this.fileName.replace(".html",".pdf");
									
			var url1='http://zibchina.com:9001/common/ZCX/downloadPDF/'+pdfname;
			
			if(typeof(cmp)  == 'function'){
				
				var toDownloadFileOptions = {
					path:url1,//文件下载地址
					filename:pdfname,//文件名称
					
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
					const content = res.data
					const blob = new Blob([content])
					const fileName = `风险初筛-${this.companyName}.pdf`
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
	}
};
</script>

<style scoped></style>

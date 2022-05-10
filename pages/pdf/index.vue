<template>
	<view class="content"><web-view :src="url"></web-view></view>
</template>


<script>
	import { companyAPI } from 'api/index.js';
	export default {
		data() {
			return {
				// pdf.js的viewer.htm所在路径
				// 注意：静态的html文件需要放在根路径下的 hybrid/html 文件夹中
				viewerUrl: '/static/pdfjs/web/viewer.html',
				// 要访问的pdf的路径
				fileUrl: 'https://www.gjtool.cn/pdfh5/git.pdf',
				// 最终显示在web-view中的路径
				url: '',
				
			};
			
		},
		onLoad(options) {
			
			var param={};
			if(options.isDownload){
				param={
					userId:uni.getStorageSync('userId'),
					noticeSerialno:options.noticeSerialno,
					reportbuyerno:options.reportbuyerno,
					reportcorpchnname:options.reportcorpchnname,
					reportcorpengname:options.reportcorpengname,
					updatetime:options.updatetime,
					isDownload:options.isDownload
				}
			}else{
				param = {
				  userId: uni.getStorageSync('userId'),
				  noticeSerialno:options.noticeSerialno
				}
			}
			
			
			companyAPI.getPDF(param).then(res => {
				
				const content = res.data
				const blob = new Blob([content], {
					type: 'application/pdf;chartset=UTF-8'
				})
				let fileURL = URL.createObjectURL(blob);
				this.fileUrl = fileURL;
				// h5，使用h5访问的时候记得跨域
				// #ifdef H5
				this.url = `${this.viewerUrl}?file=${encodeURIComponent(this.fileUrl)}`;
				// #endif
				
				// 在安卓和ios手机上
				// 判断是手机系统：安卓，使用pdf.js
				// #ifdef APP-PLUS
				if(plus.os.name === 'Android') {
					this.url = `${this.viewerUrl}?file=${encodeURIComponent(this.fileUrl)}`;
				}
				// ios，直接访问pdf所在路径
				else {
					this.url = encodeURIComponent(this.fileUrl);
				}
				// #endif
			})
			
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

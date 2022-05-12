<template>
	<view class="content">
		<uni-row>
			<uni-col :span="12">
				<uni-search-bar
					v-model="form.xcode"
					radius="100"
					placeholder="信保代码"
					clearButton="auto"
					cancelButton="none"
					@blur="confirm(1, $event)"
					@clear="confirm(1, $event)"
				/>
			</uni-col>
			<uni-col :span="12">
				<uni-search-bar
					v-model="form.companyName"
					radius="100"
					placeholder="公司名称"
					clearButton="auto"
					cancelButton="none"
					@blur="confirm(2, $event)"
					@clear="confirm(2, $event)"
				/>
			</uni-col>
		</uni-row>
		<view style="padding: 0 20rpx;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group :title="`信保代码：${item.reportbuyerno}`" mode="card" v-for="(item, index) in listData" :key="index">
				<view>中英文名称：{{item.reportcorpchnname}}/{{item.reportcorpengname}}</view>
				<view>PDF名称：{{ item.reportName }}</view>
				<view>更新时间：{{ item.updatetime }}</view>
				<view style="display: flex;justify-content: space-between;">
					<text>摘要时间：{{ item.getTime }}</text>
					<uni-icons type="more-filled" size="24" @click="item.showMenu = !item.showMenu"></uni-icons>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="预览" type="primary" style="margin-right: 10rpx;" @click="preview(item)"></uni-tag>
						<uni-tag text="下载" type="success" style="margin-right: 10rpx;" @click="downnload(item)"></uni-tag>
						<uni-tag text="摘要" type="warning" @click="checkDetail(item)"></uni-tag>
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
import { commonAPI,companyAPI } from 'api/index.js';
export default {
	data() {
		return {
			form: {
				xcode: '',
				companyName: ''
			},
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more' //more/loading/noMore，
		};
	},
	onLoad() {
		
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
			companyAPI.getPDFListAll({
				pageIndex:  this.currentPage,
				pageSize: this.pageSize,
				companyName: this.form.companyName,
                xcode: this.form.xcode
			})
			.then(res => {
				this.total=res.data.totalRecords;
				if (res.data.pdfList) {
					for (let i in res.data.pdfList) {
						res.data.pdfList[i].showMore=false;
						res.data.pdfList[i].showMenu=false;
						if(res.data.pdfList[i].reportbuyerno==null){
							res.data.pdfList[i].reportbuyerno='';
						}
					}
					this.loadStatus = 'more';
					this.listData = [...this.listData, ...res.data.pdfList];
				}
			})
		},
		confirm(type, e) {
			if (type == 1) {
				this.form.xcode = e.value;
			} else if (type == 2) {
				this.form.companyName = e.value;
			}
			this.currentPage = 1;
			this.listData = [];
			this.getData();
		},
		preview(item) {
			//预览pdf
			uni.navigateTo({
				url: '/pages/pdf/index?noticeSerialno='+item.reportName+'&reportbuyerno='+item.reportbuyerno+'&reportcorpchnname='+item.reportcorpengname+'&updatetime='+item.updatetime+'&isDownload=0'
			});
		},
		downnload(item) {
			var param={
				 
				userId:uni.getStorageSync('userId'),
				noticeSerialno:item.reportName,
				reportbuyerno:item.reportbuyerno,
				reportcorpchnname:item.reportcorpchnname,
				reportcorpengname:item.reportcorpengname,
				updatetime:item.updatetime,
				isDownload:"1"
			}
			
			
			var url1='http://zibchina.com:9001/api/common/ZXB/downloadPDF/'+item.reportName;	
			// alert(url1);
			// alert(typeof(cmp.att));
			
			if(typeof(cmp)  == 'function'){
				
				var toDownloadFileOptions = {
					path:url1,//文件下载地址
					filename:item.reportName,//文件名称
					
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
				companyAPI.getPDF(param).then(res => {
					
					const content = res.data
					const blob = new Blob([content])
					const fileName = item.reportName
					
					if ('download' in document.createElement('a')) { // 非IE下载
						const elink = document.createElement('a')
						elink.download = item.reportName
						elink.style.display = 'none'
						elink.href = URL.createObjectURL(blob)
						console.log(elink.href);
						document.body.appendChild(elink)
						elink.click()
						URL.revokeObjectURL(elink.href) // 释放URL 对象
						document.body.removeChild(elink)
					} else { // IE10+下载
						navigator.msSaveBlob(blob, item.reportName)
					}			
				})
			}
		},
		checkDetail(item) {
			//查看摘要信息
			uni.navigateTo({
				url: '/pages/detail/detail?reportcorpchnname='+item.reportcorpchnname+'&reportcorpengname='+item.reportcorpengname+'&reportbuyerno='+item.reportbuyerno
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
.content {
	color: #666666;
}
.select_down_ {
	border: 1px solid #e3e3e3;
	width: 300rpx;
	position: absolute;
}
</style>

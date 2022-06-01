<template>
	<view class="content">
		<view class="content">
			<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
			<view v-if="active == 0" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							所属行业
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<uni-data-picker
								ref="picker"
								placeholder="请选择"
								:localdata="dataTree"
								v-model="industry"
								:map="{ text: 'text', value: 'text' }"
								@change="onchange"
							></uni-data-picker>
							<view class="error-style" v-if="errMsg.industry != ''">{{ errMsg.industry }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							行政级别
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<picker :value="administrativeLevel" @change="changeAdministrativeLevel" :range="administrativeLevelOptions">
								<input 
								placeholder="请选择" 
								placeholder-style="color:#B5B5B5;" 
								name="input" 
								:value="administrativeLevel" 
								readonly 
								style="float:right" />
							</picker>
							<view class="error-style" v-if="errMsg.administrativeLevel != ''">{{ errMsg.administrativeLevel }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							区域名称
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<uni-data-picker
								ref="picker"
								placeholder="请选择"
								:localdata="areaDataTree"
								v-model="areaName"
								:map="{ text: 'areaName', value: 'areaCode' }"
								@change="changeArea"
							></uni-data-picker>
							<view class="error-style" v-if="errMsg.areaName != ''">{{ errMsg.areaName }}</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class=" flex flex-direction" style="padding: 50rpx 50rpx 0;" >
					<button class="cu-btn line-blue " @click="goToPage({ code: 'historyReportList' })">查看历史报告</button>
				</view>
			</view>
			<scroll-view scroll-y scroll-x v-else-if="active == 1" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item title="所属行业" :rightText="allIndustry.join('/')"></uni-list-item>
					<uni-list-item title="行政级别" :rightText="administrativeLevel"></uni-list-item>
					<uni-list-item title="所属区域" :rightText="allAreaName.join('/')"></uni-list-item>
				</uni-list>
				<uni-section title="区域定量指标" type="line">
					<uni-collapse>
						<uni-collapse-item v-for="item in areaIndexData" :key="item.year">
							<view slot="title" class="form-title" style="color: #007AFF;padding:10rpx 30rpx;font-weight: bold;">{{item.year}}</view>
							<uni-list>
								<uni-list-item title="城镇居民人均可支配收入（元）" :rightText="item.v12.toString()"></uni-list-item>
								<uni-list-item title="一般公共预算收入（亿元）" :rightText="item.v8.toString()"></uni-list-item>
								<uni-list-item title="税收收入（亿元）" :rightText="item.v15.toString()"></uni-list-item>
								<uni-list-item title="地方政府债务余额（亿元）" :rightText="item.v16.toString()"></uni-list-item>
								<uni-list-item title="地方政府PPP余额（亿元）" :rightText="item.v17.toString()"></uni-list-item>
								<uni-list-item title="一般公共预算支出（亿元）" :rightText="item.v14.toString()"></uni-list-item>
								<uni-list-item title="区域内公开发债城投企业有息债务余额（亿元）" :rightText="item.v18.toString()"></uni-list-item>
								<uni-list-item title=" GDP（亿元）" :rightText="item.v10.toString()"></uni-list-item>
							</uni-list>
						</uni-collapse-item>
					</uni-collapse>
				</uni-section>
				<uni-section title="区域调整项" type="line">
					<view style="padding: 0 30rpx;font-size: 26rpx;line-height: 54rpx;padding-bottom: 20rpx;">
						<uni-row style="color: #999;font-weight: bold;">
							<uni-col :span="4">名称</uni-col>
							<uni-col :span="8" style="text-align: center;">详情</uni-col>
							<uni-col :span="4" style="text-align: center;">影响</uni-col>
							<uni-col :span="4" style="text-align: center;">操作</uni-col>
							<uni-col :span="4" style="text-align: center;">来源</uni-col>
						</uni-row>
						<template v-if="adjustData.length>0">
							<uni-row v-for="(item, index) in adjustData" :key="index" >
								<uni-col :span="4">{{item.name||'-'}}</uni-col>
								<uni-col :span="8" style="text-align: center;">{{item.detail||'-'}}</uni-col>
								<uni-col :span="4" style="text-align: center;">{{item.influence||'-'}}</uni-col>
								<uni-col :span="4" style="text-align: center;color: #409eff;"><text class="uni-mr-2">忽略</text><text>恢复</text></uni-col>
								<uni-col :span="4" style="text-align: center;">{{item.source||'-'}}</uni-col>
							</uni-row>
						</template>
						<view v-else>暂无数据</view>
					</view>
				</uni-section>
			</scroll-view>
			<scroll-view v-else-if="active == 2" scroll-y scroll-x class="uni-mt-10 main-box"><text class="html-text-box" v-html="html"></text></scroll-view>
			<view v-else class="uni-mt-10 download-box">
				<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
				<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
			</view>
			<uni-row :gutter="10" style="padding: 50rpx;text-align: center;">
					<uni-col :span="6"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
					<uni-col :span="6"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
					<uni-col :span="6"><button class="button" size="mini" type="primary" @click="$refs.popup.open('bottom')">跳转至</button></uni-col>
					<uni-col :span="6"><button class="button" size="mini" type="primary" @click="goToFirstPage">首页</button></uni-col>
				</uni-row>
			</view>
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
import { zcxAPI } from 'api/index.js';
export default {
	data() {
		return {
			active: 0,
			stepList: [{ title: '选择区域' }, { title: '区域信息' }, { title: '区域信用评价报告' }, { title: '报告结果下载' }],
			html: '',
			companyId: '',
			companyName: '',
			creditCode: '',
			industry: '',
			allIndustry: [],
			administrativeLevel:'',
			administrativeLevelOptions:['省级','地市级','区县级'],
			areaName:'',
			allAreaName:[],
			dataTree: [],
			areaDataTree:[],
			errMsg: {
				administrativeLevel:'',
				areaName: ''
			},
			areaIndexData:[],
			adjustData:[
				{name:'非标风险事件',detail:'区域本级的城投企业未发生过非标风险事件',influence:'0',source:'系统'}
			],
			items: [
				{ img: '/static/img/index/fxcs.png', code: 'fxcs', name: '风险初筛' },
				{ img: '/static/img/index/cwpl.png', code: 'cwpl', name: '财务排雷' },
				{ img: '/static/img/index/cyqypj.png', code: 'cyqyxypj', name: '产业企业评价' },
				{ img: '/static/img/index/ctqypj.png', code: 'ctqyxypj', name: '城投企业评价' },
				// { img: '/static/img/index/xxzx.png', code: 'historyReportList', name: '历史报告' }
			],
			existFlag:true,
			professionDetail:'',
			fileName:'',
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
		this.companyId = options.companyId;
		this.companyName = options.companyName;
		this.creditCode = options.creditCode;
		this.getIndustry();
		this.getArea();
		this.reportExist();
	},
	watch:{
		administrativeLevel(val){
			console.log(val)
			if(val=='省级'){
				this.areaDataTree=this.formatAreaData(this.allAreaData)
			}else if(val=='地市级'){
				this.areaDataTree=this.allAreaData.map(item=>{
					return{
						areaCode:item.areaCode,
						areaName:item.areaName,
						children:item.children?this.formatAreaData(item.children):null
					}
				})
			}else{
				this.areaDataTree=this.allAreaData
			}
		}
	},
	methods: {
		formatAreaData(list){
			let arr = list.map(item=>{
				return{
					areaCode:item.areaCode,
					areaName:item.areaName
				}
			})
			return arr
		},
		getIndustry() {
			zcxAPI.getIndustry({}).then(res => {
				let obj = res.data.areaList;
				let list = [];
				for (let i in obj) {
					let tempObj = {};
					tempObj.text = ' ' + i;
					let children = obj[i].map(item => {
						return { text: item };
					});
					tempObj.children = children;
					list.push(tempObj);
				}
				console.log(list);
				this.dataTree = list;
			});
		},
		getArea(){
			zcxAPI.getArea({}).then(res => {
				this.allAreaData=res.data.areaList
			})
		},
		getRegionRatingHtml() {
			
			let param = {
				ver: "1.0",
				companyId: this.companyId,
				creditCode: this.creditCode,
				industry: this.industry,
				areaCode: this.areaName,
				level: this.administrativeLevel,
				type:this.administrativeLevel,		
				userId: uni.getStorageSync('userId').toString(),
			}
			
		
			zcxAPI.getRegionRatingHtml(param).then(res => {
				
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
		reportExist(){
			this.existFlag = true;
			
			zcxAPI.reportExist({
				creditCode:this.creditCode,
				reportType:'产业企业评价'
			}).then(res => {
				
				if (res.statusCode == 200) {
					this.existFlag = res.data.existFlag;
				}
			});
		},
		onchange(e) {
			let list = [];
			list.push();
			e.detail.value.map(item => {
				list.push(item.text);
			});
			this.allIndustry = list;
			//this.professionDetail = list[list.length - 1];
		},
		changeArea(e){
			console.log(e)
			let list = [];
			list.push();
			e.detail.value.map(item => {
				list.push(item.text);
			});
			this.allAreaName = list;
			this.errMsg.areaName = '';
		},
		changeAdministrativeLevel(e) {
			this.administrativeLevel = this.administrativeLevelOptions[e.detail.value];
			this.errMsg.administrativeLevel = '';
		},
		check() {
			let flag = true;
			if (this.industry == '') {
				this.errMsg.industry = '请选择所属行业';
				flag = false;
			}
			if (this.administrativeLevel == '') {
				this.errMsg.administrativeLevel = '请选择行政级别';
				flag = false;
			}
			console.log(this.areaName)
			if (this.areaName == '') {
				this.errMsg.areaName = '请选择区域名称';
				flag = false;
			}
			return flag;
		},
		preview() {
			if (this.active !== 0) this.active--;
		},
		next() {
			let flag = this.check();
			if (this.active == 2){
				if(this.fileName==''){
					flag =false;
				}
			}
			if (flag) {
				if(this.active==0){
					if(!this.existFlag){
						uni.showModal({
							title: '提示',
							content: '非常抱歉，第三方接口内无财报数据，无法生成对应报告！',
							showCancel: false,
							success: () => {
								
							}
						});
						
						return;
					}
				}
				if (this.active < this.stepList.length - 1) this.active++;
				if(this.active==1){
					this.getRegionInfo();
				}else if(this.active==2){
					this.getRegionRatingHtml();
				}
			}
		},
		getRegionInfo(){
			let param = {
				areaCode: this.areaName,
				companyId: this.companyId,
				creditCode: this.creditCode,
				industry:this.industry,
				level: this.administrativeLevel,
				type:this.administrativeLevel,
				userId: uni.getStorageSync('userId')
			}
			zcxAPI.getRegionInfo(param).then(res=>{
				console.log(res)
				if(res.data.code==0){
					if(res.data.regionInfo.data!==''){
						let json =JSON.parse(res.data.regionInfo.data)
						console.log(json)
						this.areaIndexData=json.values
					}
				}
			})
		},
		goToPage(item){
			uni.navigateTo({
				url:`/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}&pageFrom=区域信用评价`
			})
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
									
			var url1='http://zibchina.com:9001/api/company/ZCX/getPDF/'+pdfname;
			
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
					const fileName = `区域信用评价-${this.companyName}.pdf`
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

<style scoped>
.main-box {
	width: 100vw;
	height: 70vh;
	position: relative;
}
input {
	text-align: right;
}
::v-deep .placeholder {
	color: rgb(181, 181, 181);
}
::v-deep .input-value {
	border: none;
	line-height: 50rpx;
	padding: 0;
}
::v-deep .selected-list {
	flex-wrap: wrap;
	/* justify-content: flex-end; */
}
::v-deep .uni-data-tree {
	max-width: 65vw;
}
::v-deep .arrow-area {
	display: none;
}
::v-deep .uni-list-item__extra {
	text-align: right;
	flex: 1;
}
::v-deep .form-title {
	min-width: 120rpx;
}
</style>

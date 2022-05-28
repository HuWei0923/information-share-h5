<template>
	<view class="content">
		<view class="content">
			<view style="margin-top: 20rpx;">
				<uni-steps :options="stepList" :active="active" />
			</view>
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
							<uni-data-picker ref="picker" placeholder="请选择" :localdata="dataTree" v-model="industry"
								:map="{ text: 'text', value: 'text' }" @change="onchange"></uni-data-picker>
							<view class="error-style" v-if="errMsg.industry != ''">{{ errMsg.industry }}</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view slot="header" class="form-title">
							企业性质
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<picker :value="industryType" @change="changeIndustryType" :range="industryTypeOptions">
								<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input"
									:value="industryType" readonly style="float:right" />
							</picker>
							<view class="error-style" v-if="errMsg.industryType != ''">{{ errMsg.industryType }}</view>
						</view>
					</uni-list-item>
				</uni-list>
				<view class=" flex flex-direction" style="padding: 50rpx 50rpx 0;">
					<button class="cu-btn line-blue " @click="goToPage({ code: 'historyReportList' })">查看历史报告</button>
				</view>
			</view>
			<view v-else-if="active == 1" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item title="所属行业" :rightText="allIndustry.join('/')"></uni-list-item>
					<uni-list-item title="财报信息" rightText="数据取自近两年财报"></uni-list-item>
				</uni-list>
			</view>
			<view id="iframe-box" v-else-if="active == 2">
				<iframe id="ifram" frameborder="no" border="0" :srcdoc="html"
					style="width: 100vw;height:60vh;position: relative;overflow: auto;" class="uni-mt-10">
				</iframe>
			</view>
			<!-- <scroll-view v-else-if="active == 2" scroll-y scroll-x class="uni-mt-10 main-box">
				<view class="html-text-box" id="htmlDom" ref="htmlDom" v-html="html"></view></scroll-view> -->
			<view v-else class="uni-mt-10 download-box">
				<view class="download" @click="download">
					<uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons>
				</view>
				<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
			</view>
			<uni-row :gutter="10" style="padding: 50rpx;text-align: center;">
				<uni-col :span="6"><button @click="preview" type="primary" :disabled="active == 0"
						size="mini">上一步</button></uni-col>
				<uni-col :span="6"><button size="mini" @click="next" type="primary"
						:disabled="active == stepList.length - 1">下一步</button></uni-col>
				<uni-col :span="6"><button class="button" size="mini" type="primary"
						@click="$refs.popup.open('bottom')">跳转至</button></uni-col>
				<uni-col :span="6"><button class="button" size="mini" type="primary" @click="goToFirstPage">首页</button>
				</uni-col>
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
			<view class="padding flex flex-direction"><button class="cu-btn lg" @click="$refs.popup.close()">取
					消</button></view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		zcxAPI
	} from 'api/index.js';

	export default {
		data() {
			return {
				active: 0,
				stepList: [{
					title: '主体信息'
				}, {
					title: '财务信息'
				}, {
					title: '财务排雷报告'
				}, {
					title: '报告结果下载'
				}],
				html: '',
				companyId: '',
				companyName: '',
				creditCode: '',
				industry: '',
				allIndustry: [],
				industryType: '',
				dataTree: [],
				professionDetail: '',
				industryTypeOptions: ['中央国有企业', '国企非上市公司', '国企上市公司', '民企非上市公司', '民企上市公司'],
				errMsg: {
					industry: '',
					industryType: ''
				},
				items: [{
						img: '/static/img/index/fxcs.png',
						code: 'fxcs',
						name: '风险初筛'
					},
					{
						img: '/static/img/index/cyqypj.png',
						code: 'cyqyxypj',
						name: '产业企业评价'
					},
					{
						img: '/static/img/index/qyxypj.png',
						code: 'qyxypj',
						name: '区域信用评价'
					},
					{
						img: '/static/img/index/ctqypj.png',
						code: 'ctqyxypj',
						name: '城投企业评价'
					},
					// { img: '/static/img/index/xxzx.png', code: 'historyReportList', name: '历史报告' }
				],
				existFlag: true,
				fileName: '',
			};
		},
		onLoad(options) {
			console.log(options);
			this.companyId = options.companyId;
			this.companyName = options.companyName;
			this.creditCode = options.creditCode;
			this.getIndustry();
			this.reportExist();
		},
		onShow() {
			let ifram = document.getElementById('ifram');
			var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) 
			if (isiOS) {
				let iframe_box = document.getElementById('iframe-box');
				iframe_box.style.width = 100 + 'vw';
				iframe_box.style.overflowX = 'hidden';
				iframe_box.style.overflowY = 'scroll';
				iframe_box.style.webkitOverflowScrolling = 'touch';
				ifram.setAttribute('scrolling', 'no');
				iframe_box.appendChild(ifram)
			}
		},
		methods: {
			getIndustry() {
				zcxAPI.getIndustry({}).then(res => {
					let obj = res.data.areaList;
					let list = [];
					for (let i in obj) {
						let tempObj = {};
						tempObj.text = ' ' + i;
						let children = obj[i].map(item => {
							return {
								text: item
							};
						});
						tempObj.children = children;
						list.push(tempObj);
					}
					console.log(list);
					this.dataTree = list;
				});
			},
			reportExist() {
				this.existFlag = true;
				zcxAPI.reportExist({
					creditCode: this.creditCode,
					reportType: '财务排雷'
				}).then(res => {

					if (res.statusCode == 200) {
						this.existFlag = res.data.existFlag;
					}
				});
			},
			getRegionRatingHtml() {
				let param = {
					ver: "1.0",
					companyId: this.companyId,
					creditCode: this.creditCode,
					industry: this.professionDetail,
					nature: this.industryType,
					userId: uni.getStorageSync('userId').toString(),
				}
				// console.log(mock.html)
				// this.html =  mock.html.toString().replace("{\"code\":\"0\"}","").replace('class="page-content"','class="page-content" style="overflow:auto"');
				// let formStr = mock.html
				//  let regJs = ''
				//  formStr.replace(/<script.*?>([\s\S]+?)<\/script>/img, (_, js) => { // 正则匹配出script中的内容
				//          regJs = js
				//  })
				//  setTimeout(() => {
				//          let script = document.createElement('script');
				//          script.innerHTML = regJs
				// 		 console.log(this.$refs.htmlDom)
				// 		 console.log(document.getElementById('htmlDom'))
				//          document.getElementById('htmlDom').append(script)
				//  })

				zcxAPI.getLatestFinancialDeminingHtml(param).then(res => {
					this.html = res.data
					// if(res.data.code&&res.data.code!='0'){
					// 	this.html=JSON.stringify(res.data);

					// }else{

					// 	if(res.data.toString().lastIndexOf("{\"code\":\"0\"}")){

					// 		this.html =  res.data.toString().replace("{\"code\":\"0\"}","").replace('class="page-content"','class="page-content" style="overflow:auto"');
					// 	}

					// }
					let temp = 'content-disposition'
					let data = res.header[temp];
					this.fileName = data.split('=')[1];
				});
			},
			onchange(e) {
				let list = [];
				list.push();
				e.detail.value.map(item => {
					list.push(item.text);
				});
				this.allIndustry = list;
				this.professionDetail = list[list.length - 1];
				this.errMsg.industry = '';
			},
			changeIndustryType(e) {
				this.industryType = this.industryTypeOptions[e.detail.value];
				this.errMsg.industryType = '';
			},
			check() {
				let flag = true;
				if (this.industry == '') {
					this.errMsg.industry = '请选择所属行业';
					flag = false;
				}
				if (this.industryType == '') {
					this.errMsg.industryType = '请选择企业性质';
					flag = false;
				}



				return flag;
			},
			preview() {
				if (this.active !== 0) this.active--;
			},
			next() {
				let flag = this.check();


				if (flag) {
					if (this.active == 0) {
						if (!this.existFlag) {
							uni.showModal({
								title: '提示',
								content: '非常抱歉，第三方接口内无财报数据，无法生成对应报告！',
								showCancel: false,
								success: () => {

								}
							});

							return;
						}
					} else if (this.active == 1) {
						this.getRegionRatingHtml();
					}


					if (this.active < this.stepList.length - 1) this.active++;
				}
			},
			goToFirstPage() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			goToPage(item) {
				uni.navigateTo({
					url: `/pages/zcx/${item.code}?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.creditCode}&pageFrom=财务排雷`
				})
			},
			download() {
				let param = {
					fileName: this.fileName,
				}
				zcxAPI.getLiteRatingPDF(param).then(res => {
					const content = res.data
					const blob = new Blob([content])
					const fileName = `财务排雷-${this.companyName}.pdf`
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

<template>
	<view class="content">
		<view class="content">
			<view style="margin-top: 20rpx;"><uni-steps :options="stepList" :active="active" /></view>
			<view v-if="active == 0" class="uni-mt-10 main-box">
				<uni-list>
					<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
					<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
					<uni-list-item title="所属行业" rightText="城投"></uni-list-item>
					<uni-list-item title="财报信息" rightText="数据取自近两年财报"></uni-list-item>
					<!-- <uni-list-item>
						<view slot="header" class="form-title">
							行政级别
							<text class="required-s">*</text>
						</view>
						<view slot="footer">
							<picker :value="administrativeLevel" @change="changeAdministrativeLevel" :range="administrativeLevelOptions">
								<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="administrativeLevel" readonly style="float:right" />
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
					</uni-list-item> -->
				</uni-list>
			</view>
			<scroll-view scroll-y scroll-x v-else-if="active == 1" class="uni-mt-10 main-box">
				<uni-section title="选择区域" type="line">
					<uni-list>
						<uni-list-item>
							<view slot="header" class="form-title">
								行政级别
								<text class="required-s">*</text>
							</view>
							<view slot="footer">
								<picker :value="administrativeLevel" @change="changeAdministrativeLevel" :range="administrativeLevelOptions">
									<input placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="administrativeLevel" readonly style="float:right" />
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
				</uni-section>
				<uni-section title="区域定量指标" type="line">
					<uni-collapse >
						<uni-collapse-item v-for="item in areaIndexData" :key="item.year">
							<view slot="title" class="form-title" style="color: #007AFF;padding:10rpx 30rpx;font-weight: bold;">{{ item.year }}</view>
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
						<template v-if="adjustData.length > 0">
							<uni-row v-for="(item, index) in adjustData" :key="index">
								<uni-col :span="4">{{ item.name || '-' }}</uni-col>
								<uni-col :span="8" style="text-align: center;">{{ item.detail || '-' }}</uni-col>
								<uni-col :span="4" style="text-align: center;">{{ item.influence || '-' }}</uni-col>
								<uni-col :span="4" style="text-align: center;color: #409eff;">
									<text class="uni-mr-2">忽略</text>
									<text>恢复</text>
								</uni-col>
								<uni-col :span="4" style="text-align: center;">{{ item.source || '-' }}</uni-col>
							</uni-row>
						</template>
						<view v-else>暂无数据</view>
					</view>
				</uni-section>
				<uni-section title="其他信息" type="line">
					<view style="padding-left:30rpx">该企业是否区域内最重要城投企业
					<uni-data-checkbox v-model="ifImportant" :localdata="options"></uni-data-checkbox>
					</view>
				</uni-section>
			</scroll-view>
			<scroll-view v-else-if="active == 2" scroll-y scroll-x class="uni-mt-10 main-box"><text class="html-text-box" v-html="html"></text></scroll-view>
			<view v-else class="uni-mt-10 download-box">
				<view class="download" @click="download"><uni-icons type="pulldown" size="60" color="#B7BDC6"></uni-icons></view>
				<view style="color: #B7BDC6;" class="uni-mt-5">报告下载</view>
			</view>
			<uni-row :gutter="10" style="padding: 50rpx 150rpx;text-align: center;">
				<uni-col :span="12"><button @click="preview" type="primary" :disabled="active == 0" size="mini">上一步</button></uni-col>
				<uni-col :span="12"><button size="mini" @click="next" type="primary" :disabled="active == stepList.length - 1">下一步</button></uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
import { zcxAPI } from 'api/index.js';
export default {
	data() {
		return {
			active: 0,
			stepList: [{ title: '财务信息' }, { title: '非财务信息' }, { title: '信用评价' }, { title: '评价结果下载' }],
			html: '',
			companyId: '',
			companyName: '',
			creditCode: '',
			industry: '',
			allIndustry: [],
			administrativeLevel: '',
			administrativeLevelOptions: ['省级', '地市级', '区县级'],
			areaName: '',
			allAreaName: [],
			dataTree: [],
			areaDataTree: [],
			errMsg: {
				administrativeLevel: '',
				areaName: ''
			},
			areaIndexData: [],
			ifImportant:0,
			options:[{text:'是',value:0},{text:'否',value:1}],
			adjustData: [{ name: '非标风险事件', detail: '区域本级的城投企业未发生过非标风险事件', influence: '0', source: '系统' }]
		};
	},
	onLoad(options) {
		this.companyId = options.companyId;
		this.companyName = options.companyName;
		this.creditCode = options.creditCode;
		this.getIndustry();
		this.getArea();
	},
	watch: {
		administrativeLevel(val) {
			console.log(val);
			if (val == '省级') {
				this.areaDataTree = this.formatAreaData(this.allAreaData);
			} else if (val == '地市级') {
				this.areaDataTree = this.allAreaData.map(item => {
					return {
						areaCode: item.areaCode,
						areaName: item.areaName,
						children: item.children ? this.formatAreaData(item.children) : null
					};
				});
			} else {
				this.areaDataTree = this.allAreaData;
			}
		},
		areaName(){
			this.getRegionInfo()
		},
	},
	methods: {
		formatAreaData(list) {
			let arr = list.map(item => {
				return {
					areaCode: item.areaCode,
					areaName: item.areaName
				};
			});
			return arr;
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
		getArea() {
			zcxAPI.getArea({}).then(res => {
				this.allAreaData = res.data.areaList;
			});
		},
		onchange(e) {
			let list = [];
			list.push();
			e.detail.value.map(item => {
				list.push(item.text);
			});
			this.allIndustry = list;
		},
		changeArea(e) {
			console.log(e);
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
			if (this.administrativeLevel == '') {
				this.errMsg.administrativeLevel = '请选择行政级别';
				flag = false;
			}
			console.log(this.areaName);
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
			if(this.active==1){
				let flag = this.check();
				if(!flag) return 
			}
			if (this.active < this.stepList.length - 1) this.active++;
		},
		getRegionInfo() {
			let param = {
				areaCode: this.areaName,
				companyId: this.companyId,
				creditCode: this.creditCode,
				industry: this.industry,
				level: this.administrativeLevel,
				type: this.administrativeLevel,
				userId: uni.getStorageSync('userId')
			};
			zcxAPI.getRegionInfo(param).then(res => {
				if (res.data.code == 0) {
					if (res.data.regionInfo.data !== '') {
						let json = JSON.parse(res.data.regionInfo.data);
						console.log(json);
						this.areaIndexData = json.values;
					}
				}
			});
		}
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

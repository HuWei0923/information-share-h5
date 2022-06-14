<template>
	<view class="content">
		<uni-list>
			<uni-list-item title="企业名称" :rightText="companyName"></uni-list-item>
			<uni-list-item title="统一社会信用代码/注册码" :rightText="creditCode"></uni-list-item>
			<uni-list-item title="企业类型">
				<view slot="footer">
					<uni-data-picker
						ref="picker"
						placeholder="请选择"
						:localdata="dataTree"
						v-model="enterpriseType"
						:map="{ text: 'text', value: 'text' }"
						@change="onchange"
					></uni-data-picker>
				</view>
			</uni-list-item>
			<uni-list-item title="行政级别">
				<view slot="footer">
					<picker :value="administrativeLevel" @change="changeAdministrativeLevel" :range="administrativeLevelOptions">
						<input disabled="true" placeholder="请选择" placeholder-style="color:#B5B5B5;" name="input" :value="administrativeLevel" readonly style="float:right" />
					</picker>
					<view class="error-style" v-if="errMsg.administrativeLevel != ''">{{ errMsg.administrativeLevel }}</view>
				</view>
			</uni-list-item>
			<uni-list-item title="区域名称">
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
		<view style="color: orange;font-size: 24rpx;padding: 20rpx;">* 如果企业类型为城投企业，则行政级别和区域名称必填</view>
		<view class="flex flex-direction" style="margin-top:100rpx;padding:20px">
			<button class="cu-btn lg round text-white bg-blue"  @click="attention" >关 注</button>
		</view>
	</view>
</template>

<script>
import { zcxAPI } from 'api/index.js';
export default {
	data() {
		return {
			companyId: '',
			companyName: '',
			creditCode: '',
			allIndustry: [],
			administrativeLevel: '',
			administrativeLevelOptions: ['省级', '地市级', '区县级'],
			areaName: '',
			allAreaName: [],
			dataTree: [{text:'非城投企业'},{text:'城投企业'}],
			areaDataTree:[],
			industry: '',
			enterpriseType:'',
			errMsg: {
				administrativeLevel: '',
				areaName: ''
			}
		};
	},
	onLoad(options) {
		this.companyId = options.companyId;
		this.companyName = options.companyName;
		this.creditCode = options.creditCode;
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
		}
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
		getArea() {
			zcxAPI.getArea({}).then(res => {
				this.allAreaData = res.data.areaList;
			});
		},
		onchange(e) {
			this.enterpriseType=e.detail.value[0].value
		},
		changeArea(e){
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
			this.areaName=''
			this.errMsg.administrativeLevel = '';
		},
		check(){
			let flag=true
			console.log(this.enterpriseType)
			if(this.enterpriseType=='城投企业'){
				if(this.administrativeLevel==''){
					this.errMsg.administrativeLevel = '请选择行政级别';
					flag = false;
				}
				if (this.areaName == '') {
					this.errMsg.areaName = '请选择区域名称';
					flag = false;
				}
				return flag;
			}
		},
		attention(){
			let flag=this.check()
			if(flag){
				let param = {
					userId: uni.getStorageSync('userId'),
					companyId: this.companyId,
					code:this.creditCode,
					entName: this.companyName,
					entType: this.form.entType,
					areaLevel: this.form.areaLevel,
					provinceCode: this.form.provinceCode,
					provinceName: this.form.provinceCode !== '' ? this.provinceOptions.find(item => item.areaCode == this.form.provinceCode).areaName : '',
					cityCode: this.form.cityCode,
					cityName: this.form.cityCode !== '' ? this.cityOptions.find(item => item.areaCode == this.form.cityCode).areaName : '',
					countyCode: this.form.countyCode,
					countyName: this.form.countyCode !== '' ? this.countyOptions.find(item => item.areaCode == this.form.countyCode).areaName : '',
					tianyancha: '1'
				}
				userAPI.careOrNot(param).then(res=>{
					console.log(res);
					if (res.data.code == 0) {
						
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false,
							success: () => {
								
							}
						});
						uni.navigateBack();
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							showCancel: false,
							success: () => {
								
							}
						});
					}
				})
				
			}
		}
	}
};
</script>

<style scoped>
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

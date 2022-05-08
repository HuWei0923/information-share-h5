<template>
	<view style="background-color: #f8f8f8;">
		<uni-section title="信保基本信息" type="line">
			<uni-list>
				<uni-list-item title="企业中文名称" :rightText="businessInfo.buyerchnName" />
				<uni-list-item title="企业英文名称" :rightText="businessInfo.buyerengName" />
				<uni-list-item title="报告编号" :rightText="businessInfo.reportNo" />
				<uni-list-item title="注册时间" :rightText="businessInfo.dateRegistered" />
				<uni-list-item title="经营状态" :rightText="businessInfo.operationStatus" />
				<uni-list-item title="信保代码" :rightText="businessInfo.sinosureBuyerno" />
				<uni-list-item title="注册资本" :rightText="businessInfo.registerCapital" />
				<uni-list-item title="注册地址" :rightText="businessInfo.registerAddr" />
				<uni-list-item title="母公司" :rightText="businessInfo.parent" />
				<uni-list-item title="生产现状" :rightText="businessInfo.productionCapacity" />
				<uni-list-item title="经营地类型" :rightText="businessInfo.locationType" />
				<uni-list-item title="采购地区" :rightText="businessInfo.purchasingArea" />
				<uni-list-item title="所属行业" :rightText="businessInfo.industName" />
				<uni-list-item title="主营业务" :rightText="businessInfo.products" />
				<uni-list-item title="报告获取时间" :rightText="businessInfo.updateTime" />
			</uni-list>
		</uni-section>
		<uni-section title="背景规模" type="line">
			<uni-list>
				<uni-list-item title="成立年限" :rightText="businessInfo.gisterYear" />
				<uni-list-item title="员工人数" :rightText="businessInfo.employeeNum" />
				<uni-list-item title="分支雇员数" :rightText="businessInfo.branchEmployeeNum" />
				<uni-list-item title="上市公司" :rightText="businessInfo.listedFlag" />
				<uni-list-item title="主要股票交易所" :rightText="businessInfo.tockexChange" />
			</uni-list>
		</uni-section>
		<uni-section title="持股信息" type="line">
			<view style="padding: 0 30rpx;font-size: 26rpx;line-height: 54rpx;padding-bottom: 20rpx;">
				<uni-row style="color: #999;font-weight: bold;">
					<uni-col :span="9">股东名称</uni-col>
					<uni-col :span="5" style="text-align: center;">持股比例</uni-col>
					<uni-col :span="5" style="text-align: center;">持股金额</uni-col>
					<uni-col :span="5" style="text-align: center;">币种</uni-col>
				</uni-row>
				<template v-if="shareInfo.length>0">
					<uni-row v-for="(item, index) in shareInfo" :key="index" >
						<uni-col :span="9">{{ item.name }}</uni-col>
						<uni-col :span="5" style="text-align: center;">{{ item.ratio }}</uni-col>
						<uni-col :span="5" style="text-align: center;">{{ item.valueHold }}</uni-col>
						<uni-col :span="5" style="text-align: center;">人民币</uni-col>
					</uni-row>
				</template>
				<view v-else>暂无数据</view>
			</view>
		</uni-section>
		<uni-section title="信保报告列表" type="line">
			<view style="padding: 0 30rpx;font-size: 26rpx;line-height: 54rpx;padding-bottom: 20rpx;">
				<uni-row style="color: #999;font-weight: bold;">
					<uni-col :span="15">报告</uni-col>
					<uni-col :span="9" >更新时间</uni-col>
				</uni-row>
				<template v-if="pdfList.length>0">
					<uni-row v-for="(item, index) in pdfList" :key="index" >
						<uni-col :span="15" style="color:#409eff">{{ item.noticeSerialno }}</uni-col>
						<uni-col :span="9" >{{ item.updateTime }}</uni-col>
					</uni-row>
				</template>
				<view v-else>暂无数据</view>
			</view>
		</uni-section>
	</view>
</template>

<script>
import { commonAPI,companyAPI } from 'api/index.js';
export default {
	data() {
		return {
			businessInfo: {
				
			},
			shareInfo:[
				{
					name:'',
					ratio:'',
					valueHold:'',
				}
			],
			pdfList:[
				{
					noticeSerialno:'',
					updateTime:'',
				}
			],
			reportcorpchnname:'',
			reportcorpengname:'',
			reportbuyerno:'',
			
		};
	},
	onLoad(options) {
		if(options){
			this.reportcorpchnname=options.reportcorpchnname;
			this.reportcorpengname=options.reportcorpengname;
			this.reportbuyerno=options.reportbuyerno;
			this.getNationCode();
		}
	},
	methods: {
		getNationCode() {
			companyAPI.getAllBusinessInfo({
				userId: uni.getStorageSync('userId'),
				reportcorpchnname:this.reportcorpchnname,
				reportcorpengname:this.reportcorpengname,
				reportbuyerno:this.reportbuyerno
			})
			.then(res => {
				if (res.data.code == 0) {
					this.businessInfo = res.data.businessInfo;
					this.shareInfo = res.data.shareList;
					this.pdfList = res.data.pdfList;;
				}
			})
		}
	}
};
</script>

<style scoped>
	::v-deep .uni-list-item__extra{
		text-align: right;
	}
	::v-deep .uni-list-item__content{
		min-width: 25vw;
	}
</style>

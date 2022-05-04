<template>
	<view style="background-color: #f8f8f8;">
		<uni-section title="信保基本信息" type="line">
			<uni-list>
				<uni-list-item title="企业中文名称" :rightText="detail.nameC" />
				<uni-list-item title="企业英文名称" :rightText="detail.nameE" />
				<uni-list-item title="报告编号" :rightText="detail.no" />
				<uni-list-item title="注册时间" :rightText="detail.createTime" />
				<uni-list-item title="经营状态" :rightText="detail.status" />
				<uni-list-item title="正常经营" :rightText="detail.ifNormal" />
				<uni-list-item title="信保代码" :rightText="detail.code" />
				<uni-list-item title="注册资本" :rightText="detail.capital" />
				<uni-list-item title="注册地址" :rightText="detail.address" />
				<uni-list-item title="母公司" :rightText="detail.parentCompany" />
			</uni-list>
		</uni-section>
		<uni-section title="背景规模" type="line">
			<uni-list>
				<uni-list-item title="成立年限" :rightText="detail.year" />
				<uni-list-item title="员工人数" :rightText="detail.number" />
				<uni-list-item title="分支雇员数" :rightText="detail.branchNumber" />
				<uni-list-item title="上市公司" :rightText="detail.company" />
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
				<template v-if="detail.stockInfo.length>0">
					<uni-row v-for="(item, index) in detail.stockInfo" :key="index" >
						<uni-col :span="9">{{ item.name }}</uni-col>
						<uni-col :span="5" style="text-align: center;">{{ item.rate }}</uni-col>
						<uni-col :span="5" style="text-align: center;">{{ item.money }}</uni-col>
						<uni-col :span="5" style="text-align: center;">{{ item.type }}</uni-col>
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
				<template v-if="detail.reportList.length>0">
					<uni-row v-for="(item, index) in detail.reportList" :key="index" >
						<uni-col :span="15" style="color:#409eff">{{ item.name }}</uni-col>
						<uni-col :span="9" >{{ item.updateTime }}</uni-col>
					</uni-row>
				</template>
				<view v-else>暂无数据</view>
			</view>
		</uni-section>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {
				nameC: '苏州腾讯有限公司',
				nameE: 'SUZHOUTENGXUN032541',
				no: '3242553442665435',
				createTime: '1987-08-15',
				status: '存续',
				ifNormal: '是',
				code: '93775859430w9853X',
				capital: '',
				address: '',
				parentCompany: 'NZL22485',
				year: '35年',
				number: '3045',
				branchNumber: '2000',
				company: '未维护',
				stockInfo: [{ name: 'Robent BriBoo', rate: '30%', money: '300', type: '美元' }, { name: 'Robent BriBoo', rate: '30%', money: '300', type: '美元' }],
				reportList:[{name:'032656.pdf',updateTime:'2022-0418 21:17:16'}]
			}
		};
	},
	methods: {}
};
</script>

<style></style>

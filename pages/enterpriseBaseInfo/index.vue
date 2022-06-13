<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt" style="background-color: rgba(239,239,239,0.5);">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#007aff"
				@clickItem="onClickItem"></uni-segmented-control>
		</view>
		<view v-if="current==0">
			<uni-list>
				<uni-list-item title="公司名称" :rightText="baseInfo.name" />
				<uni-list-item title="统一社会信用代码" :rightText="baseInfo.creditCode" />
				<uni-list-item title="公司类型" :rightText="baseInfo.companyorgtype" />
				<uni-list-item title="行业" :rightText="baseInfo.industry" />
				<uni-list-item title="注册地址" :rightText="baseInfo.reglocation" />
				<uni-list-item title="注册资本" :rightText="baseInfo.regcapital" />
				<uni-list-item title="企业法人" :rightText="baseInfo.legalPersonName" />
				<uni-list-item title="成立时间" :rightText="baseInfo.estiblishtime" />
				<uni-list-item title="登记开始时间" :rightText="baseInfo.fromTime" />
				<uni-list-item title="登记结束时间" :rightText="baseInfo.toTime" />
			</uni-list>
		</view>
	</view>
</template>

<script>
	import {
		userAPI
	} from '@/api/index.js';
	export default {
		data() {
			return {
				current: 0,
				items: ['基本信息', '工商舆情'],
				companyId:'',
				companyName:'',
				baseInfo:{}
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({
			    title:`企业信息-${options.title}`
			});
			this.companyName=options.companyName
			// this.companyId=options.companyId
			this.getData()
		},
		onShow(){
			
		},
		methods: {
			
			getData(){
				let param = {
					companyId:this.companyId,
					companyName:this.companyName,
					userId: uni.getStorageSync('userId')
				}
				new Promise(resolve=>{
					userAPI.getCompanyInfoByName(param).then(res=>{
						if(res.data.code=='0'){
							this.companyId=res.data.company.companyId
						}
					})
					resolve()
				}).then(()=>{
					userAPI.getBaseInfo(param).then(res=>{
						if(res.data.code=='0'){
							this.baseInfo=res.data.baseInfo
						}
					})
				})
			},
			onClickItem(e) {
				this.current = e.currentIndex;
			},
		}
	}
</script>

<style scoped>
::v-deep .uni-list-item__content{
		min-width: 25vw;
	}
</style>

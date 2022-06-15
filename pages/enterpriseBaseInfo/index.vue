<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt" style="background-color: rgba(239,239,239,0.5);">
			<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#007aff"
				@clickItem="onClickItem"></uni-segmented-control>
		</view>
		<view v-if="current==0">
			<view style="display: flex;margin: 10rpx 0">
				<view class="attention-s" @click="cancleZCXFoucus"  style="color: #efefef;background-color: #409eff;" v-if="careStatus.zhongchengxin=='1'">
					<uni-icons type="star-filled" size="20" class="icon-s" color="#fff"></uni-icons>取消关注（数据源：中诚信）
				</view>
				<view class="attention-s" @click="attentZCX" v-else >
					<uni-icons type="star" size="20" class="icon-s" color="#898989"></uni-icons>关注（数据源：中诚信）
				</view>
				<view class="attention-s" @click="cancleTYCFoucus" style="color: #efefef;background-color: #409eff;" v-if="careStatus.tianyancha=='1'">
					<uni-icons type="star-filled" size="20" class="icon-s" color="#fff"></uni-icons>取消关注（数据源：天眼查）
				</view>
				<view class="attention-s" @click="goTYCFocus" v-else>
					<uni-icons type="star" size="20" class="icon-s" color="#898989"></uni-icons>关注（数据源：天眼查）
				</view>
			</view>
			
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
				items: [],
				companyId:'',
				companyName:'',
				baseInfo:{},
				careStatus:{},
				title:''
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({
			    title:`企业信息-${options.title}`
			});
			
			this.items=options.title=='关注清单'?['基本信息', '工商舆情']:[`基本信息【${options.title}】`, '工商舆情']
			this.companyName=options.companyName
			// this.companyId=options.companyId
			this.getData()
		},
		onShow(){
			if(this.companyId!=''){
				this.getCareStatus(this.companyId)
			}
		},
		methods: {
			getCareStatus(companyId){
				let param = {
					companyId:companyId,
					userId: uni.getStorageSync('userId')
				}
				userAPI.getCareStatus(param).then(res=>{
					if(res.data.code=='0'){
						this.careStatus=res.data.careStatus?JSON.parse(res.data.careStatus):[],
						console.log(this.careStatus)
					}
				})
			},
			getData(){
				let param = {
					companyName:this.companyName,
					userId: uni.getStorageSync('userId')
				}
				new Promise(resolve=>{
					userAPI.getCompanyInfoByName(param).then(res=>{
						if(res.data.code=='0'){
							resolve(res.data.company?res.data.company.companyId:'')
						}
					})
				}).then((companyId)=>{
					console.log(companyId)
					this.companyId=companyId
					param.companyId=companyId
					this.getCareStatus(companyId)
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
			attentZCX(){
				uni.navigateTo({
					url:`/pages/attentionList/attentionZCX?companyId=${this.companyId}&companyName=${this.companyName}&creditCode=${this.baseInfo.creditCode}`
				})
			},
			cancleZCXFoucus () {
			//取消关注
				let param = {
					userId: uni.getStorageSync('userId'),
					companyId: this.companyId,
					zhongchengxin: '0'
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
						this.getData()
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
			},
			cancleTYCFoucus () {
				let param = {
					userId: uni.getStorageSync('userId'),
					companyId: this.companyId,
					tianyancha: '0'
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
						this.getData()
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
			},
			goTYCFocus () {
				let param = {
					userId: uni.getStorageSync('userId'),
					companyId: this.companyId,
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
						this.getData()
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
</script>

<style scoped>
::v-deep .uni-list-item__content{
		min-width: 25vw;
	}
	.attention-s{
		background-color: #e3e3e3;
		color: #898989;
		padding:10rpx ;
		border-radius: 5px;
		font-size: 24rpx;
		margin-right: 8rpx;
		box-shadow: #e3e3e3 0 0 10rpx;
	}
	.icon-s{
		vertical-align: bottom;
		margin-right: 6rpx;
	}
</style>

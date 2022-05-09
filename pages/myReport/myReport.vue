<template>
	<view class="content">
		<uni-row :gutter="20" style="padding: 0 20rpx;">
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.xcode" placeholder="信保代码"></uni-easyinput></uni-col>
			<uni-col :span="8"><uni-combox class="uni-mt-5" :candidates="candidates" placeholder="审批标识" v-model="form.approve"></uni-combox></uni-col>
			<uni-col :span="8"><uni-easyinput class="uni-mt-5" trim="all" v-model="form.companyName" placeholder="中/英文名称"></uni-easyinput></uni-col>
		</uni-row>
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group :title="`信保代码：${item.reportbuyerno}`" mode="card" v-for="(item, index) in listData" :key="index">
				<view style="position: relative;line-height: 48rpx;">
					<view>中英文名称： {{item.reportcorpchnname}}/{{item.reportcorpengname}}</view>
					<view>
						审批标识：
						<text>
							<uni-tag text="待审核" inverted type="primary" v-if="item.approveCode == 2"></uni-tag>
							<uni-tag text="通过" inverted type="success" v-else-if="item.approveCode == 1"></uni-tag>
							<uni-tag text="不通过" inverted type="error" v-else-if="item.approveCode == 999"></uni-tag>
						</text>
					</view>
					<uni-transition mode-class="fade" :duration="200" :show="item.showMore">
						<view>审核人：{{item.approveby}}</view>
						<text>审核时间：{{ item.approveDate }}</text>
						<view>填报时间：{{ item.tbtime }}</view>
						<view>中信保反馈：{{ item.zxbresults }}</view>
						<view>更新时间：{{ item.updatetime }}</view>
						<view>摘要时间：{{ item.getTime }}</view>
					</uni-transition>
					<view class="btn-box">
						<uni-icons :type="item.showMore?'top':'bottom'" size="20" style="margin-right: 20rpx;" @click="item.showMore = !item.showMore"></uni-icons>
						<uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons>
					</view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag :disabled="item.updatetime == '暂无报告'" text="预览" type="primary" style="margin-right: 10rpx;" @click="preview(item)"></uni-tag>
						<uni-tag :disabled="item.updatetime == '暂无报告'" text="下载" type="success" style="margin-right: 10rpx;"></uni-tag>
						<uni-tag :disabled="item.updatetime == '暂无报告'" text="摘要" type="warning" @click="checkDetail(item)"></uni-tag>
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
				companyName: '',
				approve:''
			},
			listData: [],
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loadStatus: 'more' ,//more/loading/noMore，
			candidates:['通过','不通过','待审核','异常']
		};
	},
	watch:{
		form:{
			handler(val){
				console.log(val)
				this.currentPage = 1;
				this.listData = [];
				this.getData();
			},
			deep:true
		}
	},
	onLoad() {
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
			// let tempData = [
			// 	{ code: 'SUZHOUTENGXUN032541', name: '/ALEMBIC', flag: 0, reportTime: '2022-04-12', auditTime: '',showMore: false,  showMenu: false },
			// 	{ code: 'SUZHOUTENGXUN032541', name: '/TOVARIS', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMore: false, showMore: false, showMenu: false },
			// 	{ code: 'SUZHOUTENGXUN032541', name: '/NHAT NG', flag: 2, reportTime: '2022-04-12', auditTime: '2022-04-12', showMore: false, showMenu: false },
			// 	{ code: 'SUZHOUTENGXUN032541', name: '/REAL CH', flag: 0, reportTime: '2022-04-12', auditTime: '', showMore: false, showMenu: false },
			// 	{ code: 'SUZHOUTENGXUN032541', name: '杭州甲康', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMore: false, showMenu: false }
			// ];
			// this.loadStatus = 'loading';
			// setTimeout(() => {
			// 	this.loadStatus = 'more';
			// 	this.listData = [...this.listData, ...tempData];
			// }, 1000);
			
			companyAPI.getApplyProgressList({
				pageIndex:  this.currentPage,
				pageSize: this.pageSize,
				companyName: this.form.companyName,
				xcode: this.form.xcode,
				approve:this.form.approve,
				userName: uni.getStorageSync('userCode')
			})
			.then(res => {
				
				this.total=res.data.totalRecords;
				if (res.data.zhongXinBaoApplyProgressList) {
					for (let i in res.data.zhongXinBaoApplyProgressList) {
						res.data.zhongXinBaoApplyProgressList[i].showMore=false;
						res.data.zhongXinBaoApplyProgressList[i].showMenu=false;
						if(res.data.zhongXinBaoApplyProgressList[i].reportbuyerno==null){
							res.data.zhongXinBaoApplyProgressList[i].reportbuyerno='';
						}
					}
				}
				
				setTimeout(() => {
					this.loadStatus = 'more';
					this.listData = [...this.listData, ...res.data.zhongXinBaoApplyProgressList];
				}, 1000);
			})
		},
		preview(item) {
			//预览pdf
			uni.navigateTo({
				url: '/pages/pdf/index'
			});
		},
		checkDetail(item) {
			//查看摘要信息
			uni.navigateTo({
				url: '/pages/detail/detail?reportcorpchnname='+item.reportcorpchnname+'&reportcorpengname='+item.reportcorpengname+'&reportbuyerno='+item.reportbuyerno
			});
		}
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
.btn-box {
	position: absolute;
	bottom: 0;
	right: 0;
}
::v-deep .uni-combox__input-plac {
	font-size: 24rpx;
	font-weight: 200;
}
</style>

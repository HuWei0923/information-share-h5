<template>
	<view class="content">
		<uni-row :gutter="20" style="padding: 0 20rpx;">
			<uni-col :span="8"  >
				<uni-easyinput class="uni-mt-5"  trim="all" v-model="form.code" placeholder="信保代码"></uni-easyinput>
			</uni-col>
			<uni-col :span="8">
				<uni-combox class="uni-mt-5" :candidates="candidates" placeholder="审批标识" v-model="form.flag"></uni-combox>
			</uni-col>
			<uni-col :span="8">
				<uni-easyinput class="uni-mt-5" trim="all" v-model="form.reporter" placeholder="填报人" ></uni-easyinput>
			</uni-col>
			<uni-col :span="8">
				<uni-easyinput class="uni-mt-5" trim="all" v-model="form.audit" placeholder="审批人"></uni-easyinput>
			</uni-col>
			<uni-col :span="8">
				<uni-easyinput class="uni-mt-5" trim="all" v-model="form.name" placeholder="中/英文名称"></uni-easyinput>
			</uni-col>
		</uni-row>
		<view style="padding: 10rpx 20rpx 0;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group mode="card" v-for="(item, index) in listData" :key="index" >
				<view slot="title" class="card-title">
					<text>信保代码：{{ item.code }}</text>
					<uni-tag text="紧急" type="error" v-if="item.emergency == 0"></uni-tag>
				</view>
				<view style="position: relative;line-height: 48rpx;">
					<view>中英文名称：{{ item.name }}</view>
					<view>
						审批标识：
						<text>
							<uni-tag text="待审核" inverted type="primary" v-if="item.flag == 0"></uni-tag>
							<uni-tag text="通过" inverted type="success" v-else-if="item.flag == 1"></uni-tag>
							<uni-tag text="不通过" inverted type="error" v-else-if="item.flag == 2"></uni-tag>
						</text>
					</view>
					<uni-transition mode-class="fade" :duration="200" :show="item.showMore">
						<view>统一社会信用代码：</view>
						<view>是否导读：</view>
						<view>审批结果：</view>
						<view>填报人：</view>
						<view>填报时间：{{ item.reportTime }}</view>
						<view>审核人：</view>
						<text>审核时间：{{ item.auditTime }}</text>
					</uni-transition>
					<view class="btn-box">
						<uni-icons :type="item.showMore?'top':'bottom'" size="20" style="margin-right: 20rpx;" @click="item.showMore = !item.showMore"></uni-icons>
						<uni-icons type="more-filled" size="20" @click="item.showMenu = !item.showMenu"></uni-icons>
					</view>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="通过" type="primary" style="margin-right: 10rpx;"></uni-tag>
						<uni-tag text="不通过" type="error"></uni-tag>
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
export default {
	data() {
		return {
			form: {
				code: '',
				name: '',
				flag:'',
				reporter:'',
				audit:''
			},
			listData: [],
			currentPage: 1,
			pageSize: 5,
			total: 23,
			loadStatus: 'more' ,//more/loading/noMore，
			candidates:['是','否']
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
			let tempData = [
				{ code: 'SUZHOUTENGXUN032541', name: '/ALEMBIC', flag: 0, reportTime: '2022-04-12', auditTime: '', showMenu: false, showMore: false, emergency: 0 },
				{ code: 'SUZHOUTENGXUN032541', name: '/TOVARIS', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false, showMore: false, emergency: 1 },
				{ code: 'SUZHOUTENGXUN032541', name: '/NHAT NG', flag: 2, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false, showMore: false, emergency: 1 },
				{ code: 'SUZHOUTENGXUN032541', name: '/REAL CH', flag: 0, reportTime: '2022-04-12', auditTime: '', showMenu: false, showMore: false, emergency: 0 },
				{ code: 'SUZHOUTENGXUN032541', name: '杭州甲康', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false, showMore: false, emergency: 1 }
			];
			this.loadStatus = 'loading';
			setTimeout(() => {
				this.loadStatus = 'more';
				this.listData = [...this.listData, ...tempData];
			}, 1000);
		},
		
	}
};
</script>

<style scoped>
.card-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	height: 40px;
	background-color: #4f9be1;
	font-weight: normal;
	color: #fff;
}
.approve-s {
	background-color: #67c23a;
}
.reject-s {
	background-color: #f56c6c;
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
::v-deep .uni-combox__input-plac{
	font-size: 24rpx;
	font-weight: 200;
}
</style>

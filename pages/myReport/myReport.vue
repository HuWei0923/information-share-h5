<template>
	<view class="content">
		<uni-row>
			<uni-col :span="12">
				<uni-search-bar
					v-model="form.code"
					radius="100"
					placeholder="信保代码"
					clearButton="auto"
					cancelButton="none"
					@blur="confirm(1, $event)"
					@clear="confirm(1, $event)"
				/>
			</uni-col>
			<uni-col :span="12">
				<uni-search-bar
					v-model="form.name"
					radius="100"
					placeholder="中/英文名称"
					clearButton="auto"
					cancelButton="none"
					@blur="confirm(2, $event)"
					@clear="confirm(2, $event)"
				/>
			</uni-col>
		</uni-row>
		<view style="padding: 0 20rpx;">
			共
			<text style="color: #409eff;margin: 0 10rpx;">{{ total }}</text>
			条数据
		</view>
		<view v-if="listData.length > 0">
			<uni-group :title="`信保代码：${item.code}`" mode="card" v-for="(item, index) in listData" :key="index">
			<view>中英文名称：{{ item.name }}</view>
			<view>填报时间：{{ item.reportTime }}</view>
			<text>审核时间：{{ item.auditTime }}</text>
				<view style="display: flex;justify-content: space-between;">
					<view>审批标识：<text>
							<uni-tag text="待审核" inverted	 type="primary" v-if="item.flag==0"></uni-tag>
							<uni-tag text="通过" inverted	 type="success" v-else-if="item.flag==1"></uni-tag>
							<uni-tag text="不通过" inverted	 type="error" v-else-if="item.flag==2"></uni-tag></text></view>
					<uni-icons type="more-filled" size="24" @click="item.showMenu = !item.showMenu"></uni-icons>
				</view>
				<uni-transition mode-class="fade" :duration="200" :show="item.showMenu">
					<view style="margin-top: 20rpx;padding-top: 20rpx;text-align: right;border-top: 1px solid #efefef;">
						<uni-tag text="预览" type="primary" style="margin-right: 10rpx;" @click="preview(item)"></uni-tag>
						<uni-tag text="下载" type="success" style="margin-right: 10rpx;"></uni-tag>
						<uni-tag text="摘要" type="warning" @click="checkDetail(item)"></uni-tag>
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
				name: ''
			},
			listData: [],
			currentPage: 1,
			pageSize: 5,
			total: 23,
			loadStatus: 'more' //more/loading/noMore，
		};
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
				{ code: 'SUZHOUTENGXUN032541', name: '/ALEMBIC', flag: 0, reportTime: '2022-04-12', auditTime: '', showMenu: false },
				{ code: 'SUZHOUTENGXUN032541', name: '/TOVARIS', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false },
				{ code: 'SUZHOUTENGXUN032541', name: '/NHAT NG', flag: 2, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false },
				{ code: 'SUZHOUTENGXUN032541', name: '/REAL CH', flag: 0, reportTime: '2022-04-12', auditTime: '', showMenu: false},
				{ code: 'SUZHOUTENGXUN032541', name: '杭州甲康', flag: 1, reportTime: '2022-04-12', auditTime: '2022-04-12', showMenu: false}
			];
			this.loadStatus = 'loading';
			setTimeout(() => {
				this.loadStatus = 'more';
				this.listData = [...this.listData, ...tempData];
			}, 1000);
		},
		confirm(type, e) {
			if (type == 1) {
				this.form.code = e.value;
			} else if (type == 2) {
				this.form.name = e.value;
			}
			this.currentPage = 1;
			this.listData = [];
			this.getData();
		},
		preview(item) {
			//预览pdf
			uni.downloadFile({
				url: 'https://www.gjtool.cn/pdfh5/git.pdf',
				success: res => {
					console.log(res);
					uni.openDocument({
						filePath: res.tempFilePath,
						success: res => {
							// uni.navigateBack({
							// 	delta: 1
							// });
						}
					});
				}
			});
		},
		checkDetail(item){
			//查看摘要信息
			uni.navigateTo({
				url:'/pages/detail/detail'
			})
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
</style>

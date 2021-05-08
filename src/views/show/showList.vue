<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>集群管理</BreadcrumbItem>
            <BreadcrumbItem>机器列表</BreadcrumbItem>
        </Breadcrumb>
		<Row type="flex" justify="space-between">
            <Col span="5"> 
                <mycard icon="md-alert" title="警告数" bgcolor="#2d8cf0" :count="alert_count"></mycard>
            </Col>
            <Col span="5"> 
               <mycard icon="ios-disc" title="今日完成任务" bgcolor="#19be6b" :count="finished_count"></mycard>
            </Col>
            <Col span="5"> 
                <mycard icon="md-sync" title="正在运行任务" bgcolor="#ff9900" :count="this.running_count"></mycard>
            </Col>
            <Col span="5"> 
                 <mycard icon="md-share" title="在线机器数" bgcolor="#ed3f14" :count="this.online_count"></mycard>
            </Col>
        </Row>
		<br/>
        <Table border ref="selection" :columns="columns4" :data="showData"></Table>
        <Page
            class="flex j-center"
            style="marginTop:20px"
            :total="showList.length"
            show-sizer
            show-elevator
            show-total
            :page-size-opts="[5,10,25,50,100]"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
        />
    </div>
</template>

<script>
// import mockData from '@/mock/index.js'
import mycard from '@/components/mycard'
export default {
	components: {
        mycard,
    },
	data () {
		return {
			columns4: [
				{
					title: 'IP地址',
					key: 'ip',
					align:'center',
				},
				{
					title: '处理器线程数',
					key: 'cpu',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.cpu.core_num);
					}
				},
				{
					title: '处理器利用率(%)',
					key: 'cpu',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.cpu.usage.toFixed(2));
					}
				},
				{
					title: '今天完成任务数',
					key: 'finished',
					align:'center',
				},
				{
					title: '内存大小',
					key: 'ram',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.ram.total.toFixed(2));
					}
				},
				{
					title: '内存利用率(%)',
					key: 'ram',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.ram.usage.toFixed(2));
					}
				},
				{
					title: '当前在运任务数',
					key: 'running',
					align:'center',
				},
				{
					title: '机器状态',//未确认 = 0, 正常 = 1, 警告 = 2, 错误 = 3
					key: 'status',
					align:'center',
					render:(h, params) => {
						if(params.row.status == 0){
							return h('div',{style:{color:'gray'}},'未确认');
						} else if(params.row.status == 1){
							return h('div',{style:{color:'green'}},'正常');
						} else if(params.row.status == 2){
							return h('div',{style:{color:'yellow'}},'警告');
						} else if(params.row.status == 3){
							return h('div',{style:{color:'red'}},'错误');
						}
					}
				},
				{
					title: '临时盘使用率(%)',
					key: 'tmp',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.tmp.usage.toFixed(2));
					}
				},
				{
					title: '临时盘大小',
					key: 'tmp',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.tmp.total.toFixed(2));
					}
				},
				{
					title: '操作',
					key: 'action',
					width: 200,
					align: 'center',
					render: (h, params) => {
						if(params.row.status == 0){
							return h('div', [
									h('Button', {
										props: {
											type: 'success',
											size: 'small'
										},
										style: {
											marginRight:'10px'
										},
										on: {
											click:() => {
												this.$Modal.confirm({
													title: '系统提示',
													content: '是否确认？',
													onOk: () => {
														this.MachineConfirm(params.row.machine_id);
													}
												});
											}
										}
									}, '确认'),
									h('Button', {
										props: {
											type: 'error',
											size: 'small'
										},
										style: {
											marginRight:'10px'
										},
										on: {
											click:() => {
												this.$Modal.confirm({
													title: '系统提示',
													content: '是否要停止？',
													onOk: () => {
														this.MachineStop(params.row.machine_id);
													}
												});
											}
										}
									}, '停止')
								]);
						} else {
							return h('div', [
								h('Button', {
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight:'10px'
									},
									on: {
										click: () => {
											// this.show(params.index);
											this.$router.push({path:'showListretail'})
										}
									}
								}, '详情'),
								h('Button', {
									props: {
										type: 'success',
										size: 'small'
									},
									style: {
										marginRight:'10px'
									},
									on: {
										click:() => {
											this.$Modal.confirm({
												title: '系统提示',
												content: '是否确认？',
												onOk: () => {
													this.MachineConfirm(params.row.machine_id);
												}
											});
										}
									}
								}, '确认'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									style: {
										marginRight:'10px'
									},
									on: {
										click:() => {
											this.$Modal.confirm({
												title: '系统提示',
												content: '是否要停止？',
												onOk: () => {
													this.MachineStop(params.row.machine_id);
												}
											});
										}
									}
								}, '停止')
							]);
						}
						
					}
				}
			],
			showList:[],
			currentPage: 0,
			currentPageSize: 10,
			alert_count:0,
			running_count:0,
			online_count:0,
			finished_count:0,
			interT:null,
		};
	},
	computed: {
		showData() {
			//再截取数据分页展示
			const startIndex = this.currentPage * this.currentPageSize;
			const endIndex = startIndex + this.currentPageSize;
			return this.showList.slice(startIndex, endIndex);
		},
	},
	created () {
		this.getShowList();
	},
	methods: {
		getShowList() {
			this.$Loading.start();
			// this.$axios.get(`${this.$config.KEY.url}/machine/user/1`)
			this.$axios.get('/showList')
				.then(res => {
					this.$Loading.finish();
					this.showList=[
						{
							"ip": "192.168.8.7",
							"machine_id":"1",
							"cpu": {
								"core_num": 16,
								"usage": 85.41875
							},
							"finished": 2,
							"ram": {
								"total": 31.068809509277344,
								"usage": 74.1
							},
							"running": 4,
							"status": 1,
							"tmp": {
								"total": 730,
								"usage": 2.0054205479452056
							}
						}
					]
					this.alert_count = 10
					this.running_count = 2
					this.finished_count = 4
					this.online_count = 1
					// this.showList = res.data.showList;
					// this.alert_count: = res.data.summary.alert
					// this.running_count: = res.data.summary.ongoing
					// this.finished_count: = res.data.summary.finished
					// this.online_count: = res.data.summary.online
				});
			this.interT = setInterval(() => {
				this.$Loading.start();
				// this.$axios.get(`${this.$config.KEY.url}/machine/user/1`)
				this.$axios.get('/showList')
					.then(res => {
						this.$Loading.finish();
						this.showList=[
							{
								"ip": "192.168.8.7",
								"machine_id":"1",
								"cpu": {
									"core_num": 16,
									"usage": 85.41875
								},
								"finished": 2,
								"ram": {
									"total": 31.068809509277344,
									"usage": 74.1
								},
								"running": 4,
								"status": 1,
								"tmp": {
									"total": 730,
									"usage": 2.0054205479452056
								}
							}
						]
						this.alert_count = 10
						this.running_count = 2
						this.finished_count = 4
						this.online_count = 1
						// this.showList = res.data.showList;
						// this.alert_count: = res.data.summary.alert
						// this.running_count: = res.data.summary.ongoing
						// this.finished_count: = res.data.summary.finished
						// this.online_count: = res.data.summary.online
					});
				},30*1000)
		},
		//切换页码
		changePage(num) {
			this.currentPage = num -1;
		},
		//切换页数
		changePageSize(num) {
			this.currentPageSize = num;
		},
		show (index) {
			this.$Modal.info({
				title: '票务信息',
				width: 500,
				render: (h) => {
					return h('div', {
						class : 'flex j-ar'
					}, [
						h('img', {
							class:'left-render-img',
							attrs: {
								src: this.showList[index].img,
							},
						}),
						h('div', {
							class : 'right-area',
						}, [
							h('p', `标题:${this.showList[index].title}`),
							h('p', `艺术家：${this.showList[index].artistname}`),
							h('p', `类型：${this.showList[index].type}`),
							h('p', `城市：${this.showList[index].city}`),
							h('p', `地址：${this.showList[index].address}`),
							h('p', `时间：${this.showList[index].showtime}`)
						]
						)
					]);
				},
			});
		},
		remove (index) {
			this.showList.splice(index, 1);
			this.$Message.success('删除成功');
		},
		MachineConfirm(val) {
			this.$Loading.start();
			this.$axios.post(`${this.$config.KEY.url}/machine/confirm`,{machine_id:val})
				.then(res => {
					this.$Loading.finish();
					if(res.data.status){
						this.$Notice.success({
							title: "确认成功！"
						})
					} else {
						this.$Notice.success({
							title: "请求报错！"
						})
					}
				})
		},
		MachineStop(val) {
			this.$Loading.start();
			this.$axios.post(`${this.$config.KEY.url}/machine/stop`,{machine_id:val})
				.then(res => {
					this.$Loading.finish();
					if(res.data.status){
						this.$Notice.success({
							title: "停止成功！"
						})
					} else {
						this.$Notice.warning({
							title: "停止报错报错！"
						})
					}
				})
				.catch(err=>{
					this.$Notice.error({
						title: err
					})
				})
		},
		
	},
	destroyed () {
		clearInterval(this.interT);
		this.interT = null;
	}
};
</script>
<style>
    .ivu-table-overflowX{ overflow-x: hidden;} 
    .showimg {
        width: 50px;
        height: 70px;
    }
    .left-render-img {
        width: 200px;
        height: 300px;
        -webkit-user-drag: none;
    }
    .right-area {
        flex-direction: column;
    }
    .right-area p {
        margin-top: 25px;
    }
</style>
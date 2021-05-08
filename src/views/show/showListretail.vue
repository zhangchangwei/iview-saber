<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>集群管理</BreadcrumbItem>
            <BreadcrumbItem to="/showList">机器列表</BreadcrumbItem>
			<BreadcrumbItem>机器详情</BreadcrumbItem>
        </Breadcrumb>
		<br/>
        <Table border ref="selection" :columns="columns4" :data="showData"></Table>

        <Row type="flex" justify="space-between" style="margin-top:20px">
            <Col span="12">
				<div style="text-align:center"><h4 >缓存盘列表</h4></div>
                <Table border :columns="columns2" :data="dataShow2" ></Table>
            </Col>
           <Col span="12">
                <Card :padding="0">
					<div style="text-align:center"><h4 >存储盘列表</h4></div>
					<Table border :columns="columns3" :data="dataShow3" ></Table>
                </Card>
            </Col>
        </Row>
		<Row style="margin-top:20px">
           <Col span="24">
                <Card :padding="0">
                    <div style="text-align:center"><h4 >任务列表</h4></div>
                    <Table border :columns="columns5" :data="dataShow5" ></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
// import mockData from '@/mock/index.js'
import mycard from '@/components/mycard'

import column from '@/components/charts/column'
import line from '@/components/charts/line'
import pie from '@/components/charts/pie'
export default {
	components: {
		mycard,
		"charts-column":column,
        "charts-line":line,
        "charts-pie":pie,
    },
	data () {
		return {
			interT:null,
			columns4: [
				{
					title: '机器编号',
					key: 'machine_id',
					align:'center',
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
					title: 'CPU核数',
					key: 'cpu',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.cpu.core_num);
					}
				},
				{
					title: 'CPU利用率(%)',
					key: 'cpu',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.ram.usage.toFixed(2));
					}
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
				// {
				// 	title: '缓存盘列表',
				// 	key: 'tmp',
				// 	align:'center',
				// 	// render:(h, params) => {
				// 	// 	return h('div',params.row.tmp.usage.toFixed(2));
				// 	// }
				// },
				// {
				// 	title: '存储盘列表',
				// 	key: 'storage',
				// 	align:'center',
				// 	// render:(h, params) => {
				// 	// 	return h('div',params.row.tmp.total.toFixed(2));
				// 	// }
				// },
				// {
				// 	title: '任务列表',
				// 	key: 'tasks',
				// 	align:'center',
				// 	// render:(h, params) => {
				// 	// 	return h('div',params.row.tmp.total.toFixed(2));
				// 	// }
				// },
			],
			columns2: [
				{
					title: '编号',
					key: 'idx',
					align:'center',
				},
				{
					title: '剩余空间(单位GiB)',
					key: 'free',
					align:'center',
				},
				{
					title: '挂载目录',
					key: 'mount_point',
					align:'center',
				},
				{
					title: '总空间(单位GiB)',
					key: 'total',
					align:'center',
				},
				{
					title: '磁盘类型',
					key: 'type',
					align:'center',
					render:(h, params) => {
						if(params.row.type == 1){
							return h('div','NVME_SSD');
						} else if(params.row.type == 2){
							return h('div','SATA_SSD');
						} else if(params.row.type == 3){
							return h('div','HDD');
						}
					}
				},
			],
			columns3: [
				{
					title: '编号',
					key: 'idx',
					align:'center',
				},
				{
					title: '空闲大小(单位GiB)',
					key: 'free',
					align:'center',
				},
				{
					title: '挂载目录',
					key: 'mount_point',
					align:'center',
				},
				{
					title: '总空间(单位GiB)',
					key: 'total',
					align:'center',
				},
				{
					title: '磁盘类型',
					key: 'type',
					align:'center',
					render:(h, params) => {
						if(params.row.type == 1){
							return h('div','本地磁盘');
						} else if(params.row.type == 2){
							return h('div','网络磁盘');
						}
					}
				},
			],
			columns5: [
				{
					title: '任务ID',
					key: 'task_id',
					align:'center',
				},
				{
					title: '存盘编号',
					key: 'storage',
					align:'center',
				},
				{
					title: '运行时间(分钟)',
					key: 'run_time',
					align:'center',
				},
				{
					title: '图ID',
					key: 'plot_id',
					align:'center',
				},
				{
					title: '磁盘类型',
					key: 'tmp',
					align:'center',
					render:(h, params) => {
						if(params.row.tmp == 1){
							return h('div','NVME_SSD');
						} else if(params.row.tmp == 2){
							return h('div','SATA_SSD');
						} else if(params.row.tmp == 3){
							return h('div','HDD');
						}
					}
				},
				{
					title: '任务进度',
					key: 'percentage',
					align:'center',
					render: (h, params) => {
						// return h('div', params.row.percentage.map(function (item,index) {
							return h('Progress',{
								props:{
									'text-inside':false,
									percent:params.row.percentage,
									'stroke-width':20,
									status:"active"
								},
							});
						// }))
					}
				},
			],
			showList:[],
			dataShow:[],
			dataShow2:[],
			dataShow3:[],
			dataShow5:[],
			currentPage: 0,
			currentPageSize: 10,
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
			// this.$axios.get(`${this.$config.KEY.url}/machine/1`)
			this.$axios.get('/showList')
				.then(res => {
					this.$Loading.finish();
					this.showList = res.data.data
					this.showList=[
						{
							"machine_id": 1,
							"finished": 2,
							"ram": {
								"total": 31.068809509277344,
								"usage": 74.1
							},
							"running": 4,
							"status": 1,
							"cpu":{
								"core_num":10,
								"usage":94.1
							}
						}
					]
					// this.dataShow2 = res.data.data.tmp
					// this.dataShow3 = res.data.data.storage
					// this.dataShow5 = res.data.data.tasks
					
					this.dataShow2 = [
						{
							"free": 773.52,
							"idx": 1,
							"mount_point": "/mnt/nvme1",
							"total": 1465,
							"type": 1
						},
						{
							"free": 961.6959999999999,
							"idx": 2,
							"mount_point": "/mnt/nvme2",
							"total": 1466,
							"type": 1
						},
						{
							"free": 202.21,
							"idx": 3,
							"mount_point": "/mnt/sata1",
							"total": 365,
							"type": 2
						},
						{
							"free": 241.265,
							"idx": 4,
							"mount_point": "/mnt/sata2",
							"total": 365,
							"type": 2
						}
					],
					this.dataShow3 = [
						{
							"free": 12935.0,
							"idx": 1,
							"mount_point": "/mnt/nas_plot",
							"total": 12935,
							"type": 2
						}
					],
					this.dataShow5 = [
						{
							"percentage": 42.0,
							"plot_id": "1d28b601aa5f60d0f49873441ed64dde426268ac2a969838e0149ebadc2a4134",
							"run_time": 250,
							"storage": 1,
							"task_id": 51,
							"tmp": 1
						},
						{
							"percentage": 36.0,
							"plot_id": "2071f78f02782a47b93553e04c49260963149c5cb3d4dc35911db98c07664398",
							"run_time": 254,
							"storage": 1,
							"task_id": 52,
							"tmp": 1
						},
						{
							"percentage": 28.0,
							"plot_id": "d382d0511758af398494c4149ca198d51aff01b2a7b59e6a1fa1d3952078c978",
							"run_time": 231,
							"storage": 1,
							"task_id": 53,
							"tmp": 1
						},
						{
							"percentage": 20.0,
							"plot_id": "21b94111dad8da6db3dc612a79bf8a4ac9e99da2e374f87d7f42977dfd358803",
							"run_time": 222,
							"storage": 1,
							"task_id": 57,
							"tmp": 1
						},
						{
							"percentage": 28.0,
							"plot_id": "17c9b2fae67b8f0729ff0d282a273f128d7ad3cf534736b9ceac5ef4987dd108",
							"run_time": 123,
							"storage": 1,
							"task_id": 54,
							"tmp": 2
						},
						{
							"percentage": 28.0,
							"plot_id": "b6094e9ac1eacc6083613b6d7ce731e23d0a3d84f8578e210dc6116520e9ad91",
							"run_time": 101,
							"storage": 1,
							"task_id": 55,
							"tmp": 2
						},
						{
							"percentage": 20.0,
							"plot_id": "7e88195c95839d6baf1383ce85860390826d6bc0fd6c6a4384d8845adea78632",
							"run_time": 121,
							"storage": 1,
							"task_id": 56,
							"tmp": 2
						},
						{
							"percentage": 20.0,
							"plot_id": "a5e3646cdf4270803d809823b975fa83fac69ad91707bdee95300952aaecf1a4",
							"run_time": 212,
							"storage": 1,
							"task_id": 58,
							"tmp": 3
						},
						{
							"percentage": 12.0,
							"plot_id": "f929826848689699f828101db1df27ce747c95e6c1c457928bd5f7bfc3853e24",
							"run_time": 234,
							"storage": 1,
							"task_id": 59,
							"tmp": 2
						}
					]
				});
			 this.interT = setInterval(() => {
				this.$Loading.start();
				// this.$axios.get(`${this.$config.KEY.url}/machine/1`)
				this.$axios.get('/showList')
				.then(res => {
					this.$Loading.finish();
					this.showList = res.data.data
					this.dataShow2 = res.data.data.tmp
					this.dataShow3 = res.data.data.storage
					this.dataShow5 = res.data.data.tasks
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
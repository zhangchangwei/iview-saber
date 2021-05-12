<template>
    <div>
        <Breadcrumb style="margin-bottom:20px">
            <BreadcrumbItem>集群管理</BreadcrumbItem>
            <BreadcrumbItem to="/showList">机器列表</BreadcrumbItem>
			<BreadcrumbItem>机器详情</BreadcrumbItem>
        </Breadcrumb>
		<br/>
        <Table border ref="selection" :columns="columns4" :data="showList"></Table>

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
					title: '任务总数',
					key: 'summary',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.summary.total);
					}
				},
				{
					title: '今天完成任务数',
					key: 'summary',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.summary.finished_today);
					}
				},
				{
					title: '当前在运任务数',
					key: 'summary',
					align:'center',
					render:(h, params) => {
						return h('div',params.row.summary.running);
					}
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
						return h('div',params.row.cpu.usage.toFixed(2));
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
					render:(h, params) => {
						return h('div',params.row.free.toFixed(2));
					}
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
			this.$axios.get(`${this.$config.KEY.url}/machine/1`)
			// this.$axios.get('/showList')
				.then(res => {
					this.$Loading.finish();
					this.showList=[]
					this.showList.push(res.data.data)

					this.dataShow2 = res.data.data.tmp
					this.dataShow3 = res.data.data.storage
					this.dataShow5 = res.data.data.tasks
					
				});
			 this.interT = setInterval(() => {
				this.$Loading.start();
				this.$axios.get(`${this.$config.KEY.url}/machine/1`)
				// this.$axios.get('/showList')
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
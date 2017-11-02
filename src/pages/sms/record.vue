<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-button type="primary">新增</el-button>
		</el-row>
		<el-table
	    :data="sendRecords"
	    border
	    highlight-current-row
	    style="width: 100%">
	    <el-table-column prop="recordId" label="记录ID" sortable></el-table-column>
	    <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatTime"></el-table-column>
	    <el-table-column prop="phone" label="手机号"></el-table-column>
	    <el-table-column prop="checkCode" label="验证码"></el-table-column>
	    <el-table-column prop="sendStatus" label="发送状态"></el-table-column>
	    <el-table-column prop="clientId" label="应用ID"></el-table-column>
	    <el-table-column prop="tempId" label="模板ID"></el-table-column>
	  </el-table>
	  <el-row class="toolbar">
	  	<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="pageNo"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
	  </el-row>
  </section>
</template>
<script>
	import { getSmsRecords } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				sendRecords: [
					{
						recordId: 100001,
						phone: '15212341234',
						checkCode: '1234',
						createTime: new Date(),
						sendStatus: 0,
						clientId: 1,
						tempId: 1,
						partnerId: 1,
						userName: '笑雪吟风',
					},
					{
						recordId: 100002,
						phone: '15212341234',
						checkCode: '1234',
						createTime: new Date(),
						sendStatus: 0,
						clientId: 1,
						tempId: 1,
						partnerId: 1,
						userName: '笑雪吟风',
					},
					{
						recordId: 100003,
						phone: '15212341234',
						checkCode: '1234',
						createTime: new Date(),
						sendStatus: 0,
						clientId: 1,
						tempId: 1,
						partnerId: 1,
						userName: '笑雪吟风',
					},
				]
			}
		},
		methods: {
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD')
			},
			handleSizeChange(val) {
				this.pageSize = val;
			},
			handleCurrentChange(val) {
				this.pageNo = val;
			},
			getRecords() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				getSmsRecords(params).then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						this.sendRecords = res.data.result.records;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>
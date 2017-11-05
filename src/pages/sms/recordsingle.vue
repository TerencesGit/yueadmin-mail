<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-form inline>
				<el-form-item>
					<el-input placeholder="输入手机号"></el-input>
				</el-form-item>
				<el-button type="primary">查询</el-button>
			</el-form>
		</el-row>
		<el-table
	    border
	    stripe
	    :data="sendRecords"
	    v-loading="loading"
	    highlight-current-row
	    style="width: 100%">
	    <el-table-column type="index" width="55"></el-table-column>
	    <el-table-column prop="recordId" label="记录ID" sortable></el-table-column>
	    <el-table-column prop="createTime" label="发送时间" sortable :formatter="formatTime"></el-table-column>
	    <el-table-column prop="phone" label="手机号"></el-table-column>
	    <el-table-column prop="checkCode" label="验证码"></el-table-column>
	    <el-table-column prop="sendStatus" label="发送状态" :formatter="formatStatus"></el-table-column>
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
	import { findRecordSingle } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				sendRecords: [],
			}
		},
		methods: {
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
			},
			formatStatus(row) {
				return row.sendStatus === 1 ? '成功' : '失败'
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getRecords()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getRecords()
			},
			getRecords() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				this.loading = true;
				findRecordSingle(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.total = res.data.result.pageInfo.total;
						this.sendRecords = res.data.result.records;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			}
		},
		mounted() {
			this.getRecords()
		}
	}
</script>
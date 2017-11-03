<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-button type="primary" @click="handleAdd">新建应用</el-button>
		</el-row>
		<el-table
	    border
	    stripe
	    :data="sendRecords"
	    v-loading="loading"
	    highlight-current-row
	    style="width: 100%">
	    <el-table-column type="index" width="55"></el-table-column>
	    <el-table-column prop="clientId" label="应用ID" sortable></el-table-column>
	    <el-table-column prop="clientName" label="应用名称"></el-table-column>
	    <el-table-column prop="signCode" label="签名编码"></el-table-column>
	    <el-table-column prop="signName" label="应用签名"></el-table-column>
	    <el-table-column prop="updateTime" label="更新时间" :formatter="formatTime" sortable></el-table-column>
	    <el-table-column>
	    	<template slot-scope="scope">
	    		<el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
	    		<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
	    	</template>
	    </el-table-column>
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
	  <!-- 应用表单 -->
		<el-dialog :visible.sync="clientFormVisible" :title="clientFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="clientForm" ref="clientForm" :rules="rules" label-width="120px">
						<el-form-item label="应用名称：" prop="clientName">
							<el-input v-model="clientForm.clientName" placeholder="输入用户名"></el-input>
						</el-form-item>
						<el-form-item label="应用签名：" prop="signName">
							<el-input v-model="clientForm.signName" placeholder="输入真实姓名"></el-input>
						</el-form-item>
					</el-form>
				</el-col> 
			</el-row>
			<div slot="footer">
				<el-button @click="clientFormVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
  </section>
</template>
<script>
	import { findClientList, createSmsClient, updateSmsClient, delSmsClient } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				sendRecords: [],
				clientFormVisible: false,
				clientFormTitle: '新建应用',
				clientForm: {
					clientId: '',
					clientName: '',
					signName: '',
				},
				rules: {
					clientName: [
						{ required: true, message: '输入应用名称', trigger: 'blur'}
					],
					signName: [
						{ required: true, message: '输入应用签名', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getClientList()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getClientList()
			},
			getClientList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				this.loading = true;
				findClientList(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.total = res.data.result.pageInfo.total;
						this.sendRecords = res.data.result.clients;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleAdd() {
				this.clientForm = {
					clientId: '',
					clientName: '',
					signName: '',
				}
				this.clientFormTitle = '新建应用';
				this.clientFormVisible = true;
			},
			handleEdit(row) {
				this.clientForm = {
					clientId: row.clientId,
					clientName: row.clientName,
					signName: row.signName,
				}
				this.clientFormTitle = '编辑应用';
				this.clientFormVisible = true;
			},
			submitForm() {
				this.$refs.clientForm.validate(valid => {
					if(!valid) return;
					let data = {
						clientId: this.clientForm.clientId,
						clientName: this.clientForm.clientName,
						signName: this.clientForm.signName,
						signType: 0,
					}
					this.clientFormVisible = false;
					if(data.clientId) {
						updateSmsClient(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getClientList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.clientFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createSmsClient(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getClientList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.clientFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					}
				})
			},
			handleDelete(row) {
				this.$confirm(`确定删除${row.clientName}？`, '提示', {type: 'warning'}).then(() => {
					let data = {
						clientId: row.clientId
					}
					delSmsClient(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getClientList()
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.$catchError(err)
					})
				}).catch(err => {
					console.log(err)
				})
			},
		},
		mounted() {
			this.getClientList()
		}
	}
</script>
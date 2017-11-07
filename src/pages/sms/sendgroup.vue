<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-button type="primary" @click="handleAdd">新建群发</el-button>
		</el-row>
		<el-table
	    border
	    stripe
	    :data="batchSendList"
	    v-loading="loading"
	    highlight-current-row
	    style="width: 100%">
	    <el-table-column type="index" width="55"></el-table-column>
	    <el-table-column prop="batchSendId" label="群发ID" sortable></el-table-column>
	    <el-table-column prop="batchSendName" label="群发名称"></el-table-column>
	    <el-table-column prop="clientId" label="应用ID"></el-table-column>
	    <el-table-column prop="tempName" label="群发模板"></el-table-column>
	    <el-table-column prop="updateTime" label="更新时间" :formatter="formatTime" sortable></el-table-column>
	    <el-table-column label="操作">
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
	  <!-- 群发表单 -->
		<el-dialog :visible.sync="batchSendFormVisible" :title="batchSendFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="batchSendForm" ref="batchSendForm" :rules="rules" label-width="120px">
						<el-form-item label="群发名称：" prop="batchSendName">
							<el-input v-model="batchSendForm.batchSendName" placeholder="输入群发名称"></el-input>
						</el-form-item>
						<el-form-item label="群发应用：" prop="clientId">
							<el-select v-model="batchSendForm.clientId" style="width: 100%" placeholder="请选择模板类型">
								<el-option 
									v-for="client in clientList" 
									:key="client.clientId" 
									:label="client.clientName" 
									:value="client.clientId">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="群发模板：" prop="tempId">
							<el-select v-model="batchSendForm.tempId" style="width: 100%" placeholder="请选择模板类型">
								<el-option 
									v-for="temp in tempList" 
									:key="temp.tempId" 
									:label="temp.tempName" 
									:value="temp.tempId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</el-col> 
			</el-row>
			<div slot="footer">
				<el-button @click="batchSendFormVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
  </section>
</template>
<script>
	import { findBatchSendList, findClientList, findTempList, createBatchSend, updateBatchSend, delBatchSend } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				batchSendList: [],
				clientList: [],
				tempList: [],
				batchSendFormVisible: false,
				batchSendFormTitle: '新建模板',
				batchSendForm: {
					batchSendId: '',
					batchSendName: '',
					clientId: '',
					tempId: '',
				},
				rules: {
					batchSendName: [
						{ required: true, message: '输入群发名称', trigger: 'blur'}
					],
					clientId: [
						{ required: true, type: 'number', message: '输入群发应用', trigger: 'blur'}
					],
					tempId: [
						{ required: true, type: 'number', message: '输入群发模板', trigger: 'blur'}
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
				this.getBatchSendList()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getBatchSendList()
			},
			getBatchSendList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				this.loading = true;
				findBatchSendList(params).then(res => {
					this.loading = false;
					if(res.data.code === '0001') {
						this.total = res.data.result.pageInfo.total;
						this.batchSendList = res.data.result.batchSends;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
			getClientList() {
				let params = {
					pageNo: 1,
					pageSize: 100,
				}
				this.loading = true;
				findClientList(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.total = res.data.result.pageInfo.total;
						this.clientList = res.data.result.clients;
						this.batchSendForm.tempId =  this.clientList[0].clientId;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getTempList() {
				let params = {
					pageNo: 1,
					pageSize: 100,
				}
				this.loading = true;
				findTempList(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.tempList = res.data.result.tempList;
						this.batchSendForm.tempId =  this.tempList[0].tempId;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleAdd() {
				this.batchSendForm = {
					batchSendId: '',
					batchSendName: '',
					clientId: this.clientList[0].clientId,
					tempId: this.tempList[0].tempId,
				}
				this.batchSendFormTitle = '新建模板';
				this.batchSendFormVisible = true;
			},
			handleEdit(row) {
				this.batchSendForm = {
					batchSendId: row.batchSendId,
					batchSendName: row.batchSendName,
					clientId: row.clientId,
					tempId: row.tempId,
				}
				this.batchSendFormTitle = '编辑模板';
				this.batchSendFormVisible = true;
			},
			submitForm() {
				this.$refs.batchSendForm.validate(valid => {
					if(!valid) return;
					let data = {
						batchSendId: this.batchSendForm.batchSendId,
						batchSendName: this.batchSendForm.batchSendName,
						clientId: this.batchSendForm.clientId,
						tempId: this.batchSendForm.tempId,
					}
					console.log(data)
					this.batchSendFormVisible = false;
					if(data.batchSendId) {
						updateBatchSend(data).then(res => {
							console.log(res)
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getBatchSendList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.batchSendFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createBatchSend(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getBatchSendList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.batchSendFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					}
				})
			},
			handleDelete(row) {
				this.$confirm(`确定删除${row.tempName}？`, '提示', {type: 'warning'}).then(() => {
					let data = {
						batchSendId: row.batchSendId
					}
					delBatchSend(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getBatchSendList()
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
			this.getBatchSendList()
			this.getClientList()
			this.getTempList()
		}
	}
</script>
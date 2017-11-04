<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-button type="primary" @click="handleAdd">新建模板</el-button>
		</el-row>
		<el-table
	    border
	    stripe
	    :data="sendRecords"
	    v-loading="loading"
	    highlight-current-row
	    style="width: 100%">
	    <el-table-column type="index" width="55"></el-table-column>
	    <el-table-column prop="tempId" label="模板ID" sortable></el-table-column>
	    <el-table-column prop="tempCode" label="模板编码" sortable></el-table-column>
	    <el-table-column prop="tempName" label="模板名称"></el-table-column>
	    <el-table-column prop="tempContent" label="模板内容"></el-table-column>
	    <el-table-column prop="tempType" label="模板类型" :formatter="formatType"></el-table-column>
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
	  <!-- 模板表单 -->
		<el-dialog :visible.sync="tempFormVisible" :title="tempFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="tempForm" ref="tempForm" :rules="rules" label-width="120px">
						<el-form-item label="模板名称：" prop="tempName">
							<el-input v-model="tempForm.tempName" placeholder="输入模板名称"></el-input>
						</el-form-item>
						<el-form-item label="模板类型：" prop="tempType">
							<el-select v-model="tempForm.tempType" style="width: 100%" placeholder="请选择模板类型">
								<el-option label="验证码" :value="0"></el-option>
								<el-option label="提示信息" :value="1"></el-option>
								<el-option label="群发" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="模板内容：" prop="tempContent">
							<el-input type="textarea" :rows="3" v-model="tempForm.tempContent" placeholder="输入模板内容"></el-input>
						</el-form-item>
					</el-form>
				</el-col> 
			</el-row>
			<div slot="footer">
				<el-button @click="tempFormVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
  </section>
</template>
<script>
	import { findTempList, createSmsTemp, updateSmsTemp, delSmsTemp } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				sendRecords: [],
				tempFormVisible: false,
				tempFormTitle: '新建模板',
				tempForm: {
					tempId: '',
					tempName: '',
					tempCode: '',
					tempContent: '',
					tempType: 0,
				},
				rules: {
					tempName: [
						{ required: true, message: '输入模板名称', trigger: 'blur'}
					],
					tempCode: [
						{ required: true, message: '输入模板签名', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
			},
			formatType(row) {
				let type = ['验证码', '提示信息', '群发'];
				return type[row.tempType];
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getTempList()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getTempList()
			},
			getTempList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				this.loading = true;
				findTempList(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.total = res.data.result.pageInfo.total;
						this.sendRecords = res.data.result.tempList;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleAdd() {
				this.tempForm = {
					tempId: '',
					tempName: '',
					tempContent: '',
					tempType: 0,
				}
				this.tempFormTitle = '新建模板';
				this.tempFormVisible = true;
			},
			handleEdit(row) {
				this.tempForm = {
					tempId: row.tempId,
					tempName: row.tempName,
					tempContent: row.tempContent,
					tempType: row.tempType,
				}
				this.tempFormTitle = '编辑模板';
				this.tempFormVisible = true;
			},
			submitForm() {
				this.$refs.tempForm.validate(valid => {
					if(!valid) return;
					let data = {
						tempId: this.tempForm.tempId,
						tempName: this.tempForm.tempName,
						tempContent: this.tempForm.tempContent,
						tempType: this.tempForm.tempType,
					}
					this.tempFormVisible = false;
					if(data.tempId) {
						updateSmsTemp(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getTempList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.tempFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createSmsTemp(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getTempList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							this.tempFormVisible = false;
							console.log(err)
							this.$catchError(err)
						})
					}
				})
			},
			handleDelete(row) {
				this.$confirm(`确定删除${row.tempName}？`, '提示', {type: 'warning'}).then(() => {
					let data = {
						tempId: row.tempId
					}
					delSmsTemp(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getTempList()
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
			this.getTempList()
		}
	}
</script>
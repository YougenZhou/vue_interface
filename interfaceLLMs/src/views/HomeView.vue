<script setup>
import {ref} from 'vue'
import axios from "axios"

const selectedModelA = ref(null)
const selectedModelB = ref(null)
const llmAll = ref(['ChatGLM', 'LLaMA', 'Bloomz', 'ChatGPT'])

function selectModelA() {
  selectedModelB.value = null
}

function selectModelB() {
  if (selectedModelB.value == selectedModelA.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请选择不同的模型',
      type: 'error'
    })
    selectedModelB.value = null
  }
}

const selectedDataSource = ref(null)
const dataSources = ref(['D4-Dialogue', 'Case-QA'])

const isSelect = ref(false)

function yesSelect() {
  if (!selectedModelA.value || !selectedModelB.value || !selectedDataSource.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请先选择参与对比测评的模型和数据',
      type: 'error'
    })
  } else {
    isSelect.value = true
  }
}

function rmSelect() {
  ElMessageBox.confirm('请确定是否要清除当前选择的模型', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    isSelect.value = false
    selectedModelA.value = null
    selectedModelB.value = null
    selectedDataSource.value = null
  })
}

const loadingModel = ref(false)

function loadModel() {
  if (!isSelect.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请先选择模型，并按确认按钮',
      type: 'error'
    })
  } else {
    loadingModel.value = true
    axios.get('webapi/loadModel', {
      params: {
        model_a: selectedModelA.value,
        model_b: selectedModelB.value,
        data_source: selectedDataSource.value
      }
    }).then((res) => {
      const data = res.data
      loadingModel.value = false
      ElMessage({
        showClose: true,
        grouping: true,
        message: data['msg'],
        type: 'success'
      })
    }).catch((error) => {
      loadingModel.value = false
      ElMessage({
        showClose: true,
        grouping: true,
        message: '加载模型失败！' + error,
        type: 'error'
      })
    })
  }
}

const inputContext = ref([1, 2, 3, 4, 5, 6, 7, 8, 9])

const betterModel = ref(null)

const inputText = ref(null)
const modelAnswer = ref(null)
const answerOK = ref(false)
const answerRight = ref(null)

async function submitPrompt() {
  if (!inputText.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请先输入内容！',
      type: 'error'
    })
  } else {
    answerOK.value = true
    const data = {
      "prompt": inputText.value
    }
    await axios.post('getAnswer', data).then(res => {
      answerOK.value = false
      modelAnswer.value = res.data.msg
    }).catch(error => {
      ElMessage({
        showClose: true,
        grouping: true,
        message: '服务器出错了！请稍后再试～',
        type: 'error'
      })
    })

    await axios.get('getRightAnswer', {params: data}).then(res => {
      answerRight.value = res.data.msg
    })
  }
}

const removeContext = () => {
  inputText.value = null
  modelAnswer.value = null
}

const answerRate = ref(null)

const reInputText = ref(null)
const submitReInput = async () => {
  if (!reInputText.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请先输入改写后的内容！',
      type: 'error'
    })
  } else {
    const data = {
      "rewrite": reInputText.value
    }
    await axios.post('reWriteAnswer', data).then(res => {
    }).catch(error => {
      ElMessage({
        showClose: true,
        grouping: true,
        message: '服务器出错了！请稍后再试～',
        type: 'error'
      })
    })
  }
}

const submitResult = () => {
  const data = {
    'model_name': selectedModelA.value
  }
  axios.get('webapi/submitResult', data)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="380px">
        <div class="selectGroup">
          <div class="m-4">
            <p>选择模型A</p>
            <el-select
                v-model="selectedModelA"
                :disabled="isSelect"
                placeholder="Select"
                style="width: 280px"
                @change="selectModelA"
            >
              <el-option
                  v-for="(llm, index) in llmAll"
                  :key="index"
                  :label="llm"
                  :value="llm"
              />
            </el-select>
          </div>

          <div class="m-4">
            <p>选择模型B</p>
            <el-select
                v-model="selectedModelB"
                :disabled="isSelect"
                placeholder="Select"
                style="width: 280px"
                @change="selectModelB"
            >
              <el-option
                  v-for="(llmName, index) in llmAll"
                  :key="index"
                  :label="llmName"
                  :value="llmName"
              />
            </el-select>
          </div>

          <div class="m-4">
            <p>选择测评数据</p>
            <el-select
                v-model="selectedDataSource"
                :disabled="isSelect"
                placeholder="Select"
                style="width: 280px"
            >
              <el-option
                  v-for="(dataSource, index) in dataSources"
                  :key="index"
                  :label="dataSource"
                  :value="dataSource"
              />
            </el-select>
          </div>

          <div class="m-4">
            <p>目前选择的参数信息</p>
            <div class="box-card">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-text class="mx-1">模型A: </el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1">{{ selectedModelA }}</el-text>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-text class="mx-1">模型B: </el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1">{{ selectedModelB }}</el-text>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-text class="mx-1">测评数据: </el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1">{{ selectedDataSource }}</el-text>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-text class="mx-1">模型加载方式：</el-text>
                </el-col>
                <el-col :span="14">
                  <el-text class="mx-1"></el-text>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="buttonGroup">
            <el-button type="primary" @click="yesSelect">确定</el-button>
            <el-button type="success" @click="loadModel">加载模型</el-button>
            <el-button type="danger" @click="rmSelect">清除</el-button>
          </div>
        </div>
      </el-aside>
      <el-main v-loading="loadingModel">
        <div>
          <p style="margin-bottom: 6px">请选择测试内容</p>
          <ul class="input_list">
            <li class ='input_item' v-for="(input, index) in inputContext" :key="index">{{ input }}</li>
          </ul>
          <div style="margin-top: 6px; margin-bottom: 6px">
            <el-button color="#626aef" @click="submitPrompt">下一条</el-button>
            <el-button type="warning" @click="removeContext">提交</el-button>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div>
              <p style="margin-bottom: 6px; margin-top: 6px">模型A给出的回复</p>
              <div class="demo-rate-block">
                <el-text class="mx-1">{{ modelAAnswer }}</el-text>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <p style="margin-bottom: 6px; margin-top: 6px">模型B给出的回复</p>
              <div class="demo-rate-block">
                <el-text class="mx-1">{{ modelBAnswer }}</el-text>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <p style="margin-bottom: 6px; margin-top: 6px">请选择出回复较好的模型</p>
              <div class="demo-rate-block">
                <el-radio-group v-model="betterModel">
                  <el-radio :label="3">模型A</el-radio>
                  <el-radio :label="6">模型B</el-radio>
                  <el-radio :label="9">一样好</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="margin-top: 6px;">
            <el-button color="#626aef" @click="submitResult">提交结果</el-button>
          </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

.el-aside {
  padding-top: 50px;
  background: #f2f3f5;
}

.selectGroup {
  margin: 0 50px;
}

.m-4 {
  margin-top: 30px;
}

.box-card {
  width: 280px;
  border-width: 1px;
  border-style: solid;
  border-color: #e6e8eb;
  padding: 5px 10px;
  background: white;
  border-radius: 6px;
}

.buttonGroup {
  margin: 26px 0;
}

.demo-rate-block {
  text-align: center;
  border-color: #e6e8eb;
  border-width: 1px;
  border-style: solid;
  height: 150px;
  padding-top: 50px;
}

.input_list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
  border-color: #e6e8eb;
  border-width: 1px;
  border-style: solid;
  overflow: auto;
}

.input_list .input_item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: rgb(238, 245, 254);
  margin: 10px;
  color: rgb(89, 154, 244);
}

.input_item {
  margin-top: 10px;
}
</style>

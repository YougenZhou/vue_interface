<script setup>
import {ref} from 'vue'

const selectedModel = ref(null)
const llmAll = ref(['ChatGLM', 'LLaMA', 'MiniMax', 'Bloomz', 'Claude'])
const paramSizeAll = ref(null)
const paramSize = ref(null)

function selectModel() {
  const allModelParamSize = {
    'ChatGLM': ['6B'],
    'LLaMA': ['7B', '13B']
  }
  paramSizeAll.value = allModelParamSize[selectedModel.value]
  paramSize.value = null
}

const isSelect = ref(false)

function yesSelect() {
  if (!selectedModel.value || !paramSize.value) {
    ElMessage({
      showClose: true,
      grouping: true,
      message: '请先选择模型及其对应参数量！',
      type: 'error'
    })
  } else {
    isSelect.value = true
  }
}

function rmSelect() {
  ElMessageBox.alert('确定要清除当前选择的参数吗？', {
    confirmButtonText: '确定',
    callback: () => {
      isSelect.value = false
      selectedModel.value = null
      paramSize.value = null
    }
  })
}

const loadingModel = ref(false)

function loadModel() {
  loadingModel.value = true

}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="380px">
        <div class="selectGroup">
          <div class="m-4">
            <p>选择模型</p>
            <el-select
                v-model="selectedModel"
                :disabled="isSelect"
                placeholder="Select"
                style="width: 280px"
                @change="selectModel"
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
            <p>选择参数量</p>
            <el-select
                v-model="paramSize"
                :disabled="isSelect"
                placeholder="Select"
                style="width: 280px"
            >
              <el-option
                  v-for="(llmParam, index) in paramSizeAll"
                  :key="index"
                  :label="llmParam"
                  :value="llmParam"
              />
            </el-select>
          </div>

          <div class="m-4">
            <p>目前选择的模型信息</p>
            <div class="box-card">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-text class="mx-1">模型：</el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1">{{ selectedModel }}</el-text>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-text class="mx-1">参数量：</el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1">{{ paramSize }}</el-text>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-text class="mx-1">记载方式：</el-text>
                </el-col>
                <el-col :span="16">
                  <el-text class="mx-1"></el-text>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-text class="mx-1">模型架构：</el-text>
                </el-col>
                <el-col :span="16">
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
          <p>请输入测试的Prompt</p>
          <el-input
              v-model="inputText"
              :rows="4"
              placeholder="Please input"
              type="textarea"
          />
        </div>
        <div>
          <p>模型的输出结果</p>
          <div class="demo-rate-block">
            <el-text class="mx-1">{{ modelAnswer }}</el-text>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <p>可参考的答案</p>
              <div class="demo-rate-block">
                <el-text class="mx-1">{{ answerRight }}</el-text>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <p>请你给模型的输出结果打个分</p>
              <div class="demo-rate-block">
                <el-rate v-model="answerRate" size="large"/>
              </div>
            </div>
          </el-col>
        </el-row>
        <div>
          <p>如果觉得模型的输出结果不够好，麻烦进行改写哦～</p>
          <el-input
              v-model="inputText"
              :rows="4"
              placeholder="Please input"
              type="textarea"
          />
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
</style>

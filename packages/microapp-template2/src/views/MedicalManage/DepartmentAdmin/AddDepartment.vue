<template>
  <div class="AddDepartment">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>新增科室</template>
      <template #main>
        <el-form :model="departmentInfo" :rules="rules" label-width="100px">
          <el-form-item label="机构名称" prop="type">
            <el-select v-model="departmentInfo.hosId" clearable>
              <el-option :label="item.label" :value="item.value" v-for="item in hospitalList" :key="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室类型" prop="deptType">
            <el-select v-model="departmentInfo.deptType" @change="handleDeptTypeChange" clearable>
              <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in deptTypeList" :key="item.VALUE" />
            </el-select>
          </el-form-item>
          <el-form-item label="关联平台科室" prop="level">
            <el-select
              v-model="departmentInfo.parent1DicId"
              @change="(val) => handleDeptDicChange(val, 'parent2DicId', 'levelTwoDeptDicList')"
            >
              <el-option :label="item.label" :value="item.value" v-for="item in levelOneDeptDicList" :key="item.value" />
            </el-select>
            <el-select v-model="departmentInfo.parent2DicId" @change="(val) => handleDeptDicChange(val, 'dicId', 'levelThreeDeptDicList')">
              <el-option :label="item.label" :value="item.value" v-for="item in levelTwoDeptDicList" :key="item.value" />
            </el-select>
            <el-select v-model="departmentInfo.dicId">
              <el-option :label="item.label" :value="item.value" v-for="item in levelThreeDeptDicList" :key="item.value" />
            </el-select>
            <el-button type="primary" size="small" @click="syncDept">同步至科室名称</el-button>
          </el-form-item>
          <el-form-item label="科室名称" prop="level">
            <el-select v-model="departmentInfo.parent1Id" allow-create filterable placeholder="建议同步平台科室名称">
              <el-option v-for="item in levelOneDeptList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="departmentInfo.parent2Id" allow-create filterable placeholder="建议同步平台科室名称">
              <el-option v-for="item in levelTwoDeptList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="departmentInfo.id" allow-create filterable placeholder="建议同步平台科室名称">
              <el-option v-for="item in levelThreeDeptList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input placeholder="区号+电话号码" v-model="departmentInfo.telephone" />
          </el-form-item>
          <el-form-item label="办公时间">
            <el-select v-model="departmentInfo.officeHours">
              <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in officeHoursList" :key="item.VALUE" />
            </el-select>
            <el-time-picker
              is-range
              v-model="departmentInfo.officeTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="办公时间"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="科室图片">
            <div class="img-container">
              <div class="title">主图<span class="tips">（建议尺寸为800像素*400像素，大小不超过500kb）</span></div>
              <el-upload
                action="#"
                :http-request="(file) => uploadFiles(file.file, 'deptImageId', 'hosImageUrl')"
                :show-file-list="false"
                style="display: inline-block"
              >
                <div class="upload-container large">
                  <i class="el-icon el-icon-plus"></i>
                </div>
              </el-upload>
            </div>
            <div class="img-container">
              <div class="title">其他图片<span class="tips">（选传，建议尺寸为800像素*400像素，最多5张，大小不超过500kb）</span></div>
              <span class="upload-img-container" v-for="(item, index) in departmentInfo.otherImages" :key="item.filePath">
                <span class="img-actions">
                  <i class="el-icon el-icon-delete" @click="deleteOtherImages(item, index)"></i>
                </span>
                <img :src="item.filePath" alt="" height="68px" />
              </span>
              <div class="upload-container large inline-block" @click="$refs.fileInput.click()">
                <i class="el-icon el-icon-plus"></i>
              </div>
              <input type="file" multiple @change="handleChangeFileChange" ref="fileInput" style="display: none" />
            </div>
          </el-form-item>
          <el-tabs v-model="activeTab">
            <el-tab-pane name="科室介绍" label="科室介绍"></el-tab-pane>
            <el-tab-pane name="预约须知" label="预约须知"></el-tab-pane>
          </el-tabs>
          <div class="editor" id="hos-entroduce-editor" v-show="activeTab === '科室介绍'"></div>
          <div class="editor" id="reservation-notice-editor" v-show="activeTab === '预约须知'"></div>
          <el-form-item label="科室状态" prop="status">
            <el-switch v-model="departmentInfo.status" active-text="开启" inactive-text="停用" />
          </el-form-item>
        </el-form>
        <div class="btn-actions">
          <el-button type="primary" @click="saveDeptInfo">保存</el-button>
          <el-button>取消</el-button>
        </div>
      </template>
    </ProLayout>
  </div>
</template>
<script>
import ProLayout from '@/components/ProLayout.vue'
import {
  getHosOptions,
  getDictionary,
  getDeptDicOptions,
  getDeptOptions,
  uploadFiles,
  saveDeptInfo,
  getDeptDetail,
} from '@/api/modules/systemAdmin'
import E from 'wangeditor'

export default {
  data() {
    return {
      mode: 'add',
      deptId: '',
      hospitalList: [],
      deptTypeList: [],
      levelOneDeptDicList: [],
      levelTwoDeptDicList: [],
      levelThreeDeptDicList: [],
      levelOneDeptList: [],
      levelTwoDeptList: [],
      levelThreeDeptList: [],
      officeHoursList: [],
      departmentInfo: {},
      rules: {},
      activeTab: '科室介绍',
    }
  },
  async mounted() {
    this.mode = this.$route.query.mode
    this.deptId = this.$route.query.deptId
    this.initEditor()
    await this.getHosOptions()
    await this.getDictionary('DEPT_CLASSIFY', 'deptTypeList')
    await this.getDictionary('HOSPITAL_OFFICE_HOURS', 'officeHoursList')
    if (this.mode === 'edit') {
      await this.getDeptDetail()
      this.getDeptDicOptions('', 'levelOneDeptDicList')
      this.getDeptDicOptions(this.departmentInfo.parent1DicId, 'levelTwoDeptDicList')
      this.getDeptDicOptions(this.departmentInfo.parent2DicId, 'levelThreeDeptDicList')
      this.getDeptOptions('', 'levelOneDeptList')
      this.getDeptOptions(this.departmentInfo.parent1Id, 'levelTwoDeptList')
      this.getDeptOptions(this.departmentInfo.parent2Id, 'levelThreeDeptList')
    }
  },
  methods: {
    // 获取所有医院/机构
    async getHosOptions() {
      try {
        const res = await getHosOptions()
        console.log('getHosOptions==', res)
        this.hospitalList = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取科室类型
    async getDictionary(code, listType) {
      try {
        const res = await getDictionary({ code })
        console.log('getDictionary==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取关联平台科室
    async getDeptDicOptions(parentId, levelList) {
      try {
        const res = await getDeptDicOptions({
          parentId,
          deptClassify: this.departmentInfo.deptType,
        })
        console.log('getDeptDicOptions==', res)
        this[levelList] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取科室列表下拉
    async getDeptOptions(parentId, listType) {
      try {
        const res = await getDeptOptions({
          hosId: this.departmentInfo.hosId,
          deptClassify: this.departmentInfo.deptType,
          parentId,
        })
        console.log('getDeptOptions==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 初始化富文本编辑器
    initEditor() {
      this.hosIntroduceEditor = new E('#hos-entroduce-editor')
      this.hosIntroduceEditor.config.height = 196
      this.hosIntroduceEditor.create()

      this.reservationNoticeEditor = new E('#reservation-notice-editor')
      this.reservationNoticeEditor.config.height = 196
      this.reservationNoticeEditor.create()
    },

    // 获取科室详情
    async getDeptDetail() {
      try {
        const res = await getDeptDetail({ deptId: this.deptId })
        console.log('getDeptDetail==', res)
        this.departmentInfo = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 科室类型发生改变重新请求关联平台科室以及下拉科室
    async handleDeptTypeChange(newVal) {
      if (!newVal) {
        this.levelOneDeptDicList = []
        this.departmentInfo.parent1DicId = ''

        this.levelTwoDeptDicList = []
        this.departmentInfo.parent2DicId = ''

        this.levelThreeDeptDicList = []
        this.departmentInfo.dicId = ''
        return
      }
      this.getDeptDicOptions('', 'levelOneDeptDicList')
      this.getDeptOptions('', 'levelOneDeptDicList')
    },

    // 关联平台科室改变获取下一级科室
    async handleDeptDicChange(newVal, field, levelList) {
      this.departmentInfo[field] = ''
      this.getDeptDicOptions(newVal, levelList)
    },

    // 点击同步至科室名称
    syncDept() {
      const oneDeptDic = this.levelOneDeptDicList.find((item) => item.value === this.departmentInfo.parent1DicId)
      const twoDeptDic = this.levelTwoDeptDicList.find((item) => item.value === this.departmentInfo.parent2DicId)
      const threeDeptDic = this.levelThreeDeptDicList.find((item) => item.value === this.departmentInfo.dicId)
      console.log('oneDeptDic.label==', oneDeptDic.label)

      this.$set(this.departmentInfo, 'parent1Id', oneDeptDic ? oneDeptDic.label : '')
      this.$set(this.departmentInfo, 'parent2Id', twoDeptDic ? twoDeptDic.label : '')
      this.$set(this.departmentInfo, 'id', threeDeptDic ? threeDeptDic.label : '')
    },

    // 自定义文件上传处理
    handleChangeFileChange(e) {
      console.log(e)
      console.log(e.target.files)
      const files = e.target.files
      if (this.hospitalInfo.otherHosImageIds.length + files.length > 5) {
        alert('数量超了')
        return
      }
      for (let i = 0; i < files.length; i++) {
        console.log(i)
        if (files[i].size > 500 * 1024) {
          alert('大小超了')
          return
        }
      }
      for (let i = 0; i < files.length; i++) {
        this.uploadFiles(files[i], 'otherHosImageIds', 'otherImages')
      }
      e.target.value = ''
    },

    // 上传图片
    async uploadFiles(file, idField, imgUrlField) {
      console.log('file==', file)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await uploadFiles(formData)
        console.log('uploadFiles', res)
        if (Array.isArray(this.departmentInfo[idField])) {
          this.departmentInfo[idField].push(res.result.id)
          this.departmentInfo[imgUrlField].push({ filePath: res.result.url, id: res.result.id })
        } else {
          this.departmentInfo[idField] = res.result.id
          this.departmentInfo[imgUrlField] = res.result.url
          console.log(this.departmentInfo.logoUrl)
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 图片删除
    deleteOtherImages(img, index) {
      const idIndex = this.departmentInfo.otherHosImageIds.findIndex((item) => item === img.fileId)
      console.log(this.departmentInfo.otherHosImageIds, img.fileId)
      if (idIndex !== -1) {
        this.departmentInfo.otherImages.splice(index, 1)
        this.departmentInfo.otherHosImageIds.splice(index, 1)
      }
    },

    // 保存提交
    async saveDeptInfo() {
      // 新增并且没有新输入科室就return
      if (this.mode === 'add' && this.checkDeptHasExist()) {
        return
      }

      const params = {
        ...this.departmentInfo,
        hosIntroduce: this.hosIntroduceEditor.txt.html(),
        reservationNotice: this.reservationNoticeEditor.txt.html(),
        status: this.departmentInfo.status ? 'Y' : 'N',
        ...this.getDeptIdAndNameResult(),
      }
      console.log('params==', params)
      try {
        const res = await saveDeptInfo(params)
        console.log('saveDeptInfo==', res)
      } catch (err) {
        console.error(err)
      }
    },

    // 校验科室是否存在
    checkDeptHasExist() {
      if (this.departmentInfo.id && this.levelOneDeptList.find((item) => item.value === this.departmentInfo.id)) {
        alert('该科室已存在')
        return true
      }

      if (this.departmentInfo.parent2Id && this.levelTwoDeptList.find((item) => item.value === this.departmentInfo.parent2Id)) {
        alert('该科室已存在')
        return true
      }

      if (this.departmentInfo.parent1Id && this.levelThreeDeptList.find((item) => item.value === this.departmentInfo.parent1Id)) {
        alert('该科室已存在')
        return true
      }
      return false
    },

    // 转换科室Id与名称
    getDeptIdAndNameResult() {
      const result = {
        parent1Id: '', //一级科室ID,
        parent1Name: '', // 一级科室名称,
        parent2Id: '', // 二级科室ID,
        parent2Name: '', // 二级科室名称,
        id: '', // 三级科室ID,
        name: '', // 三级科室名称,
      }
      if (this.departmentInfo.parent1Id) {
        const dept = this.levelOneDeptList.find((item) => item.value === this.departmentInfo.parent1Id)
        if (dept) {
          result.parent1Id = dept.value
          result.parent1Name = dept.label
        } else {
          result.parent1Id = ''
          result.parent1Name = this.departmentInfo.parent1Id
        }
      }

      if (this.departmentInfo.parent2Id) {
        const dept = this.levelTwoDeptList.find((item) => item.value === this.departmentInfo.parent2Id)
        if (dept) {
          result.parent2Id = dept.value
          result.parent2Name = dept.label
        } else {
          result.parent2Id = ''
          result.parent2Name = this.departmentInfo.parent2Id
        }
      }

      if (this.departmentInfo.id) {
        const dept = this.levelThreeDeptList.find((item) => item.value === this.departmentInfo.id)
        if (dept) {
          result.id = dept.id
          result.name = dept.label
        } else {
          result.id = ''
          result.name = this.departmentInfo.id
        }
      }
      return result
    },
  },
  components: {
    ProLayout,
  },
}
</script>

<style lang="scss" scoped>
.AddDepartment {
  background: #fff;
  .department-info {
    padding: 24px;
    background: #fff;
    .el-tabs__header {
      padding: 0;
      position: relative;
      margin: 0 !important;
    }
    .el-tabs__nav,
    .el-tabs__nav-scroll {
      background-color: #fff !important;
    }
    .el-tabs__item.is-top.is-active {
      border-bottom: none !important;
    }
    .el-tabs__item.is-active {
      color: #134796 !important;
    }
    .el-tabs__item {
      font-size: 16px;
      color: #949da3 !important;
    }
    .el-tabs__active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background-color: #134796 !important;
      z-index: 1;
      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      list-style: none;
      border-radius: 4px !important;
    }
    .el-tabs__nav-wrap::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      background-color: #e4e7ed;
      z-index: 1;
    }
    .upload-container {
      width: 34px;
      height: 34px;
      font-size: 18px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #d9d9d9;
      &.inline-block {
        cursor: pointer;
        display: inline-block;
      }
      &.large {
        width: 68px;
        height: 68px;
        font-size: 36px;
        line-height: 68px;
      }
    }
    .upload-img-container {
      display: inline-block;
      vertical-align: middle;
      margin-top: -20px;
      margin-right: 10px;
      border: 1px solid #ccc;
      height: 68px;
      position: relative;
      .img-actions {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        line-height: 68px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .tips {
      font-size: 12px;
      color: #919191;
      &.left {
        margin-left: 10px;
      }
    }
    .img-container {
      &:first-child {
        margin-bottom: 10px;
      }
    }
    .address-input {
      width: 500px;
    }
    .map {
      height: 200px;
      background: red;
      margin: 10px 0;
    }
    .editor {
      height: 236px;
      border: 1px solid #ccc;
      margin-bottom: 22px;
    }
    .btn-actions {
      text-align: right;
    }
  }
}
</style>

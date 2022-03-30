<template>
  <el-drawer :with-header="false" :visible="visible" direction="rtl" :before-close="handleClose" :size="520">
    <div class="batch-add">
      <div class="drawer-title">批量新建</div>
      <div class="content">
        <el-form>
          <el-form-item label="医院名称">
            <el-select v-model="batchDetail.name">
              <el-option label="西红柿中心医院" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="科室类型">
            <el-checkbox-group v-model="batchDetail.deptType">
              <el-checkbox label="门诊">门诊</el-checkbox>
              <el-checkbox label="住院">住院</el-checkbox>
              <el-checkbox label="行政">行政</el-checkbox>
              <el-checkbox label="后勤">后勤</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="科室信息">
            <el-transfer v-model="batchDetail.roles" :data="allRoles" :titles="['科室列表', '科室机构']" filterable />
          </el-form-item>
          <el-form-item label="科室状态" prop="status">
            <el-switch v-model="batchDetail.status" active-text="开启" inactive-text="停用" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      batchDetail: {
        deptType: [],
      },
      allRoles: [{ key: '1', label: '角色1' }],
    }
  },
  methods: {
    handleClose() {},
  },
}
</script>

<style lang="scss" scoped>
.batch-add {
  .drawer-title {
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
    color: #303133;
    padding: 17px 13px;
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    &:before {
      content: ' ';
      display: inline-block;
      width: 3px;
      height: 16px;
      background: #134796;
      position: absolute;
      left: 0;
    }
  }
  .content {
    padding: 20px;
  }
  ::v-deep .el-transfer-panel {
    width: 176px;
    .el-checkbox__label {
      font-size: 14px;
    }
  }
  ::v-deep .el-transfer__buttons {
    padding: 0 5px;
    button {
      display: block;
      margin: 5px 0;
      width: 24px;
      height: 24px;
      padding: 0;
    }
  }
}
</style>

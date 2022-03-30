//标准管理接口
import http from '../index'

// 获取组织机构列表
export const getOrgTree = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgTree',
    params,
  })

// 保存医院/机构
export const saveOrg = (data) =>
  http.post({
    url: '/ygt-user/org/onSaveOrg',
    data,
  })

// 上级机构级联
export const getOrgOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgOptions',
    params,
  })

// 机构删除
export const deleteOrg = (params) =>
  http.get({
    url: '/ygt-user/org/onDelOrg',
    params,
  })

// 医院列表查询
export const getHospitalList = (data) =>
  http.post({
    url: '/ygt-user/org/onQueryHos',
    data,
  })

// 查询医院详细信息
export const getHospitalDetail = (params) =>
  http.get({
    url: '/ygt-user/tbMhOrgDetail/onQueryHosDetailById',
    params,
  })

// 上传图片
export const uploadFiles = (data) =>
  http.post({
    url: '/ygt-user/tbFilePath/uploadFiles',
    data,
  })

// 字典数据
export const getDictionary = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getDictionary',
    params,
  })

// 医院信息保存
export const saveHospitalInfo = (data) =>
  http.post({
    url: '/ygt-user/tbMhOrgDetail/onSaveHosDetail',
    data,
  })

// 获取科室列表
export const getDepartmentList = (data) =>
  http.post({
    url: '/ygt-user/org/onQueryDept',
    data,
  })

// 获取医院/机构列表
export const getHosOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getHosOptions',
    params,
  })

// 关联平台科室列表
export const getDeptDicOptions = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getDeptDicOptions',
    params,
  })

// 科室下拉框
export const getDeptOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getDeptOptions',
    params,
  })

// 获取科室详情
export const getDeptDetail = (params) =>
  http.get({
    url: '/ygt-user/tbMhOrgDetail/onQueryDeptDetailById',
    params,
  })

// 科室信息保存
export const saveDeptInfo = (data) =>
  http.post({
    url: '/ygt-user/tbMhOrgDetail/onSaveDeptDetail',
    data,
  })

// 用户管理
// 查询用户列表
// {
// 	"name":登录名/姓名,
//   	"status":状态,
//   	"createDateS":添加开始日期,
//   	"createDateE":添加结束日期,
//   	"pageNum":页数,
//   	"pageSize":每页条数
// }
export const onQueryAccountList = (data) =>
  http.post({
    url: '/ygt-user/user/onQueryAccountList',
    data,
  })
// 批量停用用户
// {
//   "userIds":[]勾选用户id
// }
export const onBatchStopAccounts = (data) =>
  http.post({
    url: '/ygt-user/user/onBatchStopAccounts',
    data,
  })

// 保存账号
// {
//   "id":用户id
//   "name":姓名
//   "loginName":登录名
//   "loginPwd":登录密码
//   "orgIds":
//   "sex":性别
//   "telephone":手机号码
//   "certificateType":证件类型
//   "certificateNum":证件号码
//   "email":邮箱
//   "status":状态
//   "roleIds":角色
//   "roleDescribe":备注
// }
export const onSaveUserAccount = (data) =>
  http.post({
    url: '/ygt-user/user/onSaveUserAccount',
    data,
  })

// 停用/启用
// {
//   "userId":用户id,
//    "status":用户状态，0-关闭，1-开启
//  }
export const updateStatus = (data) =>
  http.post({
    url: '/ygt-user/user/updateStatus',
    data,
  })

// 角色下拉框
// "orgIds":[]机构id
export const getRoleOptions = (data) =>
  http.post({
    url: '/ygt-user/role/getRoleOptions',
    data,
  })
// 返显用户
// "id":
export const getUserAccountMes = (params) =>
  http.get({
    url: '/ygt-user/user/getUserAccountMes',
    params,
  })

// 重置密码
// {
//   "id":用户ID
//   "loginPwd":新密码
// }
export const onResetPassword = (data) =>
  http.post({
    url: '/ygt-user/user/onResetPassword',
    data,
  })

  // 角色列表
  // /ygt-user/role/onQueryRole
  // POST
  // {
  //   name:角色名称/角色ID
  //   roleLevelId:角色级别
  //   status:状态
  //   authorizeStatus:授权状态
  //   createDateS:添加开始日期
  //   createDateE:添加结束日期
  //   pageNum:页数
  //   pageSize:每页条数
  // }

//   角色级别下拉
// /ygt-user/tbDictionaryGroup/getRoleLevels
// GET
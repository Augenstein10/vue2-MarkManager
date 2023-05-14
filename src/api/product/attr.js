//引入封装好的axios
import request from '@/utils/request'
//获取商品分类
//一级分类
export const reqCategoryList1 = () => request({url:'/admin/product/getCategory1',method:'/admin/product/getCategory1',method:'get'});

//二级分类
export const reqCategoryList2 = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'});

//三级分类
export const reqCategoryList3 = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'});

//获取商品基础属性接口
export const reqAttrList = (category1Id, category2Id, category3Id)=> request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method:'get'});

//添加属性与属性值接口
export const reqAddAttr = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data});

//引入axios
import request from '@/utils/request'
//获取spu列表  /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id)=> request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
//获取修改页面SPU信息  /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

//获取SPU修改页面的品牌数据
// /admin/product/baseTrademark/getTrademarkList
export const getTradeMarkList = ()=> request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'});
//获取SPU照片墙 /admin/product/spuImageList/{spuId}
export const getSpuImageList = (spuId)=> request({url:`/admin/product/spuImageList/${spuId}`, method:'get'});
//获取平台销售属性信息 /admin/product/baseSaleAttrList
export const getSaleAttr = ()=> request ({url:'/admin/product/baseSaleAttrList',method:'get'});
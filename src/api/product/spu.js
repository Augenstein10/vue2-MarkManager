//引入axios
import request from '@/utils/request'
//获取spu列表  /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
//获取修改页面SPU信息  /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

//获取SPU修改页面的品牌数据
// /admin/product/baseTrademark/getTrademarkList
export const getTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });
//获取SPU照片墙 /admin/product/spuImageList/{spuId}
export const getSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });
//获取平台销售属性信息 /admin/product/baseSaleAttrList
export const getSaleAttr = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });
//添加或者修改spu的提交操作
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    //修改操作
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });

  } else {
    //添加操作
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });

  }
}
//删除SPU  /admin/product/deleteSpu/{spuId}
export const reqDelSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});

//获取图片数据
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取销售属性的数据
export const reqSpuSaleAtrrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

//获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//sku列表的保存
export const reqSaveSku = (skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post', data:skuInfo});

//通过spuId查看sku列表
export const reqSkuBySpuId = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});
//引入封装好的axios
import request from '@/utils/request';

//获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//添加或修改品牌接口
export const reqAddorUpdaeTradeMark = (trademark) => {
  if (trademark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put',data:trademark})
  } else {
    return request({ url: '/admin/product/baseTrademark/save', method: 'post' , data:trademark});
  }
}

//删除品牌
export const deleteTrademark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
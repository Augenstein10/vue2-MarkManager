//将四个模块请求接口函数统一暴露
import * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'

//对外暴露（并对其全局使用）
export default{
  trademark,
  attr,
  sku,
  spu
}
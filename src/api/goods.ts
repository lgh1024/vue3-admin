import myRequest from "./api";

interface goodsList {
  pagenum:number
  pagesize:number
  query?:string
}
interface PutGoodsRule{
  goods_name: string
  goods_price: number
  goods_weight: number
  goods_number: number
  goods_cat: string
  goods_introduce?: string
  pics?:object
  attrs?:Array<string>
}
interface EGoods  {
  id: number
  goods_name: string
  goods_price: number
  goods_number: number
  goods_weight: number
}

export function getGoods(data: goodsList) {
  return myRequest.request({
    url: '/goods',
    params: data
  })
}

export function deleteGoods(id:number) {
  return myRequest.request({
    url: `/goods/${id}`,
    method:'delete'
  })
}

export function getCategories(type?:number) {
  return myRequest.request({
    url: '/categories',
    params:{
      type
    }
  })
}

export function putGoods(data:PutGoodsRule) {
  return myRequest.request({
    url: '/goods',
    method:'post',
    data
  })
}

export function editGoodsFromId(data: EGoods) {
  return myRequest.request({
    url: `/goods/${data.id}`,
    method:'put',
    data
  })
}
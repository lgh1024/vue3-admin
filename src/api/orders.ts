import myRequest from './api'

interface EOrders {
  id: number
  order_price: number
  is_send?: number
  order_pay?: number
}

export function getOrders(pagesize: number, pagenum: number) {
  return myRequest.request({
    url: '/orders',
    params: {
      pagesize,
      pagenum
    }
  })
}

export function editOrders(data: EOrders) {
  return myRequest.request({
    url: `/orders/${data.id}`,
    method: 'put',
    data
  })
}


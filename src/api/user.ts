import myRequest from "./api";

interface userList {
  pagenum:number,
  pagesize:number,
  query?:string
}
interface addUserList {
  username?:string,
  password:string,
  email:string,
  mobile:string
}
interface EUser  {
  id: number
  username: string
  email: string
  mobile: string
}

export function getUser(data:userList) {
  return myRequest.request({
    url: '/users',
    params: data
  })
}
export function changeUserStatus(uId:number,type:boolean) {
  return myRequest.request({
    url: `users/${uId}/state/${type}`,
    method:'put',
  })
}
export function addUser(data:addUserList) {
  return myRequest.request({
    url: '/users',
    method:'post',
    data
  })
}
export function editUsersFromId(data: EUser) {
  return myRequest.request({
    url: `users/${data.id}`,
    method:'put',
    data
  })
}
export function deleteUsersFromId(id:number) {
  return myRequest.request({
    url: `users/${id}`,
    method:'delete'
  })
}
export function getRoles() {
  return myRequest.request({
    url: '/roles',
  })
}
export function assignUserRole(id:number,rid:number) {
  return myRequest.request({
    url: `users/${id}/role`,
    method:'put',
    data:{
      rid
    }
  })
}
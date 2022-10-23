import myRequest from "./api";

export function getAccout(data: any) {
  return myRequest.post({
    url: '/login',
    data
  })
}
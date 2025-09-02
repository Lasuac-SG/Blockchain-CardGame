import { request } from './request'

// 登录
export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

// 注册
export function register(email, name, password) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ email, name, password })
  })
}

// 获取用户信息
export function getProfile() {
  return request('/auth/user/profile', {
    method: 'POST',
    body: JSON.stringify({}) // 发送空对象
  })
}

// 退出登录
export function logout(router) {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

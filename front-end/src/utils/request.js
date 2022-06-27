import { message } from 'antd';
import { API_HOST } from './const';
import { getToken } from './index';

const canSendData = (method = 'get') => ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase());

/**
 * 封装的请求方法
 * @param {string} url
 * @param {object} options
 * @returns
 */
export default function _fetch (url, options = {}) {
  const { method, data, token } = options;
  const opts = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token || getToken()}`,
    },
    cache: 'no-cache',
    body: canSendData(method) ? JSON.stringify(data || {}) : undefined,
  }
  return fetch(`${API_HOST}${url}`, opts)
    .then(res => res.json())
    .then(data => {
    // deal error
      if (data.error) {
      // deal token error
        if (data.error.includes('invalid token')) {
          message.error('token expired, please login');
          location.hash = 'login';
        } else {
          message.error(data.error, 'error');
        }
        return;
      }
      return data;
    });
}

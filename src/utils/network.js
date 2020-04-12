/* eslint-disable */

import axios from 'axios';

const get = (url, callback, callOnErr) => {

  let request = axios.get(url)
    .then((response) => {
      if (callback) {
        callback(response.data)
      } else {
        console.error('Get Request DEAD END');
      }
    })
    .catch((error) => {
      if (callOnErr) {
        callback()
      } else {
        console.log(error);
      }
  });

  return request
}

const post = (collection, data, callback, callOnErr) => {
  let url = `/api/${collection}`
  let request = axios.post(url, data)
    .then((response) => {
      callback(response.data)
    })
    .catch((error) => {
      if (callOnErr) {
        console.error(error);
        callback()
      } else {
        console.error(error);
      }
  });
  return request
}

export default {
  get,
  post,
};

/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const method = options.method.toUpperCase();
  let url = options.url;
  let data = null;
  const xhr = new XMLHttpRequest;
  xhr.responseType = 'json';

  if (options.data) {
      const params = new URLSearchParams(options.data).toString();
      url += '?' + params;
  };

  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.callback(null, xhr.response);
      } else {
        options.callback(xhr.statusText);
      }
    }
  })

  try {
    xhr.open( method, url );
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }
    xhr.send();
  }
  catch (err) {
    console.error(err);
  }
};

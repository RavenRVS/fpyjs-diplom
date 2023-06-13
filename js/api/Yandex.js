/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    let token = localStorage.getItem('yandexToken');
    if (!token) {
      token = prompt('Введите ваш Yandex OAuth токен:');
      localStorage.setItem('yandexToken', token);
    }
    return token;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
  
    const options = {
      method: 'POST',
      url: Yandex.HOST + '/resources/upload',
      data: { url, path },
      headers: {
        Authorization: `OAuth ${Yandex.getToken()}`
      },
      callback: callback
    };

    createRequest(options);
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const options = {
      method: 'DELETE',
      url: Yandex.HOST + '/resources',
      data: { path },
      headers: {
        Authorization: `OAuth ${Yandex.getToken()}`
      },
      callback: callback,
    };
    createRequest(options);
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    const options = {
      method: 'GET',
      url: Yandex.HOST + '/resources/files',
      headers: {
        Authorization: `OAuth ${Yandex.getToken()}`
      },
      data: { media_type: 'image', },
      callback: callback,
    };
    createRequest(options);
  }

  /**
   * Метод скачивания файлов
   */
  static getUrlForDownloadFile(path){
    const options = {
      method: 'GET',
      url: Yandex.HOST + '/resources/download',
      headers: {
        Authorization: `OAuth ${Yandex.getToken()}`
      },
      data: { path: path, },
      callback: this.downloadFileByUrl,
    };
    createRequest(options);
  }

  static downloadFileByUrl(err, response){
    const href = response.href;
    const options = {
      method: 'GET',
      url: href,
      headers: {
        Authorization: `OAuth ${Yandex.getToken()}`
      },
      callback: () => {},
    };
    createRequest(options);
  }
}

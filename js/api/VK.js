/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = localStorage.getItem('vkTkn');
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;
    if (!this.ACCESS_TOKEN) {
      this.ACCESS_TOKEN = prompt('Введите токен для VK');
      localStorage.setItem('vkTkn', this.ACCESS_TOKEN);
    } 
    let script = document.createElement('SCRIPT');
    script.id = 'vk';
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    document.getElementsByTagName("body")[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    let oldScript = document.getElementById('vk');
    if (oldScript != null || oldScript != undefined) {
        oldScript.remove();
    };
    if (result.hasOwnProperty('error')) {
      alert('Ошибка запроса к VK API');
      return
    } else {
      let photoList = []
      result.response.items.forEach(element => {
          photoList.push(element.sizes.at(-1).url)
      });
      this.lastCallback(photoList)
      this.lastCallback = ()=>{};
    }
  }
}

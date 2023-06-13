/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    const content = this.DOMElement.querySelector('.content');
    const modalCloseButton = this.DOMElement.querySelector('.x.icon');

    // Закрытие модального окна при клике на крестик
    modalCloseButton.addEventListener('click', () => {
      this.close();
    });

    // Обработчик события клика на блок тела модалки
    content.addEventListener('click', (event) => {
      const target = event.target;

      if (target.classList.contains('delete')) {
        // Если был клик на кнопке удаления
        const icon = target.querySelector('i');
        icon.classList.add('icon', 'spinner', 'loading');
        target.classList.add('disabled');

        const path = target.dataset.path;

        Yandex.removeFile(path, (err, data) => {
          if (!err && !data) {
            // Успешное удаление файла
            const container = target.closest('.image-preview-container');
            container.parentNode.removeChild(container);
          } else {
            // Ошибка при удалении файла
            console.error(`Failed to remove file '${path}'`, err || data);
            icon.classList.remove('icon', 'spinner', 'loading');
            target.classList.remove('disabled');
          }
        });
      } else if (target.classList.contains('download')) {
        // Если был клик на кнопке загрузки
        const fileUrl = target.dataset.file;
        Yandex.getUrlForDownloadFile(fileUrl);
      }
    });
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    if (!data) {
      this.DOMElement.querySelector('.content').innerHTML = '';
    }
    const reversedImages = data.items.reverse();

    const containers = reversedImages.map((image) => {
      const imageInfo = this.getImageInfo(image);

      return `<div class="image-preview-container">${imageInfo}</div>`;
    });

    this.DOMElement.querySelector('.content').innerHTML = containers.join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const dateObj = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return dateObj.toLocaleString('ru', options);
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    const name = item.name;
    const preview = item.preview;
    const path = item.path;
    const created = this.formatDate(item.created);
    const size = Math.round(item.size / 1024); // in KB

    return `
      <img src="${preview}" />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${name}</td><td>${created}</td><td>${size}Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${path}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${path}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    `;
  }
}

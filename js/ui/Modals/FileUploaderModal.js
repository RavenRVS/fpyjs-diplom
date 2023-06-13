/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);

    this.imageContainers = element[0];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    const closeModalButton = this.DOMElement.querySelector('.x.icon');
    const closeButton = this.DOMElement.querySelector('.ui.close.button');
    const sendAllImagesButton = this.DOMElement.querySelector('.ui.send-all.button');
    const contentBlock = this.DOMElement.querySelector('.content');

    closeModalButton.addEventListener('click', () => {
      this.close();
    });

    closeButton.addEventListener('click', () => {
      this.close();
    });

    sendAllImagesButton.addEventListener('click', () => {
      this.sendAllImages();
    });

    contentBlock.addEventListener('click', (event) => {
      const target = event.target;
      const imageContainer = target.closest('.image-preview-container');

      if (target.classList.contains('input')) {
        imageContainer.classList.remove('error');
      }

      if (target.classList.contains('button-upload')) {
        this.sendImage(imageContainer);
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    const imagesHTML = Array.from(images)
    .reverse()
    .map((image) => this.getImageHTML(image))
    .join('');

    this.DOMElement.querySelector('.content').innerHTML = imagesHTML;
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
      <img src='${item.src}' />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button button-upload"><i class="upload icon"></i></button>
      </div>
    </div>
  `;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    this.imageContainers.querySelectorAll('.image-preview-container').forEach((container) => {
      this.sendImage(container);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const inputBlock = imageContainer.querySelector('.input');
    const inputField = inputBlock.querySelector('input');
    const imagePath = inputField.value.trim();

    if (!imagePath) {
      inputBlock.classList.add('error');
      return;
    }

    inputBlock.classList.add('disabled');

    const imageSrc = imageContainer.querySelector('img').getAttribute('src');

    Yandex.uploadFile(imagePath, imageSrc, () => {
      imageContainer.remove();

      if (this.DOMElement.querySelector('.image-preview-container') === null) {
        this.close();
      }
    });
  }
}
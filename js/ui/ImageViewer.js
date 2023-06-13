/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.imagesList = this.element.getElementsByClassName('images-list')[0];
    this.preview = this.element.getElementsByClassName('column')[1];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    this.imagesList.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('img')){
        let src = e.target.getAttribute('src');
        this.preview.getElementsByClassName('image')[0].setAttribute('src', src);
      };
    });
    this.imagesList.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('img')){
        e.target.classList.toggle('selected');
        this.checkButtonText()
      };
      if (e.target.classList.contains('select-all')){
        if (!e.target.classList.contains('disabled')){
          let allImages = Array.from(e.currentTarget.getElementsByTagName('img'));
          let selectedMarker = false;
          allImages.forEach(el => {
            if (el.classList.contains('selected')){
              selectedMarker = true;
            }
          });
          if (selectedMarker === true){
            allImages.forEach(el => {
              el.classList.remove('selected');
            });
          } else {
            allImages.forEach(el => {
              el.classList.add('selected');
            });
          }
          this.checkButtonText();
        }
      };
      if (e.target.classList.contains('show-uploaded-files')){
        let filePreviwer = App.getModal("filePreviewer");
        filePreviwer.open();
        Yandex.getUploadedFiles((err, data) => {
          filePreviwer.showImages(data);
        });
      };
      if (e.target.classList.contains('send')){
        let fileUploader = App.getModal("fileUploader");
        fileUploader.open();
        let selectedImages = e.currentTarget.getElementsByClassName('selected');
        fileUploader.showImages(selectedImages);
      };
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    let images = Array.from(this.imagesList.getElementsByClassName('image-wrapper'));
    if (images.length > 0){
      images.forEach((e) => {
        e.remove();
      });
    };
  };

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    const selectAllButton = this.imagesList.getElementsByClassName('select-all')[0];
    console.log(images)
    if (images.length > 0){
      selectAllButton.classList.remove('disabled')
    } else {
      selectAllButton.classList.add('disabled')
    };
    images.forEach((e => {
      let newImage = document.createElement('div');
      newImage.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper')
      newImage.innerHTML = `<img class="img" src=${e} />`;
      this.imagesList.append(newImage)
    }))
    this.checkButtonText()
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const images = Array.from(this.imagesList.getElementsByClassName('img'));
    const selectAllButton = this.imagesList.getElementsByClassName('select-all')[0];
    const sendButton = this.imagesList.getElementsByClassName('send')[0];
    let countSelectedImages = 0;
    if (images) {
      images.forEach(image => {
        if (image.classList.contains('selected')) {
          countSelectedImages += 1;
        };
      });
    };
    if (countSelectedImages === images.length) {
      selectAllButton.textContent = 'Снять выделение';
    } else {
      selectAllButton.textContent = 'Выбрать всё';
    };
    if (countSelectedImages > 0) {
      sendButton.classList.remove('disabled')
    } else {
      sendButton.classList.add('disabled')
    };
  };
}
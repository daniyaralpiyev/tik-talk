import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

// Что делает этот код?
// Позволяет перетаскивать файл на элемент и отслеживать события drag-and-drop
// @HostListener	Отслеживание событий drag & drop
// @Output	Передача файла наружу
// @HostBinding	Подсветка элемента при наведении файла
@Directive({
  selector: '[dnd]'
})
export class Dnd {
  // Создаёт событие fileDropped, которое отправляет(эмитит) файл наружу.
  // Создаётся событие, которое будет вызываться, когда пользователь отпустит файл на элемент.
  @Output() fileDropped = new EventEmitter<File>();

  // Автоматически добавляет CSS-класс fileOver на элемент, когда fileOver = true.
  // Но изначально fileOver = false
  @HostBinding('class.fileOver')
  fileOver = false

  // Срабатывает, когда пользователь тащит файл над элементом.
  @HostListener('dragover',['$event'])
    onDragOver(event: DragEvent){
    event.preventDefault(); // отключает поведение браузера (например, открытие файла)
    event.stopPropagation(); // останавливает всплытие события

    this.fileOver = true; // включаем подсветку (добавляется класс fileOver)
  }

  // Срабатывает, когда курсор покидает элемент.
  @HostListener('dragleave',['$event'])
  onDragLeave(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false; // убираем подсветку
  }

  // Срабатывает, когда пользователь отпустил файл над элементом.
  // event.dataTransfer.files — это список загруженных файлов.
  // Мы берём первый файл ([0]) и эмитим наружу через fileDropped.
  @HostListener('drop',['$event'])
  onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    this.fileDropped.emit(event.dataTransfer?.files[0]); // отдаем файл наружу
  }
}

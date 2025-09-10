import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'imgUrl', // используем в файле html
  standalone: true
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null; // если value будет false выдаст null

    // вернет эндпойнт с переданный пайп значением в value хранит путь к файлу к картинке
    return `https://icherniakov.ru/yt-course/${value}`;
  }

}

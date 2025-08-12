// src/app/custom-relative-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customRelativeDate',
  pure: false // Позволяет обновлять значение при изменении времени
})
export class CustomRelativeDatePipe implements PipeTransform {
  transform(value: string | null): string {
    // Если нет значения, возвращаем "Нет данных"
    if (!value) {
      return 'Нет данных';
    }

    // Парсим дату с учётом часового пояса UTC+5
    let date: Date;
    const [datePart, timePart] = value.split(' ');
    if (datePart && timePart) {
      const [day, month, year] = datePart.split('.');
      const [hours, minutes] = timePart.split(':');
      date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), 0));
      date.setUTCHours(date.getUTCHours() + 5); // Смещение UTC+5
    } else {
      date = new Date(value); // Пробуем как ISO-строку
      if (!isNaN(date.getTime())) {
        date.setUTCHours(date.getUTCHours() + 5); // Корректируем на UTC+5
      }
    }

    // Проверяем, корректно ли распарсена дата
    if (isNaN(date.getTime())) {
      console.error('Неверная дата:', value); // Отладка
      return 'Неверная дата';
    }

    // Текущее время с учётом UTC+5 и отставание на 5 часов
    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 5); // Смещение на UTC+5
    now.setUTCHours(now.getUTCHours() - 5); // Отставание на 5 часов

    // Разница в миллисекундах
    const diffMs = now.getTime() - date.getTime();

    // Преобразуем разницу
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Логика вывода с отладкой
    console.log('Parsed date:', date, 'Adjusted now:', now, 'Diff (ms):', diffMs);
    if (days > 0) {
      return `${days} ${this.getDayWord(days)}  назад`;
    } else if (hours > 0) {
      const remainingMinutes = minutes % 60;
      if (remainingMinutes > 0) {
        return `${hours} ${this.getHourWord(hours)} ${remainingMinutes} ${this.getMinuteWord(remainingMinutes)} назад`;
      }
      return `${hours} ${this.getHourWord(hours)} назад`;
    } else if (minutes > 0) {
      return `${minutes} ${this.getMinuteWord(minutes)}  назад`;
    } else {
      return 'только что';
    }
  }

  // Правильная форма слова "день"
  private getDayWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дн.';
    if (lastDigit === 1) return 'дн.';
    if ([2, 3, 4].includes(lastDigit)) return 'дн.';
    return 'дн.';
  }

  // Правильная форма слова "час"
  private getHourWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'ч.';
    if (lastDigit === 1) return 'ч.';
    if ([2, 3, 4].includes(lastDigit)) return 'ч.';
    return 'ч.';
  }

  // Правильная форма слова "минута"
  private getMinuteWord(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'мин.';
    if (lastDigit === 1) return 'мин.';
    if ([2, 3, 4].includes(lastDigit)) return 'мин.';
    return 'мин.';
  }
}

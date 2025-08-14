import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'customUtcPlus5'
})
export class UtcPlus5Pipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    return DateTime
      .fromISO(value.toString(), { zone: 'utc' })
      .plus({ hours: 5 })
      .toFormat('HH:mm');
  }
}

import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AboutMyselfService {
  getAddresses() {
    return of ([
      {
        city: 'dubai',
        street: 'dubai marina street',
        home: 111,
        apartment: 222,
        phone: 1234567890,
      }
    ])
  }

  getFeatures(): Observable<Feature[]> {
    return of ([
      {
        code: 'case',
        label: 'Чехол',
        value: true
      },
      {
        code: 'charging',
        label: 'Выбор зарядки',
        value: false
      },
      {
        code: 'headphones',
        label: 'Наушники',
        value: false
      },
      {
        code: 'repair',
        label: 'Ремонт вне очереди',
        value: false
      }
    ])
  }
}

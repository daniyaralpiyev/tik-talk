import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  standalone: true,        // директива не зависит от модуля, можно сразу импортировать
  selector: '[noReact]',   // использовать как атрибут: <input noReact>
  providers: [{
    provide: NG_VALIDATORS,        // говорим Angular, что это валидатор
    useExisting: NoReactValidator, // используем сам класс NoReactValidator
    multi: true,                   // можно несколько валидаторов на один input
  }]
})
export class NoReactValidator implements Validator {
  // Это ссылка на функцию, которая уведомляет Angular,
  // что валидатор изменился (нужно заново проверить поле).
  change!: () => void;

  // validate(control: AbstractControl) — главный метод валидатора.
  // Проверяет значение поля (control.value).
  validate(control: AbstractControl): ValidationErrors | null {
    console.log(control.value);

    // Предполагается, что control.value — строка.
    // Если значение (в нижнем регистре) равно 'react' — возвращаем ошибку.
    return control.value?.toLowerCase() === 'react'
      ? {noReact: {
        message: `НИКАКИХ РЕАКТОВ!!! ${control.status}`
      }}
      : null;
  }

  // Angular вызывает этот метод, если нужно обновить валидатор (например,
  // когда правила меняются динамически).
  // Здесь мы просто сохраняем функцию fn, чтобы потом при изменениях
  // можно было вызвать this.change() и пересчитать ошибки.
  registerOnValidatorChange(fn: () => void): void {
    this.change = fn;
  }
}

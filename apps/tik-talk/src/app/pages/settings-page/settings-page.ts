import {AfterViewInit, Component, effect, ElementRef, inject, Renderer2, ViewChild} from '@angular/core';
import {ProfileHeader} from '../../common-ui/profile-header/profile-header';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {firstValueFrom, fromEvent} from 'rxjs';
import {AvatarUpload} from './avatar-upload/avatar-upload';
import {Router, RouterLink} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {ProfileService} from '@tt/profile';
import {SvgIcon} from '@tt/common-ui';

@Component({
  selector: 'app-settings-page',
  imports: [
    ProfileHeader,
    ReactiveFormsModule,
    AvatarUpload,
    SvgIcon,
    RouterLink
  ],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss'
})
export class SettingsPage implements AfterViewInit {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  router = inject(Router);
  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  @ViewChild(AvatarUpload) avatarUploader!: AvatarUpload

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    // {value:'', disabled: true} ставит блок и не дает изменять изначальные значения
    username: [{value:'', disabled: true}, Validators.required],
    description: [''],
    stack: ['']
  })

  constructor() {
    effect(() => { // выводим все данные из телеги
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileService.me()?.stack)
      })
    });
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.resizeFeed(); // <<< вызываем метод
      });
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }


  onSave() {
    this.form.markAllAsTouched() // Проверка было ли интерактив с формой
    this.form.updateValueAndValidity() // Проверка на валидность всех Validators в форме

    if (this.form.invalid) return

    if (this.avatarUploader.avatar) {
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }

    //@ts-ignore
    firstValueFrom(this.profileService.patchProfile({
      ...this.form.value,
      stack: this.splitStack(this.form.value.stack)
    }))
  }

  splitStack(stack: string | null | string[] | undefined) {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }

  onCancel() {
    this.router.navigate(['profile/me']);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  cleanInput() {
    const fields = ['firstName', 'lastName', 'description', 'stack', 'username'];
    fields.forEach(field => this.form.get(field)?.reset());
  }
}

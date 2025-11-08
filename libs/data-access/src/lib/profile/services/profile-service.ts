import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, tap } from 'rxjs';
import { GlobalStoreService, Pageble } from '../../shared';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
	providedIn: 'root' // Регистрирует сервис в корневом инжекторе Angular (root), делая его доступным во всем приложении.
})
export class ProfileService {
	http = inject(HttpClient); // Регистрация сервиса. Внедряет Angular-сервис HttpClient для выполнения HTTP-запросов.
	baseApiUrl = '/yt-course/'; // Базовый URL API. Централизованное хранение базового URL для всех запросов.
	private globalStoreService = inject(GlobalStoreService)

	me = signal<Profile | null>(null);

	getTestAccounts() {
		// Метод для запроса данных. Сервис для запросов к API и возвращает Observable<Profile[]>.
		// Дженерик ожидаем массив Profile-ов <Profile[] хранит весь список интерфейса>
		return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
	}

	getMe() {
		// Проверь Profile передается Profile[] или Profile?
		return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
			.pipe(
				tap(res => {
					this.me.set(res)
					this.globalStoreService.me.set(res)
				})
			)
	}

	getAccount(id: string) {
		return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
	}

	getSubscribersShortList(subsAmount = 3) {
		return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
			.pipe(
				map(res => res.items.slice(0,subsAmount))
			)
	}

	// Partial - говорит что необязательно могут прийти все поля этого объекта
	patchProfile(profile: Partial<Profile>) {
		return this.http.patch<Profile>(
			`${this.baseApiUrl}account/me`,
			profile
		)
	}

	uploadAvatar(file: File) {
		const fd = new FormData();
		fd.append('image', file);

		return this.http.post<Profile>(
			`${this.baseApiUrl}account/upload_image`,
			fd
		)
	}

	filterProfiles(params:Record<string, any>) {
		return this.http
			.get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, {
				params
			})
	}
}

import {
	Component,
	ElementRef,
	HostListener,
	inject,
	input,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core';

import { firstValueFrom, fromEvent, Subject, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DateTime } from 'luxon';
import {MessageInput} from '../../../ui';
import {Chat, ChatsService} from '../../../data';
import {ChatWorkspaceMessage} from './chat-workspace-message/chat-workspace-message';

@Component({
	selector: 'app-chat-workspace-messages-wrapper',
	imports: [ChatWorkspaceMessage, MessageInput],
	templateUrl: './chat-workspace-messages-wrapper.html',
	styleUrl: './chat-workspace-messages-wrapper.scss',
})
export class ChatWorkspaceMessagesWrapper implements OnInit {
	chatsService = inject(ChatsService);
	chat = input.required<Chat>();
	messages = this.chatsService.activeChatMessages;

	hostElement = inject(ElementRef);
	r2 = inject(Renderer2);

	private destroy$ = new Subject<void>();

	ngOnInit() {
		this.messagePolling();
	}

	// Периодическое обновление чата
	private messagePolling() {
		timer(0, 1800000) // Запуск сразу с 0 и затем каждый 30 мин
			.pipe(takeUntil(this.destroy$)) // Завершение и отписка при уничтожении компонента
			.subscribe(async () => {
				// При каждом срабатывании таймера:
				await firstValueFrom(this.chatsService.getChatById(this.chat().id)); // Загружаем свежие данные текущего чата
				// Если данные не обновляются автоматически — можно вручную обновить массив сообщений
			});
	}

	// Метод для отправки сообщения
	async onSendMessage(messageText: string) {
		// Отправляем сообщение на сервер (ждём завершения запроса)
		await firstValueFrom(
			this.chatsService.sendMessage(this.chat().id, messageText),
		);
		// После успешной отправки подгружаем чат заново, чтобы обновить список сообщений
		await firstValueFrom(this.chatsService.getChatById(this.chat().id));
	}

	// Обработчик изменения размера окна
	@HostListener('window:resize')
	onWindowResize(): void {
		this.resizeFeed();
	}

	ngAfterViewInit() {
		this.resizeFeed(); // Установка высоты при инициализации компонента

		// Подписка на изменения размера окна с дебаунсом
		fromEvent(window, 'resize')
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe(() => {
				this.resizeFeed();
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete(); // Отписка для предотвращения утечек памяти
	}

	// Метод для изменения размера элемента
	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect();
		const height = window.innerHeight - top - 28; // Вычисление высоты
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`); // Установка стиля высоты
	}

	getGroupedMessages() {
		// Берём актуальное состояние массива сообщений из сигнала/стора
		// (this.messages — это сигнал или BehaviorSubject).
		const messagesArray = this.messages();

		// Создаём Map для группировки сообщений. Map удобен тем, что ключами
		// могут быть строки (например, 'Сегодня', 'Вчера', '15.08.2025'), а значениями массивы сообщений.
		const groupedMessages = new Map();

		// Определяем "сегодня" — это начало текущего дня (00:00).
		// Используем .startOf('day'), чтобы сравнивать только дату, игнорируя часы и минуты.
		const today = DateTime.now().startOf('day');
		// Определяем "вчера" — это начало суток за один день до сегодняшнего.
		const yesterday = today.minus({ days: 1 });

		// Перебираем каждое сообщение
		messagesArray.map((message) => {
			const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' }) // читаем ISO-дату как UTC
				.plus({ hours: 5 }) // вручную добавляем +5 часов (то есть "utc+5")
				.setZone(DateTime.local().zone) // переводим во временную зону текущего устройства
				.startOf('day'); // обнуляем время до 00:00

			// Делаем метки группы сообщений ('Сегодня', 'Вчера' или dd.MM.yyyy).
			let dateLabel;
			if (messageDate.equals(today)) {
				dateLabel = 'Сегодня';
			} else if (messageDate.equals(yesterday)) {
				dateLabel = 'Вчера';
			} else {
				dateLabel = messageDate.toFormat('dd.MM.yyyy');
			}

			// Добавляем сообщение в соответствующую группу.
			// Если по этой дате ещё нет массива → берём пустой массив и добавляем текущее сообщение.
			groupedMessages.set(dateLabel, [
				...(groupedMessages.get(dateLabel) ?? []),
				message,
			]);
		});

		// Возвращаем Map, преобразованный в массив пар [ключ, значение].
		// В html шаблоне итерируемся через @for.
		return Array.from(groupedMessages.entries());
	}

	// Scroll всегда внизу
	ngAfterViewChecked() {
		this.scrollToBottom();
	}

	@ViewChild('messagesContainer') private messagesContainer!: ElementRef; // навешиваем в шаблоне селектор messagesContainer

	scrollToBottom() {
		const el = this.messagesContainer.nativeElement;
		el.scrollTop = el.scrollHeight;
	}
}

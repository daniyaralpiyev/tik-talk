import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '@tt/data-access';
import { SvgIcon, TtInput} from '@tt/common-ui';

@Component({
	selector: 'app-login-page',
	imports: [ReactiveFormsModule, TtInput, SvgIcon],
	templateUrl: './login-page.html',
	styleUrl: './login-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
	authService = inject(AuthService);
	router = inject(Router);

	isPasswordVisible = signal<boolean>(false);

	form: FormGroup = new FormGroup({
		username: new FormControl<string | null>('the_happyy', Validators.required),
		password: new FormControl<string | null>(null, Validators.required),
	});

	ngOnInit() {
		this.form.valueChanges.subscribe((val) => {
			console.log(val);
		});

		// this.form.controls['username'].disable();
	}

	onSubmit() {
		this.isPasswordVisible.set(true);
		if (this.form.valid) {
			//@ts-ignore
			this.authService.login(this.form.value).subscribe((res) => {
				this.router.navigate(['']);
				console.log(res);
			});
		}
	}
}

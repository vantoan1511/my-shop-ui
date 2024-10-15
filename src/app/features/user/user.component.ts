import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    ActivatedRoute,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';
import {catchError, Subject, switchMap, takeUntil} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {AuthenticationService} from '../../services/authentication.service';
import {ImageService} from '../../services/image.service';
import {UserService} from '../../services/user.service';
import {ValidationService} from '../../services/validation.service';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
    userForm!: FormGroup;
    passwordForm!: FormGroup;
    username!: string;
    userId: number | null = null;
    avatar: SafeUrl | null = null;
    defaultAvatar = 'https://placehold.co/128x128';
    private unsubscribe$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private authService: AuthenticationService,
        private validator: ValidationService,
        private imageService: ImageService,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
        this.username = this.getUsername();
        this.userForm = this.initUserProfileForm();
        this.passwordForm = this.initPasswordForm();
        this.getUserProfile();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onProfileFormSubmit() {
        if (this.userForm.valid) {
            this.userService
                .updateProfile(this.username, this.userForm.value)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: () => {
                        this.alertService.showSuccessToast('Profile updated successfully');
                    },
                    error: (error) => {
                        this.alertService.showErrorToast('Failed to update profile');
                    },
                });
        }
    }

    onPasswordFormSubmit() {
        if (this.passwordForm.valid) {
            this.userService
                .changePassword(this.username, this.passwordForm.get('password')?.value)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: () =>
                        this.alertService.showSuccessToast('Password changed successfully'),
                    error: (error) =>
                        this.alertService.showErrorToast('Failed to change password'),
                });
        }
    }

    previewImage(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.[0]) {
            return;
        }

        const file = input.files[0];

        if (!this.validateFile(file)) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.getElementById(
                'avatar-preview'
            ) as HTMLImageElement;
            imgElement.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);

        this.imageService
            .uploadImage(file)
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap((resp) => {
                    const avatarId = resp.id;
                    return this.imageService.setAvatar(avatarId);
                }),
                catchError((error) => {
                    this.alertService.showErrorToast('Failed to upload image');
                    return [];
                })
            )
            .subscribe({
                next: () =>
                    this.alertService.showSuccessToast('Updated avatar successfully'),
                error: () =>
                    this.alertService.showErrorToast('Failed to update avatar'),
            });
    }

    get isValidProfileForm() {
        return this.userForm.valid;
    }

    get dirtyProfileForm() {
        return this.userForm.dirty;
    }

    get notMatchedPassword() {
        return this.passwordForm.errors?.['mismatch'];
    }

    private initUserProfileForm() {
        return this.fb.group({
            username: [{value: '', disabled: true}],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            address: ['', Validators.required],
            gender: [{value: 'UNKNOWN'}],
        });
    }

    private initPasswordForm() {
        const passwordForm = this.fb.group({
            password: ['', Validators.required],
            rePassword: ['', Validators.required],
        });
        passwordForm.addValidators(this.validator.passwordMatchValidator);
        return passwordForm;
    }

    private getUserProfile() {
        const username = this.getUsername();

        this.userService
            .getByUsername(username)
            .pipe(
                takeUntil(this.unsubscribe$),
                catchError((error) => {
                    this.alertService.showErrorToast('Failed to get user: ' + username);
                    return [];
                }),
                switchMap((user) => {
                    this.userForm.patchValue(user);
                    this.userId = user.id;
                    return this.imageService.getAvatarByUserId(this.userId);
                })
            )
            .subscribe({
                next: (imageBlob) => (this.avatar = this.sanitizer.bypassSecurityTrustUrl(this.createAvatarUrl(imageBlob)))
            });
    }

    private createAvatarUrl(blob: Blob) {
        return URL.createObjectURL(blob);
    }

    private getUsername() {
        const username = this.route.snapshot.paramMap.get('username');
        return username ?? this.authService.username;
    }

    private validateFile(file: File) {
        if (!file) {
            this.alertService.showErrorToast('File is empty');
            return false;
        }

        if (!this.validFileSize(file)) {
            this.alertService.showErrorToast('File exceeds limit of 1MB');
            return false;
        }

        if (!this.validFileType(file)) {
            this.alertService.showErrorToast(
                'Invalid file type. Only JPEG and PNG allowed'
            );
            return false;
        }

        return true;
    }

    private validFileSize(file: File) {
        const MAX_FILE_SIZE = 1048576;
        return file.size <= MAX_FILE_SIZE;
    }

    private validFileType(file: File) {
        const validTypes = ['image/jpeg', 'image/png'];
        return validTypes.includes(file.type);
    }
}

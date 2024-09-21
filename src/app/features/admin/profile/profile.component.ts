import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ImageService } from '../../../services/image.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  avatarUrl!: string;
  username = this.keycloak.getUsername();

  constructor(
    private keycloak: KeycloakService,
    private imageService: ImageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadAvatar();
  }

  private loadAvatar(): void {
    this.avatarUrl = 'http://localhost:8082/api/images/1';
  }

  previewAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageService.uploadImage(input.files[0]).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          const imageId = response.id;
          if (imageId) {
            this.imageService.setAvatar(imageId).subscribe({
              next: () => {
                this.alertService.showSuccessToast(
                  'Changed avatar successfully'
                );
              },
              error: (error) => {
                console.error('Change failed', error);
                this.alertService.showErrorToast('Failed to change avatar');
              },
            });
          }
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.alertService.showErrorToast('Failed to upload image');
        },
      });
    }
  }

  logout() {
    this.keycloak.logout();
  }
}

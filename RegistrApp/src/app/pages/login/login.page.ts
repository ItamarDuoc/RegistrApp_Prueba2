import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      groupId: [0, [Validators.required]],
    });
  }

  async ngOnInit() {
    const user = await this.storageService.get('user');
    if (user) {
      console.log('Usuario ya logueado:', user);
      this.router.navigate(['/home']);
    }
  }

  async onLogin() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true; // Evitar clicks repetidos
      const { username, password, groupId } = this.loginForm.value;
      const loginData = { username, password, groupId };

      console.log('Datos a enviar:', loginData);

      this.apiService.login(loginData.username, loginData.password, loginData.groupId).subscribe({
        next: async (response: any) => {
          console.log(response);
          if (response.isValid) {
            await this.storageService.set('user', loginData.username);
            this.router.navigate(['/home']);
          } else {
            await this.showToast('Error en el inicio de sesión: ' + response.message, 'danger');
          }
        },
        error: async (error) => {
          console.error('Error en la solicitud de inicio de sesión:', error);
          await this.showToast('Error en la solicitud de inicio de sesión. Inténtalo nuevamente.', 'danger');
        },
        complete: () => {
          this.isLoading = false;
          console.log('Proceso de inicio de sesión completado.');
        },
      });
    } else if (!this.loginForm.valid) {
      this.showToast('Formulario no válido. Por favor, verifica los campos.', 'warning');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}

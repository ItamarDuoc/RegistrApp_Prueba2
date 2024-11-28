import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      groupId: [11, [Validators.required]],
    });
  }

  async ngOnInit() {
    const user = await this.storageService.get('user');
    if (user) {
      await this.showToast(`Bienvenido de nuevo, ${user}. Redirigiendo a la pagina de inicio...`);
      this.router.navigate(['/home']);
    }
  }

  async onRegister() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { name, username, password, email, groupId } = this.registerForm.value;
      const registrationData = { name, username, password, email, groupId };

      console.log('Datos a enviar:', registrationData);

      this.apiService
        .register(
          registrationData.name,
          registrationData.username,
          registrationData.password,
          registrationData.email,
          registrationData.groupId
        )
        .subscribe({
          next: async (response) => {
            console.log('Registro exitoso', response);
            await this.showToast('Registro exitoso. Redirigiendo a la página de inicio de sesión...');
            this.router.navigate(['/login']);
          },
          error: async (error) => {
            console.error('Error en el registro:', error);
            await this.showToast('Error al registrarse. Inténtalo nuevamente.', 'danger');
          },
          complete: () => {
            this.isLoading = false;
            console.log('Proceso de registro completado.');
          },
        });
    } else if (!this.registerForm.valid) {
      this.showToast('Formulario no valido. Por favor, verifica los campos.', 'warning');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
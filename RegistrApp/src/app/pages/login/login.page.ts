import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private storageService: StorageService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
    });
  }

  onLogin() {
    this.loginError = null;
    this.isLoading = true;

    if (this.loginForm.valid) {
      const { username, password, groupId } = this.loginForm.value;
      const loginData = { username, password, groupId };

      console.log('Datos a enviar:', loginData);

      this.apiService.login(loginData.username, loginData.password, loginData.groupId).subscribe({
        next: async (response: any) => {
          this.isLoading = false;
          if (response.success) {
            await this.storageService.set('user', response.user);
            this.router.navigate(['/home']);
          } else {
            this.loginError = 'Login failed. Please check your credentials.';
            console.error('Error en el inicio de sesión:', response.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.loginError = 'An error occurred. Please try again later.';
          console.error('Error en la solicitud de inicio de sesión:', error);
        },
        complete: () => {
          console.log('Proceso de inicio de sesión completado.');
        }
      });
    } else {
      this.isLoading = false;
      this.loginError = 'Please fill in all required fields.';
      console.error('Formulario no válido');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

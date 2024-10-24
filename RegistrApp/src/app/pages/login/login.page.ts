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

  constructor(private fb: FormBuilder, private apiService: ApiService, private storageService: StorageService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      groupId: [0, [Validators.required]],
    });
  }

  onLogin() {

    if (this.loginForm.valid) {
      const { username, password, groupId } = this.loginForm.value;
      const loginData = { username, password, groupId };

      console.log('Datos a enviar:', loginData);

      this.apiService.login(loginData.username, loginData.password, loginData.groupId).subscribe({
        next: async (response: any) => {
          console.log(response)
          if (response.isValid) {
            await this.storageService.set('user',loginData.username);
            this.router.navigate(['/home']);
          } else {
            console.error('Error en el inicio de sesion:', response.message);
          }
        },
        error: (error) => {
          console.error('Error en la solicitud de inicio de sesion:', error);
        },
        complete: () => {
          console.log('Proceso de inicio de sesión completado.');
        }
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

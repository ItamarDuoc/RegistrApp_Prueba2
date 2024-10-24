import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      groupId: [5, [Validators.required]],
    });
  }

  ngOnInit() {}

  onRegister() {
    this.registerError = null;

    if (this.registerForm.valid) {
      const { name, username, password, email, groupId } = this.registerForm.value;
      const registrationData = { name, username, password, email, groupId };

      console.log('Datos a enviar:', registrationData);

      this.apiService.register(registrationData.name, registrationData.username, registrationData.password, registrationData.email, registrationData.groupId).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.registerError = 'Registration failed. Please try again.';
          console.error('Error en el registro:', error);
        },
        complete: () => {
          console.log('Proceso de registro completado.');
        }
      });
    } else {
      this.registerError = 'Please fill in all required fields correctly.';
      console.error('Formulario no válido');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoverPasswordPage } from './recover-password.page';

const routes: Routes = [
  {
    path: '',
    component: RecoverPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecoverPasswordPageRoutingModule {}

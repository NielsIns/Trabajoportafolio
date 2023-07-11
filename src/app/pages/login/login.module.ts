import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  declarations: [LoginPage],
  providers: [OracleService, ValidacionesService]
})
export class LoginPageModule {}

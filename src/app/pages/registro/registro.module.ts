import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { SendGridService } from 'src/app/services/send-grid.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  declarations: [RegistroPage],
  providers: [OracleService, ValidacionesService, SendGridService]
})
export class RegistroPageModule {}

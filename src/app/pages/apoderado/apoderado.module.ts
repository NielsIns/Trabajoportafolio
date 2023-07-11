import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApoderadoPageRoutingModule } from './apoderado-routing.module';

import { ApoderadoPage } from './apoderado.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { SendGridService } from 'src/app/services/send-grid.service';
import { ImpresionService } from 'src/app/services/impresion.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApoderadoPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  declarations: [ApoderadoPage],
  providers: [OracleService, ValidacionesService, SendGridService, ImpresionService]
})
export class ApoderadoPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectivoPageRoutingModule } from './directivo-routing.module';

import { DirectivoPage } from './directivo.page';
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
    DirectivoPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  declarations: [DirectivoPage],
  providers: [OracleService, ValidacionesService, SendGridService, ImpresionService]
})
export class DirectivoPageModule {}

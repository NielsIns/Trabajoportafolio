import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministradorPageRoutingModule } from './administrador-routing.module';

import { AdministradorPage } from './administrador.page';
import { OracleService } from 'src/app/services/oracle.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import { SendGridService } from 'src/app/services/send-grid.service';
import { ImpresionService } from 'src/app/services/impresion.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministradorPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule   
  ],
  declarations: [AdministradorPage],
  providers: [OracleService, ValidacionesService, SendGridService, ImpresionService]
})
export class AdministradorPageModule {}

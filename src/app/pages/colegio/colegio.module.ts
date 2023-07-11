import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColegioPageRoutingModule } from './colegio-routing.module';

import { ColegioPage } from './colegio.page';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColegioPageRoutingModule,
    RouterModule, 
    ReactiveFormsModule, 
    HttpClientModule
  ],
  declarations: [ColegioPage]
})
export class ColegioPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreguntasFrecuentesPageRoutingModule } from './preguntas-frecuentes-routing.module';

import { PreguntasFrecuentesPage } from './preguntas-frecuentes.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PreguntasFrecuentesPageRoutingModule
  ],
  declarations: [PreguntasFrecuentesPage]
})
export class PreguntasFrecuentesPageModule {}

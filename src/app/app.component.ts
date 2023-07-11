import { Component } from '@angular/core';
import { ImpresionService } from './services/impresion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( private serviceImpresion: ImpresionService) {}


  onImprimir(){
    const encabezado = ["RUT", "NOMBRE", "APELLIDO"]
    const cuerpo = ['11.111.111-1', "Luis", "Carrasco" ]
    this.serviceImpresion.imprimir(encabezado, cuerpo, "listado de clientes", true);
  }
  
  


}




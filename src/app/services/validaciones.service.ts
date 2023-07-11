import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor() { }

  validarRut(rut: any): boolean {
    var rutSimple = rut.replace('.', '').replace('.', '').replace('-', '');
    rutSimple = rutSimple.substring(0, rutSimple.length - 1);
    var rutArreglo: any[] = rutSimple.split('').reverse();

    var acumulador: number = 0;
    var multiplo: number = 2;
    for (let digito of rutArreglo) {
      acumulador = acumulador + digito * multiplo;
      multiplo++;
      if (multiplo > 7) {
        multiplo = 2;
      }
    }
    var resto: number = acumulador % 11;
    var dvCalculado: any = 11 - resto;
    if (dvCalculado >= 11) {
      dvCalculado = '0';
    } else if (dvCalculado == 10) {
      dvCalculado = 'K';
    }

    var dvRut: string = rut.substring(rut.length - 1).toUpperCase();
    if (dvRut == dvCalculado.toString()) {
      return true;
    } else {
      return false;
    }
  }

  

}

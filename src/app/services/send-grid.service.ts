import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SendGridService {

  constructor(private http: HttpClient) { }


  enviarCorreo(destinatario: any, asunto: any, contenido: any) {
    const url = 'http://localhost:4201/enviar-correo';
    const correo = {
      destinatario,
      asunto,
      contenido
    };

    return this.http.post(url, correo);
  }
}

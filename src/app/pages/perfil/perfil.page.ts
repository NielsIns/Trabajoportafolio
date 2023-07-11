import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {  }

  usuario:any;
  usuarioDato:any;

  ngOnInit() {

    this.usuario = history.state.persona;
    console.log(this.usuario);
    this.usuarioDato = this.activatedRoute.snapshot.paramMap.get('id');
    // handle the case where persona is null or undefined
  }

}

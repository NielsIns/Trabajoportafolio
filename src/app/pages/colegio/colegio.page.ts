import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-colegio',
  templateUrl: './colegio.page.html',
  styleUrls: ['./colegio.page.scss'],
})
export class ColegioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  agregarCurso: boolean=false;
  agregarAlumno: boolean=false;
  listarAlumno: boolean=false;
  listarCurso: boolean=false;
  


  curso = new FormGroup({
    id_curso : new FormControl('', [Validators.required]),
    nivel: new FormControl('', Validators.required),
    letra: new FormControl('', Validators.required),
    cupo: new FormControl('', Validators.required),
  });


  user = new FormGroup({
    RUT : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    P_NOMBRE: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    S_NOMBRE: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    AP_PATERNO: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    AP_MATERNO: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    FECHA_NAC: new FormControl('', Validators.required),
    TELEFONO: new FormControl('', Validators.required),
    DIRECCION: new FormControl('', Validators.required),
    CORREO: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*')]),    
    SUELDO: new FormControl(''),
    ID_PERFIL: new FormControl(''),
    ID_GENERO: new FormControl(''),
    ID_COMUNA: new FormControl(''),
    ID_TIPO_PERSONA: new FormControl(''),
    ID_PATOLOGIA: new FormControl(''),
    ID_PROFESION: new FormControl(''),
    ID_CARGO: new FormControl(''),
    RUT_APO: new FormControl(''),
    

    
    
  });


  btnAgregarCurso(){
    this.agregarCurso=true;
    this.agregarAlumno=false;
    this.listarCurso=false;
    this.listarAlumno=false;

  }
  btnAgregarAlumno(){
    this.agregarCurso=false;
    this.agregarAlumno=true;
    this.listarCurso=false;
    this.listarAlumno=false;

  }
  btnListarCurso(){
    this.agregarCurso=false;
    this.agregarAlumno=false;
    this.listarCurso=true;
    this.listarAlumno=false;

  }
  btnListarAlumno(){
    this.agregarCurso=false;
    this.agregarAlumno=false;
    this.listarCurso=false;
    this.listarAlumno=true;

  }


}

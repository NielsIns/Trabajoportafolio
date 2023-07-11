import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private oraclesSevice: OracleService, private http: HttpClient,private validacionesService: ValidacionesService,
    private alertController: AlertController, private toastController: ToastController) { }

  ngOnInit() {
    this.listarPersona()
    this.listarCredenciales();
 
  }

  isAuthenticated = new BehaviorSubject (false);

  person:any;
  personas: any[]=[]
  credenciales: any[]=[]


  usuario = new FormGroup({
    NOM_USUARIO: new FormControl('', [Validators.required]),
    CONTRASENIA: new FormControl('', [Validators.required])
  });


//Listar
listarPersona(){
  this.oraclesSevice.listarPersonas3().subscribe((data: any[]) => {
    this.personas=data
    console.log(this.personas)
  });
}

listarCredenciales(){
  this.oraclesSevice.listarCredenciales().subscribe((data: any[]) => {
    this.credenciales=data
    console.log(this.credenciales)
  });
}

async login() {
  let existeEnArrayInterno = false;

  for (let i = 0; i < this.credenciales.length; i++) {
    const arrayInterno = this.credenciales[i];
    console.log(i)
    

    console.log(arrayInterno[1], arrayInterno[2])
    if (arrayInterno[1] === this.usuario.value.NOM_USUARIO && arrayInterno[2] === this.usuario.value.CONTRASENIA) {
      existeEnArrayInterno = true;
      var usu = arrayInterno;
      var rutUser=arrayInterno[0]
      await this.oraclesSevice.setAuth(true);
      this.buscarPersona(arrayInterno[0])
        .then((persona: any) => {
          console.log(persona);
          let navigationExtras: NavigationExtras = {
            state: {
              usuario: usu,
              persona: persona
            }
          };
          this.router.navigate(['/home/perfil/' + rutUser], navigationExtras);
        })
        .catch((error: any) => {
          console.error(error);
        });
      console.log(`Ambas variables se encuentran en el array interno número ${i}.`);
      break;
    }
  }

  if (!existeEnArrayInterno) {
    console.log("Ninguna de las dos variables se encuentran en un array interno de arrayPrincipal.");
  }
}



persona: any = {
  RUT:''                ,
  P_NOMBRE:''           ,
  S_NOMBRE:''           ,
  AP_PATERNO :''        ,
  AP_MATERNO :''        ,
  FECHA_NAC  :''        ,
  TELEFONO   :0         ,
  DIRECCION  :''        ,
  CORREO     :''         ,
  SUELDO     :0         ,
  ID_PERFIL  :''       ,
  ID_GENERO  :''        , 
  ID_COMUNA  :''         , 
  ID_TIPO_PERSONA :''    , 
  ID_PATOLOGIA  :''      , 
  ID_PROFESION :''       , 
  ID_CARGO :''           ,
  RUT_APO :'' 
}


async buscarPersona(RUT: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.oraclesSevice.buscarPersona(RUT).subscribe((data) => {
      console.log(data);
      var personaObtenida = data[0]
      console.log(data)
      this.persona.RUT = personaObtenida[0]
      this.persona.P_NOMBRE = personaObtenida[1]
      this.persona.S_NOMBRE = personaObtenida[2]
      this.persona.AP_PATERNO = personaObtenida[3]
      this.persona.AP_MATERNO = personaObtenida[4]
      this.persona.FECHA_NAC = personaObtenida[5]
      this.persona.TELEFONO = personaObtenida[6]
      this.persona.DIRECCION = personaObtenida[7]
      this.persona.CORREO = personaObtenida[8]
      this.persona.SUELDO = personaObtenida[9]
      this.persona.ID_PERFIL = personaObtenida[10]
      this.persona.ID_GENERO = personaObtenida[11]
      this.persona.ID_COMUNA = personaObtenida[12]
      this.persona.ID_TIPO_PERSONA = personaObtenida[13]
      this.persona.ID_PATOLOGIA = personaObtenida[14]
      this.persona.ID_PROFESION = personaObtenida[15]
      this.persona.ID_CARGO = personaObtenida[16]
      this.persona.RUT_APO = personaObtenida[17]
      console.log(this.persona)
      this.listarPersona()
      resolve(this.persona)
    }, error => reject(error));
  });
}


async onSubmit() {
  const bb=()=>{
    //this.oraclesSevice.getAuth();
    console.log('holaaaaaa')
    let msg='Sesión iniciada correctamente!';
    this.tostadaUniversal(msg,'bottom');
    

  }
  console.log(this.oraclesSevice.isAuthenticated.value)
  const aa=()=>{
    this.oraclesSevice.validarUser();
    bb();
    
  }
  console.log(this.oraclesSevice.isAuthenticated.value)
  
  this.oraclesSevice.setAuth(true)
  const { NOM_USUARIO, CONTRASENIA } = this.usuario.value;
  this.oraclesSevice.login(NOM_USUARIO, CONTRASENIA).subscribe(
    response => {
      console.log(response)
      if (response.success) {
        this.oraclesSevice.setAuth(true)
        console.log('llegue a login')
        const rut = response.rut; // Obtener el rut de la respuesta
        
        this.oraclesSevice.buscarPersona(rut).subscribe((data) => {
          console.log(data);
          var personaObtenida = data[0]
          console.log(data)
          this.persona.RUT = personaObtenida[0]
          this.persona.P_NOMBRE = personaObtenida[1]
          this.persona.S_NOMBRE = personaObtenida[2]
          this.persona.AP_PATERNO = personaObtenida[3]
          this.persona.AP_MATERNO = personaObtenida[4]
          this.persona.FECHA_NAC = personaObtenida[5]
          this.persona.TELEFONO = personaObtenida[6]
          this.persona.DIRECCION = personaObtenida[7]
          this.persona.CORREO = personaObtenida[8]
          this.persona.SUELDO = personaObtenida[9]
          this.persona.ID_PERFIL = personaObtenida[10]
          this.persona.ID_GENERO = personaObtenida[11]
          this.persona.ID_COMUNA = personaObtenida[12]
          this.persona.ID_TIPO_PERSONA = personaObtenida[13]
          this.persona.ID_PATOLOGIA = personaObtenida[14]
          this.persona.ID_PROFESION = personaObtenida[15]
          this.persona.ID_CARGO = personaObtenida[16]
          this.persona.RUT_APO = personaObtenida[17]
          console.log(this.persona)
          this.listarPersona()
          
          this.oraclesSevice.isAuthenticated.next(true);
          bb();
          console.log(this.oraclesSevice.isAuthenticated.value)
          console.log(this.persona);
          let navigationExtras: NavigationExtras = {
            state: {
              persona: this.persona
            }
          };
          this.router.navigate(['/home/perfil/' + rut], navigationExtras);
          console.log(this.oraclesSevice.isAuthenticated.value)
        }) // Construir la URL con el rut
        
        // Realizar la redirección a la URL con el rut
        
      } else {
        this.oraclesSevice.getAuth();
        console.log(this.oraclesSevice.isAuthenticated.value)
        let msg='Credenciales inválidas, inténtelo de nuevo';
        console.log('holaaaaaa2')
        this.tostadaUniversal(msg,'bottom')
      }  
      },
    error => {
      this.oraclesSevice.setAuth(false)
      if (error.status === 401) {
        this.oraclesSevice.getAuth();
        console.log('holaaaaaa3')
        let msg='Credenciales inválidas, inténtelo de nuevo';
        this.tostadaUniversal(msg,'bottom')
      } else {
        console.log('holaaaaaa4')
        console.error('Error en la solicitud de inicio de sesión:', error);
        // Resto de la lógica de manejo de errores
      }
    }
    
    );
    console.log(this.oraclesSevice.isAuthenticated.value)
}

buttonFunction(){
  console.log(this.oraclesSevice.isAuthenticated.value)
}

async tostadaUniversal(msg:any ,position: 'bottom') {
  const toast = await this.toastController.create({
    message: msg,
    duration: 3000,
    position: position
  });
  toast.present();
}



}

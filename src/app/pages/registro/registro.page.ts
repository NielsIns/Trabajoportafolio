import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { OracleService } from 'src/app/services/oracle.service';
import { SendGridService } from 'src/app/services/send-grid.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(private oraclesSevice: OracleService, private http: HttpClient,private validacionesService: ValidacionesService,
    private alertController: AlertController, private toastController: ToastController, private sendGridService: SendGridService) { }
  //Listas
  personas: any[] = [];
  perfiles: any[] = [];
  generos: any[] = [];
  comunas: any[] = [];
  tipos_personas: any[] = [];
  patologias: any[] = [];
  profesiones: any[] = [];
  cargos: any[] = [];
  credenciales: any[] = [];

  ngOnInit() {
    //Ejecutar de los listar
    this.listarPerfil();
    this.listarGenero();
    this.listarComuna();
    this.listarTipoPersona();
    this.listarPatologia();
    this.listarProfesion();
    this.listarCargo();
    this.listarPersona();
    this.listarCredenciales();
  }

  user = new FormGroup({
    RUT : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    P_NOMBRE: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    S_NOMBRE: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    AP_PATERNO: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    AP_MATERNO: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-ZÑ]{1}[a-zñ]*$/)]),
    FECHA_NAC: new FormControl('', Validators.required),
    TELEFONO: new FormControl('', Validators.required),
    DIRECCION: new FormControl('', Validators.required),
    CORREO: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),    
    SUELDO: new FormControl(''),
    ID_PERFIL: new FormControl('3'),
    ID_GENERO: new FormControl(''),
    ID_COMUNA: new FormControl(''),
    ID_TIPO_PERSONA: new FormControl('2'),
    ID_PATOLOGIA: new FormControl(''),
    ID_PROFESION: new FormControl(''),
    ID_CARGO: new FormControl(''),
    RUT_APO: new FormControl(''),
    
  });

  credencial = new FormGroup({
    RUT : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    NOM_USUARIO: new FormControl('', Validators.required),
    CONTRASENIA: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18), Validators.pattern(/^((?!\s{1,}).)*$/)]),
    
  });

  //Listar
  listarPersona(){
    this.oraclesSevice.listarPersonas3().subscribe((data: any[]) => {
      this.personas=data
      console.log(this.personas)
    });
  }

  listarPerfil(){
    this.oraclesSevice.getDataPerfil().subscribe((data: any[]) => {
      this.perfiles=data
      console.log(this.perfiles)

    });
  }

  listarGenero(){
    this.oraclesSevice.getDataGenero().subscribe((data: any[]) => {
      this.generos=data
      console.log(this.generos)

    });
  }

  listarComuna(){
    this.oraclesSevice.getDataComuna().subscribe((data: any[]) => {
      this.comunas=data
      console.log(this.comunas)

    });
  }

  listarTipoPersona(){
    this.oraclesSevice.getDataTipoPersona().subscribe((data: any[]) => {
      this.tipos_personas=data
      console.log(this.tipos_personas)

    });
  }

  listarPatologia(){
    this.oraclesSevice.getDataPatologia().subscribe((data: any[]) => {
      this.patologias=data
      console.log(this.patologias)

    });
  }

  listarProfesion(){
    this.oraclesSevice.getDataProfesion().subscribe((data: any[]) => {
      this.profesiones=data
      console.log(this.profesiones)

    });
  }

  listarCargo(){
    this.oraclesSevice.getDataCargo().subscribe((data: any[]) => {
      this.cargos=data
      console.log(this.cargos)

    });
  }

  listarCredenciales(){
    this.oraclesSevice.listarCredenciales().subscribe((data: any[]) => {
      this.credenciales=data
      console.log(this.credenciales)
    });
  }

  //Agregar
  anadirUser() {

    this.user.value.ID_PERFIL='3';
    this.user.value.ID_TIPO_PERSONA='2';
    console.log(this.credencial.value)
    console.log(this.credenciales)
    //let condicion: boolean= this.credenciales.includes((x:any)=> x[1]== this.credencial.value.NOM_USUARIO)
    let condicion = false
    this.credenciales.forEach(X => {
      if (X[1] == this.credencial.value.NOM_USUARIO)  {
        condicion = true;       
        
      }
    })
    console.log(condicion)
    if (condicion) {

      let msg='Nombre de usuario ya ocupado'
      this.tostadaUniversal(msg,'top')
      return
    }
    console.log(this.user.value);
    console.log(this.user);
    const rutControl = this.user.get('RUT');
    var rut_user=this.validacionesService.validarRut(this.user.value.RUT);
    
    var usuFind = this.buscarUserr();
    console.log(usuFind);
    
    console.log(rut_user)
    
    if (rut_user == false) {
      let msg='Usuario con rut no valido';
      this.tostadaUniversal(msg,'top')
      console.log('Usuario con rut no valido'); 
      return;
    }else{


      
      if (usuFind == undefined){
        try {
          this.credencial.value.RUT=this.user.value.RUT
          console.log(this.credencial.value.RUT)
          const bb = async ()=>{
            this.listarPersona();
            this.listarCredenciales();
            console.log('POST response:', response);
            this.user.reset();
            this.credencial.reset();
            //location.reload();
            console.log(response);
            
            this.tostadaConfirmAdd('top')
            //Quitarle el comentario cuando ya funcione
            
          }
          const aa=()=>{
            const responseCred = this.oraclesSevice.agregarCredencial(this.credencial.value).subscribe({
              next(position) {
                console.log('se logro con exito llamar a la credencial');
                bb();
              },
              error(msg) {
                console.log('Error Getting credencial', msg);
              }// Función de callback para manejar finalización
            });;
            this.enviarCorreo(this.user.value.CORREO, this.user.value.P_NOMBRE, this.user.value.S_NOMBRE, this.user.value.AP_PATERNO, this.user.value.AP_MATERNO, this.credencial.value.NOM_USUARIO, this.credencial.value.CONTRASENIA);
            this.listarCredenciales();} ;
            const response = this.oraclesSevice.agregarPersona(this.user.value/*, this.CERTIFICADO*/).subscribe({
              next(position) {
                console.log('se logro con exito agregar persona');
                aa();
                
              },
              error(msg) {
                console.log('Error Getting Location: ', msg);
              }
            });
            
            //this.listarDirectivos();
          } catch (error) {
            console.error('POST error:', error);
          }        
          console.log('jeeee');
          this.listarPersona();
        }else{
          let msg='La persona ya se encuentra registrada'
          this.tostadaUniversal(msg,'top')
        }
        this.listarCredenciales();
      }         
      this.listarCredenciales();      
  }

  //Funciones para buscar
  buscarUserr(){
    var usuRut:any;
    var usuFind=this.personas;
    let found = false;
    for (let i = 0; i < usuFind.length; i++) {
      for (let j = 0; j < usuFind[i].length; j++) {
        if (usuFind[i][j] === this.user.value.RUT) {
          found = true;
          var userEncontrado = usuFind[i][j]
          break;
        }
      }
      if (found) {
        break;
      }
    }
    
    if (found) {
      return userEncontrado;
    } else {
      userEncontrado = undefined
      let msg=`El valor no se encontró en el array`;
      
      return userEncontrado
    }
    
  }


  //Adicionales
  async tostadaConfirmAdd(position: 'top') {
    const toast = await this.toastController.create({
      message: 'El usuario ha sido agregado con exito!',
      duration: 3000,
      position: position
    });
    toast.present();
  }

  async tostadaUniversal(msg:any ,position: 'top') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: position
    });
    toast.present();
  }


  enviarCorreo(email:any, nombre: any, s_nombre: any, ap_paterno:any, ap_materno:any, nom_usu: any, contrasenia: any) {
    const destinatario  = email;
    const asunto = 'Matriculas LSG'
    const contenido = `Hola ${nombre} ${s_nombre} ${ap_paterno} ${ap_materno}
  
    Gracias por registrarte en LSG Matrícula. A continuación, te proporcionamos tus credenciales de acceso para que puedas iniciar sesión en nuestra plataforma:
    <br>
    <br>
    Usuario: ${nom_usu}
    <br>
    Contraseña: ${contrasenia}
    <br>
    <br>
    ¡Bienvenido(a) a LSG Matrícula y que tengas una excelente experiencia con nosotros!
    <br>
    <br>
    Atentamente,
    <br>
    El equipo de LSG Matrícula`;
  
    this.sendGridService.enviarCorreo(destinatario, asunto, contenido)
      .subscribe(
        () => console.log('Correo enviado exitosamente'),
        error => console.error('Error al enviar el correo:', error)
      );
  }



}

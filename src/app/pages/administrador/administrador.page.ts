import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';
import * as jsPDF from 'jspdf';
import { ImpresionService } from 'src/app/services/impresion.service';
import { triggerAsyncId } from 'async_hooks';
import * as sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { SendGridService } from 'src/app/services/send-grid.service';
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  personas1: any[] = [];
  paginaActualPersona: number = 1;
  paginaActualCol: number = 1;
  paginaActualCred: number = 1;
  
  constructor(private oraclesSevice: OracleService, private http: HttpClient,private validacionesService: ValidacionesService,
    private alertController: AlertController, private toastController: ToastController, private serviceImpresion: ImpresionService,
    private sendGridService: SendGridService) {
     }
  
  name = '';
  email = '';
  message = '';
  
    
  
  listarDirec: boolean = false;
  listarCred: boolean = false;
  personasDireOra: any[] = [];
  personaObtenida: any;
  colegioObtenido: any;  
  anadirPerso: boolean = false;
  anadirCol: boolean = false;
  searchPerso: boolean = false;
  searchCreden: boolean = false;
  searchColegio: boolean = false;
  listarCol: boolean = false;
  filtroVisible: boolean = false;
  CERTIFICADO: any;
  tipoUsuario:any;
  cursoObtenido: any;
  personas: any[] = [];
  perfiles: any[] = [];
  listaPersonasFilter: any[] = [];
  listaPersonasFilterApoderado: any[] = [];
  generos: any[] = [];
  comunas: any[] = [];
  tipos_personas: any[] = [];
  patologias: any[] = [];
  profesiones: any[] = [];
  cargos: any[] = [];
  credenciales: any[] = [];
  colegios: any[] = [];
  listaAlumnos: any[]=[];
  matriculas: any[]=[];
  

  ngOnInit() {
    
    this.listarPerfil();
    this.listarGenero();
    this.listarComuna();
    this.listarTipoPersona();
    this.listarPatologia();
    this.listarProfesion();
    this.listarCargo();
    this.listarPersona();
    this.listarCredenciales();
    this.listarColegios();    



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
    ID_PERFIL: new FormControl(''),
    ID_GENERO: new FormControl(''),
    ID_COMUNA: new FormControl(''),
    ID_TIPO_PERSONA: new FormControl(''),
    ID_PATOLOGIA: new FormControl(''),
    ID_PROFESION: new FormControl(''),
    ID_CARGO: new FormControl(''),
    RUT_APO: new FormControl(''),

    COLEGIO_ACTUAL: new FormControl(''),
    
    
    
    
    
    
  });
  pdfData = new FormData();
  
  credencial = new FormGroup({
    RUT : new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    NOM_USUARIO: new FormControl('', Validators.required),
    CONTRASENIA: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18), Validators.pattern(/^((?!\s{1,}).)*$/)]),
    
  });
  
  colegio = new FormGroup({
    ID_COLEGIO: new FormControl('', Validators.required),
    NOM_COLEGIO: new FormControl('', Validators.required),
    DIRECCION: new FormControl('', Validators.required),
    TELEFONO: new FormControl('', Validators.required),
    CORREO: new FormControl('',  [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    ID_COMUNA: new FormControl('', Validators.required),
  });
  myForm = new FormGroup({
    file: new FormControl(),
    
  });
  
 
  btnListarDirec(){
    this.listarDirec=true;
    this.anadirPerso=false;
    this.searchPerso=false;
    this.listarCred=false;
    this.searchCreden=false;
    this.listarCol=false;
    this.anadirCol=false;
    this.searchColegio=false;
    this.listarCredenciales();
    console.log(this.listarCred, this.listarDirec)
    
  }

  btnListarCred(){
    this.listarDirec=false;
    this.anadirPerso=false;
    this.searchPerso=false;
    this.listarCred=true;
    this.searchCreden=false;
    this.listarCol=false;
    this.anadirCol=false;
    this.searchColegio=false;
    this.listarCredenciales();
    console.log(this.personasDireOra)
    
  }

  btnListarCol(){
    this.listarCol=true;
    this.listarDirec=false;
    this.anadirPerso=false;
    this.searchPerso=false;
    this.listarCred=false;
    this.searchCreden=false;
    this.anadirCol=false;
    this.searchColegio=false;
  }
  
  
  paraAnadirUser(){
    this.anadirPerso=true;
    this.searchPerso=false;
    this.listarDirec=false;
    this.listarCred=false;
    this.searchCreden=false;
    this.listarCol=false;
    this.anadirCol=false;
    this.searchColegio=false;
    this.user.reset();
  }

  paraAnadirCol(){
    this.anadirPerso=false;
    this.searchPerso=false;
    this.listarDirec=false;
    this.listarCred=false;
    this.searchCreden=false;
    this.listarCol=false;
    this.anadirCol=true;
    this.searchColegio=false;

  }
  paraBuscarUser(){
    this.anadirPerso=false;
    this.searchPerso=true
    this.listarDirec=false;
    this.listarCred=false;
    this.searchCreden=false;
    this.listarCol=false;
    this.anadirCol=false;
    this.searchColegio=false;
  }
  
  readFile(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const blob = new Blob([buffer], { type: file.type });
        resolve(blob);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  
  
  readFile3(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
 readFile2(file: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsText(file);
  });
}

formData : any = new FormData();

  async onSubmit() {
   /* const url = 'http://localhost:4201/personasAdd';
  
    try {
      const response = await this.http.post(url, this.formData).toPromise();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
*/
    this.formData.forEach((value:any, key:any) => {
      console.log(`${key}: ${value}`);
    });
        try {
          const response = this.oraclesSevice.upload(this.formData/*, this.CERTIFICADO*/).subscribe(
            (dato) => console.log(dato),   // Función de callback para datos emitidos
            (error) => console.error(error), // Función de callback para manejar errores
            () => console.log('El observable ha finalizado') // Función de callback para manejar finalización
            );
        } catch (error) {
          console.error('POST error:', error);
        }
      }


  
  archivo : any;
  async onFileSelect(event: any) {
    let file;
    try {
      file = event.target.files[0];
      this.archivo= event;
      const contenido: any = await this.readFile(file);
      console.log(contenido);
      const keys = Array.from(this.formData.keys());
      console.log(keys)
      if (keys.length > 0) {
        this.formData.delete('archivo');
        this.formData.delete('rut');
  
      }
        this.formData.append('archivo', contenido, file.name);
        console.log(this.user.value.RUT)
        this.formData.append('rut', this.user.value.RUT);
        console.log(this.formData);
        this.pdfData = this.formData;
        this.formData.forEach((value:any, key:any) => {
          console.log(`${key}: ${value}`);
        });
    } catch (error) {
      
    }

    
    
  
}

async onFileSelect2(event: any) {
  const formData = new FormData();
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    const contenido:any = await this.readFile(file);
    console.log(contenido);
    const formData = new FormData();
    formData.append('archivo', contenido);
    console.log(formData);
    this.pdfData = formData;
  }
  
  /*if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.pdfData.append('archivo', file);
    console.log(this.pdfData);
    /*const contenido = await this.readFile(file);
    console.log(contenido);
    console.log(JSON.stringify(contenido));
    this.user.controls['archivo'].setValue(contenido);
  }*/
}
/*
  async onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      const file:any = event.target.files[0];
      let lector = new FileReader();
      let contenido;
      
      lector.onload = function(event:any) {
        contenido = event.target.result;
        //console.log(contenido);
        
        //user.controls['archivo'].setValue(JSON.stringify(file.value));
        //console.log(file)
        return contenido;
      };  
      
      contenido = await lector.readAsText(file);
      console.log(contenido );
    }
  }
  */
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
      console.log(`El valor no se encontró en el array`);
      return userEncontrado
    }
    
  }
  
  // crea un nuevo objeto `Date`
today = new Date();
 
// `getDate()` devuelve el día del mes (del 1 al 31)
day = this.today.getDate();
 
// `getMonth()` devuelve el mes (de 0 a 11)
month = this.today.getMonth() + 1;
 
// `getFullYear()` devuelve el año completo
year = this.today.getFullYear();
 
// muestra la fecha de hoy en formato `MM/DD/YYYY`
//console.log(this.month'/'this.day'/'this.year);
 
/*
    Resultado: 1/27/2020
*/

  fecha:any;
  anadirUser() {

    let condicion = false
    this.credenciales.forEach(X => {
      if (X[1] == this.credencial.value.NOM_USUARIO)  {
        condicion = true;       
        
      }
    })
    console.log(condicion)
    if (condicion) {
      let msg='nombre de usuario ya ocupado'
      this.tostadaUniversal(msg,'top')
      return
    }
    this.fecha= this.user.value.FECHA_NAC
    const fs=this.fecha.split('/')
    const addcero = (num:any)=>{

      return (num<10)? '0'+num : ''+num

    }
    const fechanum=fs[2]+fs[1]+fs[0]
    const fechahoy=addcero(this.year.toString())+addcero(this.month.toString())+addcero(this.day.toString())
    if (fechanum>fechahoy) {
      let msg='Fecha de nacimiento inválida'
      this.tostadaUniversal(msg,'top')
      return
    }
    console.log(this.user.value);
    console.log(this.user);
    const rutControl = this.user.get('RUT');
    var rut_user=this.validacionesService.validarRut(this.user.value.RUT);
    console.log(this.user)
    var usuFind = this.buscarUserr();
    console.log(usuFind);
    
    console.log(rut_user)
    
    if (rut_user == false) {
      let msg='Usuario con rut no valido'; 
      this.tostadaUniversal(msg,'top')
      return;
    }else{
      
      if (usuFind == undefined){
        console.log('hola0')
        console.log(this.user.value.ID_TIPO_PERSONA)
        if (this.user.value.ID_TIPO_PERSONA=='3') {
          
          console.log('hola1')
          const cc = async ()=>{
            this.listarPersona();
            this.listarColegios()
            this.listarCredenciales();
            await this.onFileSelect(this.archivo);
            this.onSubmit();
            this.tostadaConfirmAdd('top')
            this.user.reset()
            //Quitarle el comentario cuando ya funcione
            
          }

          const response = this.oraclesSevice.agregarPersona(this.user.value/*, this.CERTIFICADO*/).subscribe({
            next(position) {
              console.log('se logro con exito agregar persona');
              cc();
            },
            error(msg) {
              console.log('Error Getting Location: ', msg);
            }
          });



        } else {
          console.log('hola2')
          try {
            this.credencial.value.RUT=this.user.value.RUT
            console.log(this.credencial.value.RUT)
            console.log(this.user)
            const bb = async ()=>{
                this.listarPersona();
                this.listarColegios()
                this.listarCredenciales();
                console.log('POST response:', response);
                console.log(response);
                await this.onFileSelect(this.archivo);
                this.onSubmit();
                this.tostadaConfirmAdd('top')
                this.user.reset()
                this.credencial.reset()
                //Quitarle el comentario cuando ya funcione
              }
              
              const aa= async()=>{
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
          this.listarColegios()
        }
        
      }else{
        let msg='La persona ya se encuentra registrada';
        this.tostadaUniversal(msg,'top')
      }
    }
    
    
    
  }


  anadirCredenciales(){
    const responseCred = this.oraclesSevice.agregarCredencial(this.credencial.value).subscribe(
      (dato) => console.log(dato),   // Función de callback para datos emitidos
      (error) => console.error(error), // Función de callback para manejar errores
      () => console.log('El observable ha finalizado') // Función de callback para manejar finalización
      );;
      this.listarCredenciales();
  }

  
  anadirColegio() {
    
    const aa=()=>{
      this.listarColegios();
      this.tostadaConfirmAddColegio('top');
      this.colegio.reset()
      
      
    };
    const response = this.oraclesSevice.agregarColegio(this.colegio.value).subscribe(
      {        
        next(position) {
          console.log('se logro con exito llamar a la matricula');
          aa();
        
          
        },
        error(msg) {
          console.log('Error Getting matricula', msg);
        }// Función de callback para manejar finalización
      }
    );;
    console.log(response);

  }
  
  
  async eliminarPersona(rut: string) {

    const ff = async()=>{
      this.listarPersona();
      this.listarCredenciales();
      this.listarColegios()

    }

    const bb = async ()=>{
      
      const responsePerso = this.oraclesSevice.eliminarPersona2(rut).subscribe({
        next(position) {
          console.log('se logro con exito llamar a la credencial');
          ff();
        },
        error(msg) {
          console.log('Error Getting credencial', msg);
          ff();
        }// Función de callback para manejar finalización
      });

      let msg='Persona eliminada con éxito!'
      this.tostadaUniversal(msg,'top')
      
    }
    const aa= async ()=>{
      const responseCred = this.oraclesSevice.eliminarCredencial(rut).subscribe({
        next(position) {
          console.log('se logro con exito llamar a la credencial');
          bb();
        },
        error(msg) {
          console.log('Error Getting credencial', msg);
        }// Función de callback para manejar finalización
      });;
      this.listarCredenciales();} ;

      const cc = async (rut_alumno:any)=>{
      
        const responsePerso = this.oraclesSevice.eliminarPersona2(rut_alumno).subscribe({
          next(position) {
            console.log('se logro con exito llamar a la credencial');
            aa();
          },
          error(msg) {
            console.log('Error Getting credencial', msg);
          }// Función de callback para manejar finalización
        });
        this.listarPersona();
        
        
        //Quitarle el comentario cuando ya funcione
        //this.enviarCorreo(this.user.value.CORREO, this.user.value.P_NOMBRE, this.user.value.S_NOMBRE, this.user.value.AP_PATERNO, this.user.value.AP_MATERNO, this.credencial.value.NOM_USUARIO, this.credencial.value.CONTRASENIA);
      }

      const ee= async (rut_alumno:any)=>this.oraclesSevice.eliminarMatriculaPersona(rut_alumno)
      .subscribe({
        next(position) {
              cc(rut_alumno);
              console.log('se logro con exito llamar a la alumno');
            },
            error(msg) {
              console.log('Error Getting alumno', msg);
            }// Función de callback para manejar finalización
        });

      const posicionesCoincidentes = [];
      for (let i = 0; i < this.personas.length; i++) {
        const persona = this.personas[i];
        for (let j = 0; j < persona.length; j++) {
          if (j === 17 && persona[j] === rut) {
            console.log("La posición 17 coincide con el RUT.");
            posicionesCoincidentes.push(i); // Agregamos la posición de la persona que coincide
          }
        }
      }
      if (posicionesCoincidentes.length > 0) {
        console.log(`Se encontraron ${posicionesCoincidentes.length} coincidencias:`);
        for (let i = 0; i < posicionesCoincidentes.length; i++) {
          const personaCoincidente = this.personas[posicionesCoincidentes[i]];
          console.log(personaCoincidente[0]);


          
          

        const dd= async (id_curso:any)=>{
          
          console.log(id_curso)
          this.oraclesSevice.eliminarCuposPersona(id_curso).subscribe({
            next(position) {
              console.log(id_curso, position)
              console.log('se logro con exito llamar a la responsePersonaCupos');
              console.log(personaCoincidente[0])
              ee(personaCoincidente[0]);
            },
            error(msg) {
              console.log('Error Getting responsePersonaCupos', msg);
              console.log(personaCoincidente[0])
              ee(personaCoincidente[0]);
            }// Función de callback para manejar finalización
          });;
          ;} ;
        
        this.oraclesSevice.buscarCursoPersona(personaCoincidente[0]).subscribe(
          (data) => {
            // Maneja los datos devueltos dentro de esta función
            console.log(data);
            let cursoCompleto=data[0]
            console.log(cursoCompleto);
            if (cursoCompleto!=undefined) {
              this.cursoObtenido = cursoCompleto.ID_CURSO; // Guarda los cursos en la variable cursos
              console.log(this.cursoObtenido); 
              dd(this.cursoObtenido);
              
            }else{
              cc(personaCoincidente[0]);
            }
            // Hacer algo con los datos, como mostrarlos en la consola
          }
        )                  
        }
      } else {
        aa();
      }
      console.log("No se encontraron coincidencias.");
      this.listarPersona();

    console.log("La posición 17 no coincide con el RUT.");
    }
    

    encontrarPosicion17(rut: string) {
      const posicionesCoincidentes = [];
      for (let i = 0; i < this.personas.length; i++) {
        const persona = this.personas[i];
        for (let j = 0; j < persona.length; j++) {
          if (j === 17 && persona[j] === rut) {
            console.log("La posición 17 coincide con el RUT.");
            posicionesCoincidentes.push(i); // Agregamos la posición de la persona que coincide
          }
        }
      }
      if (posicionesCoincidentes.length > 0) {
        console.log(`Se encontraron ${posicionesCoincidentes.length} coincidencias:`);
        for (let i = 0; i < posicionesCoincidentes.length; i++) {
          const personaCoincidente = this.personas[posicionesCoincidentes[i]];
          console.log(personaCoincidente[0]);
        }
      } else {
        console.log("No se encontraron coincidencias.");
      }
    }


    eliminarColegio(ID_COLEGIO: any){
      const aa = async ()=>{
        this.listarColegios();
        this.listarPersona();
        this.listarCredenciales();
        let msg='Colegio eliminado con éxito!'
        this.tostadaUniversal(msg,'top')

      }
      console.log(ID_COLEGIO)

      
          const responsePerso = this.oraclesSevice.eliminarColegio(ID_COLEGIO).subscribe({
          next(position) {
            console.log('se logro con exito llamar a la credencial');
            aa();
          },
          error(msg) {
            console.log('Error Getting credencial', msg);
          }// Función de callback para manejar finalización
        });
      
      //para eliminar cupo de curso
      const cc=()=>{}

      /*this.oraclesSevice.obtenerCuposCurso(ID_COLEGIO).subscribe(
      (data)=>{
        let cursoCupoObtenido=data;

          for (let i = 0; i < cursoCupoObtenido.length; i++) {
            let item = cursoCupoObtenido[i];
            // Realiza las operaciones que necesites con cada item de la data aquí
            console.log(item); // Por ejemplo, imprimir cada item
          }
        }
      );*/
    }


    //buscar
    
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
    RUT_APO :''            ,
    COLEGIO_ACTUAL:''
  }
  
  

  buscarPersona(RUT: string){
    this.oraclesSevice.buscarPersona(RUT).subscribe((data) => {
      this.personaObtenida=data[0]
      console.log(data)
      this.persona.RUT=this.personaObtenida[0]
      this.persona.P_NOMBRE=this.personaObtenida[1]
      this.persona.S_NOMBRE=this.personaObtenida[2]
      this.persona.AP_PATERNO=this.personaObtenida[3]
      this.persona.AP_MATERNO=this.personaObtenida[4]
      this.persona.FECHA_NAC=this.personaObtenida[5]
      this.persona.TELEFONO=this.personaObtenida[6]
      this.persona.DIRECCION=this.personaObtenida[7]
      this.persona.CORREO=this.personaObtenida[8]
      this.persona.SUELDO=this.personaObtenida[9]
      this.persona.ID_PERFIL=this.personaObtenida[10]
      this.persona.ID_GENERO=this.personaObtenida[11]
      this.persona.ID_COMUNA=this.personaObtenida[12]
      this.persona.ID_TIPO_PERSONA=this.personaObtenida[13]
      this.persona.ID_PATOLOGIA=this.personaObtenida[14]
      this.persona.ID_PROFESION=this.personaObtenida[15]
      this.persona.ID_CARGO=this.personaObtenida[16]
      this.persona.RUT_APO=this.personaObtenida[17]
      this.persona.COLEGIO_ACTUAL=this.personaObtenida[19]
      console.log(this.persona)
      this.anadirPerso=false;
      this.searchPerso=true;
      this.listarDirec=false;
      this.listarCred=false;
      this.searchCreden=false;
      this.listarCol=false;
      this.searchColegio=false;
      this.anadirCol=false;
      console.log(this.persona)
      this.user.patchValue(this.persona)
      this.user.value.ID_GENERO;
      this.listarPersona()
    });
  }
  
  
  chan(){
    console.log(this.user.value.ID_TIPO_PERSONA)
  }

  
  compareTiposPersonaFn(valueexterno: any, valueinterno: any) {
    
    return valueexterno==valueinterno;

  }

  compareColegiosFn(externo: any, interno: any): boolean {
    console.log(externo)
    console.log(interno)
    console.log(externo[0])
    console.log(interno[0])
    return externo && interno && externo.propiedad === interno.propiedad;
  }

  
  creden: any = {
    RUT:''                ,
    NOM_USUARIO:''           ,
    CONTRASENIA:''           ,
    
  }
    
  buscarCredencial(RUT: string){
    this.oraclesSevice.buscarCredencial(RUT).subscribe((data) => {
      this.personaObtenida=data[0]
      console.log(data)
      this.creden.RUT=this.personaObtenida[0]
      this.creden.NOM_USUARIO=this.personaObtenida[1]
      this.creden.CONTRASENIA=this.personaObtenida[2]
      console.log(this.creden)
      this.anadirPerso=false;
      this.searchPerso=false;
      this.listarDirec=false;
      this.searchCreden=true;
      this.listarCred=false;
      this.listarCol=false;
      this.searchColegio=false;
      this.anadirCol=false;
      this.credencial.patchValue(this.creden)
      this.listarPersona()
    });
  }


  colegioDatos: any = {
    ID_COLEGIO: 0,
    NOM_COLEGIO: '',
    TELEFONO: 0,
    DIRECCION:'',
    CORREO:'',
    ID_COMUNA:0    
  }

  buscarColegio(ID_COLEGIO: any, NOM_COLEGIO: any){
    console.log('entro al buscar colegio del components')
    this.oraclesSevice.buscarColegio(ID_COLEGIO, NOM_COLEGIO).subscribe((data) => {
      this.colegioObtenido=data[0]
      console.log(data)
      this.colegioDatos.ID_COLEGIO=this.colegioObtenido[0]
      this.colegioDatos.NOM_COLEGIO=this.colegioObtenido[1]
      this.colegioDatos.TELEFONO=this.colegioObtenido[2]
      this.colegioDatos.DIRECCION=this.colegioObtenido[3]
      this.colegioDatos.CORREO=this.colegioObtenido[4]
      this.colegioDatos.ID_COMUNA=this.colegioObtenido[5]
      console.log(this.colegioDatos)
      this.anadirPerso=false;
      this.searchPerso=false;
      this.listarDirec=false;
      this.searchCreden=false;
      this.searchColegio=true;
      this.listarCred=false;
      this.listarCol=false;
      this.anadirCol=false;
      this.colegio.patchValue(this.colegioDatos)
      this.listarColegios()
    });
  }
  
  //Listar
  listarPersona(){

    const bb = async () =>{
      this.listaPersonasFilterApoderado = this.personas.filter(persona => persona[13]=='APODERADO');
      console.log(this.listaPersonasFilterApoderado)
    }

    this.oraclesSevice.listarPersonas3().subscribe((data: any[]) => {
      this.personas=data;
      this.listaPersonasFilter=this.personas
      bb();
      console.log(this.personas)
    });
  }

  listarCredenciales(){
    this.oraclesSevice.listarCredenciales().subscribe((data: any[]) => {
      this.credenciales=data
      console.log(this.credenciales)
    });
  }
  
  listarColegios(){
    this.oraclesSevice.listarColegios().subscribe((data: any[]) => {
      this.colegios=data
      console.log(this.colegios)
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
  
  
  listarMatriculas(){
    this.oraclesSevice.listarMatriculas().subscribe((data: any[]) => {
      this.matriculas=data
      console.log(this.matriculas)
      
    });
  }
  
  //Modificar
  actualizarPersona(){
    this.fecha= this.user.value.FECHA_NAC
    const fs=this.fecha.split('/')
    const addcero = (num:any)=>{

      return (num<10)? '0'+num : ''+num

    }
    const fechanum=fs[2]+fs[1]+fs[0]
    const fechahoy=addcero(this.year.toString())+addcero(this.month.toString())+addcero(this.day.toString())
    if (fechanum>fechahoy) {
      let msg='Fecha de nacimiento inválida'
      this.tostadaUniversal(msg,'top')
      return
    }else{
      this.oraclesSevice.actualizarPersona(this.user.value).subscribe(
        response => {
          console.log('Persona actualizada:', response);
          this.listarPersona();
          this.listarCredenciales();
          this.user.reset();
          let msg='Persona actualizada con exito!'
          this.tostadaUniversal(msg, 'top')
        },
        error => {
          console.error('Error al actualizar persona:', error);
        }
      );

    }
  }

  actualizarCredencial(){
    let condicion = false
    this.credenciales.forEach(X => {
      if (X[1] == this.credencial.value.NOM_USUARIO)  {
        condicion = true;       
        
      }
    })
    console.log(condicion)
    if (condicion) {
      let msg='nombre de usuario ya ocupado'
      this.tostadaUniversal(msg,'top')
      return
    }
    this.oraclesSevice.actualizarCredencial(this.credencial.value).subscribe(
      response => {
        console.log('Credencial actualizada:', response);
        this.listarPersona();
        this.listarColegios();
        this.listarCredenciales();
        this.credencial.reset();
        let msg='Credencial actualizada con exito!'
        this.tostadaUniversal(msg, 'top')
      },
      error => {
        console.error('Error al actualizar credencial:', error);
      }
    );
  }


  actualizarColegio(){
    const aa = async ()=>{
      this.listarPersona();
      this.listarColegios();
      this.colegio.reset()
      let msg = 'Colegio actualizado'
      this.tostadaUniversal(msg, 'top')
    }
    this.oraclesSevice.actualizarColegio(this.colegio.value).subscribe(
      response => {
        aa();
      },
      error => {
        console.error('Error al actualizar credencial:', error);
      }
    );
    
  }

  async presentAlertBorrar(rut:any) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Alerta!',
      subHeader: 'Estas seguro/a que deseas eliminar a esta persona',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.eliminarPersona(rut);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    
    await alert.present()
    
  }

  async presentAlertBorrarCol(id_colegio:any) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Alerta!',
      subHeader: 'Estas seguro/a que deseas eliminar a este Colegio',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.eliminarColegio(id_colegio);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    
    await alert.present()
    
  }
  
  async tostadaConfirmAdd(position: 'top') {
    const toast = await this.toastController.create({
      message: 'El usuario ha sido agregado con exito!',
      duration: 3000,
      position: position
    });
    toast.present();
  }
  
  onImprimir(){
    const encabezado = ["RUT", "NOMBRE", "APELLIDO", "TIPO USUARIO"]
    const listaPDFCuerpo:any[]=[]
    this.listaPersonasFilter.forEach(x=> {
      listaPDFCuerpo.push([x[0],x[1],x[3], x[13]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de personas", true);
  }
  
  
  onImprimirCreden(){
    const encabezado = ["RUT", "NOMBRE USUARIO", "CONTRASEÑA"]
    const listaPDFCuerpo:any[]=[]
    this.credenciales.forEach(x=> {
      listaPDFCuerpo.push([x[0],x[1],x[2]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de credenciales", true);
  }
  
  
  
  onImprimirColegios(){
    const encabezado = ["NOMBRE COLEGIO", "TELEFONO", "DIRECCION", "CORREO", "COMUNA"]
    const listaPDFCuerpo:any[]=[]
    this.colegios.forEach(x=> {
      listaPDFCuerpo.push([x[1],x[2],x[3],x[4],x[5]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de colegios", true);
  }
  

  filtrarPersona(value: any){
    this.paginaActualPersona=1;
    this.listaPersonasFilter = this.personas.filter(persona => persona[13] == value);
    
  }
  
  onFiltrar(){
    this.filtroVisible=!this.filtroVisible;
  }
  
  seleccionarTipoUsuario(evento: any) {
    console.log(evento.target.value);
    this.filtrarPersona(evento.target.value.DESCRIPCION);
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post('http://localhost:8100/home/administrador', formData).subscribe(response => {
      console.log(response);
    });
  }


//Enviar correos
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

  async tostadaConfirmAddColegio(position: 'top') {
    const toast = await this.toastController.create({
      message: 'El colegio ha sido agregado con exito!',
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





}
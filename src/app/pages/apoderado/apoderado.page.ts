import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ImpresionService } from 'src/app/services/impresion.service';
import { OracleService } from 'src/app/services/oracle.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-apoderado',
  templateUrl: './apoderado.page.html',
  styleUrls: ['./apoderado.page.scss'],
})
export class ApoderadoPage implements OnInit {

  paginaActual: number = 1;
  paginaActualMatricula: number = 1;

  constructor(private oraclesSevice: OracleService, private http: HttpClient, private validacionesService: ValidacionesService,
    private alertController: AlertController, private toastController: ToastController, private activatedRoute: ActivatedRoute,
    private serviceImpresion: ImpresionService) { }

  agregarAlumno: boolean = false;
  agregaMatricula: boolean = false;
  listarAlumno: boolean = false;
  listarMatricula: boolean = false;
  buscarAlumno: boolean = false;
  buscarMatricula: boolean = false;
  cupos_totales: number=0;
  condicionMatricula: boolean=false;
  mensaje_condicion_matricula:string='';

  fecha:any;
  personaObtenida: any;
  personaObtenidaRut: any;
  matriculaObtenida: any;
  personas: any[] = [];
  perfiles: any[] = [];
  generos: any[] = [];
  comunas: any[] = [];
  tipos_personas: any[] = [];
  patologias: any[] = [];
  listaPersonasFilter: any[] = [];
  colegios: any[]=[];
  cursos: any[]=[];
  cursos_completos: any[]=[];
  matriculas: any[]=[];
  listarMatriculasFilter: any[]=[];
  usuarioDato: any;



  ngOnInit() {
    this.listarPerfil();
    this.listarGenero();
    this.listarComuna();
    this.listarTipoPersona();
    this.listarPatologia();
    this.listarPersona();
    this.listarCursoCompleto();
    this.usuarioDato = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.usuarioDato)
    this.listarColegio();
    this.listarMatriculas();

  }

  user = new FormGroup({
    RUT: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
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
    ID_TIPO_PERSONA: new FormControl('3'),
    ID_PATOLOGIA: new FormControl(''),
    ID_PROFESION: new FormControl(''),
    ID_CARGO: new FormControl(''),
    RUT_APO: new FormControl(''),
    COLEGIO_ACTUAL: new FormControl('')

  });

  matricula = new FormGroup({
    ID_MATRICULA: new FormControl(''),
    FECHA: new FormControl(''),
    RUT_APODERADO: new FormControl('', Validators.required),
    RUT_ALUMNO: new FormControl('', Validators.required),
    ID_COLEGIO: new FormControl('', Validators.required),
    ID_CURSO: new FormControl('', Validators.required),
    CONTACTO_EMERGENCIA: new FormControl('', Validators.required)

  });


  btnAgregarAlumno() {
    this.agregarAlumno = true;
    this.agregaMatricula = false;
    this.listarAlumno = false;
    this.listarMatricula = false;
    this.buscarAlumno=false;
    this.buscarMatricula=false;
  }
  btnListarAlumno() {
    this.agregarAlumno = false;
    this.agregaMatricula = false;
    this.listarAlumno = true;
    this.listarMatricula = false;
    this.buscarAlumno=false;
    this.buscarMatricula=false;
  }
  btnAgregarMatricula() {
    this.agregarAlumno = false;
    this.agregaMatricula = true;
    this.listarAlumno = false;
    this.listarMatricula = false;
    this.buscarAlumno=false;
    this.buscarMatricula=false;
    
    //Aqui se agregara el servicio para sumar el cupo

  }
  btnListarMatricula() {
    this.agregarAlumno = false;
    this.agregaMatricula = false;
    this.listarAlumno = false;
    this.listarMatricula = true;
    this.buscarAlumno=false;
    this.buscarMatricula=false;
  }

  listarPersona() {
    const bb = async ()=>{
      this.listaPersonasFilter = this.personas.filter(persona => persona[17]==this.usuarioDato);
      console.log(this.listaPersonasFilter)
      
    }
    this.oraclesSevice.listarPersonas3().subscribe((data: any[]) => {
      this.personas = data
      console.log(this.personas)
      bb();
    });
  }

  listarPerfil() {
    this.oraclesSevice.getDataPerfil().subscribe((data: any[]) => {
      this.perfiles = data
      console.log(this.perfiles)

    });
  }


  listarColegio() {
    this.oraclesSevice.listarColegios().subscribe((data: any[]) => {
      this.colegios = data
      console.log(this.colegios)

    });
  }

  listarCursoCompleto() {
    this.oraclesSevice.getDataCursoCompleto().subscribe((data: any[]) => {
      this.cursos_completos = data
      console.log(this.cursos_completos)

    });
  }


  listarCursos() {
    this.oraclesSevice.listarCursos().subscribe((data: any[]) => {
      this.cursos = data
      console.log(this.cursos)

    });
  }

  listarGenero() {
    this.oraclesSevice.getDataGenero().subscribe((data: any[]) => {
      this.generos = data
      console.log(this.generos)

    });
  }

  listarComuna() {
    this.oraclesSevice.getDataComuna().subscribe((data: any[]) => {
      this.comunas = data
      console.log(this.comunas)

    });
  }

  listarTipoPersona() {
    this.oraclesSevice.getDataTipoPersona().subscribe((data: any[]) => {
      this.tipos_personas = data
      console.log(this.tipos_personas)

    });
  }

  listarPatologia() {
    this.oraclesSevice.getDataPatologia().subscribe((data: any[]) => {
      this.patologias = data
      console.log(this.patologias)

    });
  }

  listarMatriculas(){
    const bb = async ()=>{
      this.listarMatriculasFilter = this.matriculas.filter(persona => persona[2]==this.usuarioDato);
      console.log(this.listarMatriculasFilter)
      
      
    }
    this.oraclesSevice.listarMatriculas().subscribe((data: any[]) => {
      this.matriculas=data
      console.log(this.matriculas)
      bb();
    });
  }


  //Buscar User
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

  today = new Date();
 
// `getDate()` devuelve el día del mes (del 1 al 31)
  day = this.today.getDate();
  
  // `getMonth()` devuelve el mes (de 0 a 11)
  month = this.today.getMonth() + 1;
  
  // `getFullYear()` devuelve el año completo
  year = this.today.getFullYear();


  //Agregar
  anadirUser() {

    this.user.value.ID_PERFIL='3';
    this.user.value.ID_TIPO_PERSONA='3';

    console.log(this.user.value);
    console.log(this.user);
    this.user.value.RUT_APO=this.usuarioDato;
    const rutControl = this.user.get('RUT');
    var rut_user=this.validacionesService.validarRut(this.user.value.RUT);
    
    var usuFind = this.buscarUserr();
    console.log(usuFind);
    
    console.log(rut_user)

    
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
    
    if (rut_user == false) {
      this.tostadaUniversal('Usuario con rut no valido','top'); 
      return;
    }else{
      
      if (usuFind == undefined){
        try {
          const aa= async ()=>{
            // Función de callback para manejar finalización
          this.onSubmit();
          this.listarPersona();
          this.tostadaConfirmAdd('top');
          this.user.reset();
            } ;
          const response = this.oraclesSevice.agregarPersona(this.user.value/*, this.CERTIFICADO*/).subscribe({
            next(position) {
              console.log('se logro con exito agregar persona');
              aa();
            },
            error(msg) {
              console.log('Error Getting Location: ', msg);
            }
          });
          
            console.log('POST response:', response);
            console.log(response);
          //this.listarDirectivos();
        } catch (error) {
          console.error('POST error:', error);
        }
        
        console.log('jeeee');
        this.listarPersona();
        
      }else{
        this.tostadaUniversal('La persona ya se encuentra registrada','top')
      }
    }
      
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


  formData : any = new FormData();
  archivo : any;
  pdfData = new FormData();

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


     
     
    anadirMatricula() {
    this.matricula.value.RUT_APODERADO=this.usuarioDato
    console.log(this.matricula.value);
    const personaMat = this.matricula.value;
    console.log()
    
    const aa= async ()=>{
      this.listarMatriculas();
      this.listarCursoCompleto();
      this.matricula.reset();  
      let msg='Matrícula agregada con éxito!'    
      this.tostadaUniversal(msg,'top')
      
      
    };
  
    
    const bb= async ()=>{  const response = this.oraclesSevice.agregarMatricula(personaMat).subscribe(
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
      console.log('POST response:', response);
      console.log(response);
    }
    
    let estaMatriculado =false;

    this.oraclesSevice.getDataMatriculaRut(this.matricula.value.RUT_ALUMNO).subscribe(
      (data) => {
        let infoPersoMat=data[0];
        console.log(infoPersoMat)
        if(infoPersoMat!=undefined){
          let msg='persona ya se encuentra matriculada';
          this.tostadaUniversal(msg,'top')

        }else{
          console.log('persona no esta matriculada')
          bb();
        }
        
      }
    )

    /*this.oraclesSevice.buscarRutAlumno(this.matricula.value.RUT_ALUMNO).subscribe((data) => {
      let matriculaObtenidaRutAlumno=data[0]
      console.log(data)
      console.log('aqui pierdo los valores',pelota)
      
      console.log('valor matricula ',matriculaObtenidaRutAlumno)
      
      if (matriculaObtenidaRutAlumno!==undefined) {
        console.log('MATRICULA ENCONTRADAA')
        if (matriculaObtenidaRutAlumno.length >= 4) {
          this.rutEncontradoMatricula=matriculaObtenidaRutAlumno[3]
          alert('El alumno ya se encuentra Matriculado '+ this.rutEncontradoMatricula);
          return this.rutEncontradoMatricula
      }else{
        console.log('No había alumno con ese rut en matriculas');
        bb();
        
      }       
      console.log('No había alumno con ese rut en matriculas');
        
      }
    });
    
     
      this.matricula.reset();
    
          //this.listarDirectivos();*/
        

    
    
    
  }

  



  //Eliminar
  eliminarPersona(rut: string) {
    
      this.oraclesSevice.eliminarPersonaMatricula(rut)
      .subscribe(resultado => {
          console.log(resultado);
          // Actualizar la lista de personas
          this.listarPersona();
          this.listarMatriculas();
          this.listarCursoCompleto();
          let msg='Persona eliminada con éxito!'
          this.tostadaUniversal(msg,'top');
        }, error => console.error(error));
      
    }


  eliminarMatricula(id_matricula: any) {
    this.oraclesSevice.eliminarMatricula(id_matricula)
    .subscribe(resultado => {
      console.log(resultado);
      // Actualizar la lista de personas
      
      this.listarMatriculas();
      this.listarCursoCompleto();
      this.listarPersona();
      let msg='Matricula eliminada con éxito!'
      this.tostadaUniversal(msg,'top');
    }, error => console.error(error));
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
      RUT_APO :'' ,
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
        this.agregarAlumno = false;
        this.agregaMatricula = false;
        this.listarAlumno = false;
        this.listarMatricula = false;
        this.buscarAlumno=true;
        this.user.patchValue(this.persona)
        
      });
    }


    matriculaRutAlumno: any = {
      ID_MATRICULA:0,
      FECHA:'',
      RUT_APODERADO:'',
      RUT_ALUMNO:'',
      ID_COLEGIO:0,
      ID_CURSO:0,
      CONTACTO_EMERGENCIA:0  
        }
      
        rutEncontradoMatricula:any;

    buscarRutAlumno(RUT: any){
      this.oraclesSevice.buscarRutAlumno(RUT).subscribe((data) => {
        let matriculaObtenidaRutAlumno=data[0]
        console.log(data) 
        
        this.rutEncontradoMatricula=matriculaObtenidaRutAlumno[3]
        if (this.rutEncontradoMatricula!=undefined) {
          console.log('se encontro el alumno matriculado',this.rutEncontradoMatricula);
          return this.rutEncontradoMatricula
      }       
        console.log('No había alumno con ese rut en matriculas');
      });
    }

    rutPersonaObtenida:any;
    buscarPersonaRut(RUT: any){
      this.oraclesSevice.buscarPersona(RUT).subscribe((data) => {
        this.personaObtenidaRut=data[0]
        console.log(data)


        this.rutPersonaObtenida=this.personaObtenidaRut[0]
        if (this.rutPersonaObtenida!=undefined) {
          console.log(this.rutPersonaObtenida)

        } else {
          console.log('No tiene matricula')
        }

      });
    }
    //BUSCAR MATRICULAS

    matriculaDatos: any = {
      ID_MATRICULA:'', 
      FECHA:'',
      RUT_APODERADO:'',
      RUT_ALUMNO:'',
      ID_COLEGIO:'', 
      ID_CURSO:'', 
      CONTACTO_EMERGENCIA:0
    }
    
    
    buscarMatriculas(ID_MATRICULA: any){
      this.oraclesSevice.buscarMatricula(ID_MATRICULA).subscribe((data) => {
        this.matriculaObtenida=data[0]
        console.log(data)
        this.matriculaDatos.ID_MATRICULA=this.matriculaObtenida[0]
        this.matriculaDatos.FECHA=this.matriculaObtenida[1]
        this.matriculaDatos.RUT_APODERADO=this.matriculaObtenida[2]
        this.matriculaDatos.RUT_ALUMNO=this.matriculaObtenida[3]
        this.matriculaDatos.ID_COLEGIO=this.matriculaObtenida[4]
        this.matriculaDatos.ID_CURSO=this.matriculaObtenida[5]
        this.matriculaDatos.CONTACTO_EMERGENCIA=this.matriculaObtenida[6]
        
        console.log(this.matriculaDatos)
        this.agregarAlumno = false;
        this.agregaMatricula = false;
        this.listarAlumno = false;
        this.listarMatricula = false;
        this.buscarAlumno=false;
        this.buscarMatricula=true;
        this.matricula.patchValue(this.matriculaDatos);
        console.log(this.matricula.value)

      });
    }


    actualizarMatricula(){
      this.oraclesSevice.actualizarMatricula(this.matricula.value).subscribe(
        response => {
          console.log('Matricula actualizada:', response);
          let msg='Matrícula actualizada con éxito!'
          this.matricula.reset();
          this.listarMatriculas();
          this.listarCursoCompleto();
          this.tostadaUniversal(msg,'top')
        },
        error => {
          console.error('Error al actualizar Matricula:', error);
        }
      );
    }

    //Modificar
    actualizarPersona(){
      this.user.value.ID_PERFIL='3';
      this.user.value.ID_TIPO_PERSONA='3';
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
      this.oraclesSevice.actualizarPersona(this.user.value).subscribe(
        response => {
          
          console.log('Persona actualizada:', response);

          let msg='Persona actualizada con éxito!'
          this.listarPersona();
          this.user.reset();
          this.tostadaUniversal(msg,'top')
        },
        error => {
          console.error('Error al actualizar persona:', error);
        }
      );
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

  async presentAlertBorrarMat(ID_MATRICULA:any) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Alerta!',
      subHeader: 'Estas seguro/a que deseas eliminar esta matrícula',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.eliminarMatricula(ID_MATRICULA);
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

  filtrarPersona(){
    console.log(this.usuarioDato)
    console.log(this.personas)
    this.listaPersonasFilter = this.personas.filter(persona => persona[17]==this.usuarioDato);
    console.log(this.listaPersonasFilter)
    
  }

  

  onImprimir(){
    console.log(this.listaPersonasFilter)
    const encabezado = ["RUT", "NOMBRE", "APELLIDO", "RUT APODERADO"]
    const listaPDFCuerpo:any[]=[]
    this.listaPersonasFilter.forEach(x=> {
      listaPDFCuerpo.push([x[0],x[1],x[3], x[17]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de alumnos", true);
  }


  onImprimirMatricula(){
    console.log(this.listarMatriculasFilter)
    const encabezado = ["ID MATRICULA", "RUT APODERADO", "RUT ALUMNO","COLEGIO"]
    const listaPDFCuerpo:any[]=[]
    this.listarMatriculasFilter.forEach(x=> {
      listaPDFCuerpo.push([x[0],x[2], x[3], x[4]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de matrículas", true);
  }


  handleChange(e:any) {
    console.log(e.detail.value);
    console.log(this.cursos_completos);
    let curso_seleccionado=this.cursos_completos.find(x=> x[0]==e.detail.value)
    console.log(curso_seleccionado)
    this.cupos_totales=curso_seleccionado[2]-curso_seleccionado[3]
    if(this.cupos_totales>0){
      this.condicionMatricula=true;
      this.mensaje_condicion_matricula='';
    }else{
      this.condicionMatricula=false;
      this.mensaje_condicion_matricula='No hay cupos disponibles';

      
    }
  }


  compareTiposPersonaFn(valueexterno: any, valueinterno: any) {
    return valueexterno==valueinterno;

  }

}

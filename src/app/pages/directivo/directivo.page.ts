import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertButton, AlertController, ToastController } from '@ionic/angular';
import { ImpresionService } from 'src/app/services/impresion.service';
import { OracleService } from 'src/app/services/oracle.service';
import { SendGridService } from 'src/app/services/send-grid.service';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-directivo',
  templateUrl: './directivo.page.html',
  styleUrls: ['./directivo.page.scss'],
})
export class DirectivoPage implements OnInit {

  paginaActual: number = 1;
  paginaActualCurso: number = 1;
  paginaActualMatricula: number = 1;

  
  constructor(private oraclesSevice: OracleService, private validacionesService: ValidacionesService, private toastController: ToastController,private alertController: AlertController,
    private serviceImpresion: ImpresionService, private sendGridService:SendGridService) { }


  agregarApoderado: boolean=false;
  agregarCurso: boolean=false;
  agregarMatricula: boolean=false;
  listarApoderado: boolean=false;
  listarCurso: boolean=false;
  listarMatricula: boolean=false;
  searchPerso=false;
  searchCurso=false;
  searchMatricula=false;
  condicionMatricula: boolean=false;

  matriculaObtenida:any;
  personaObtenida:any;
  cursoObtenida:any;
  mensaje_condicion_matricula:string=''
  cupos_totales: number=0;
  cursoObtenido:any;
  fecha:any;

  personas: any[] = [];
  perfiles: any[] = [];
  generos: any[] = [];
  comunas: any[] = [];
  tipos_personas: any[] = [];
  patologias: any[] = [];
  profesiones: any[] = [];
  cargos: any[] = [];
  credenciales: any[] = [];
  cursos: any[] = [];
  colegios: any[] = [];
  niveles: any[] = [];
  matriculas: any[] = [];
  listaPersonasFilter: any[] = [];  
  cursos_completos: any[]=[];
  listaAlumnosFiltrados: any[]=[];


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
    this.listarCursos();
    this.listarColegios();
    this.listarNivel();
    this.listarMatriculas();
    this.listarCursoCompleto();
    this.listarMatriculas();
    
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


  curso = new FormGroup({    
    ID_CURSO : new FormControl(''), 
    ID_COLEGIO: new FormControl(''), 
    ID_NIVEL: new FormControl(''),
    CUPO: new FormControl(''),
    DESCRIPCION: new FormControl('')
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

/*---------BOTONES PARA AGREGAR-------*/
  btnAgregarApoderado(){
    this.agregarApoderado=true;
    this.agregarCurso=false;
    this.agregarMatricula=false;
    this.listarApoderado = false;
    this.listarCurso = false;
    this.listarMatricula = false;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

  }
  btnAgregarCurso(){
    this.agregarApoderado=false;
    this.agregarCurso=true;
    this.agregarMatricula=false;
    this.listarApoderado = false;
    this.listarCurso = false;
    this.listarMatricula = false;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

  }
  btnAgregarMatricula(){
    this.agregarApoderado=false;
    this.agregarCurso=false;
    this.agregarMatricula=true;
    this.listarApoderado = false;
    this.listarCurso = false;
    this.listarMatricula = false;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

  }
/*---------BOTONES PARA LISTAR-------*/  
  btnListarApoderado(){
    this.agregarApoderado=false;
    this.agregarCurso=false;
    this.agregarMatricula=false;
    this.listarApoderado = true;
    this.listarCurso = false;
    this.listarMatricula = false;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

  }
  btnListarCurso(){
    this.agregarApoderado=false;
    this.agregarCurso=false;
    this.agregarMatricula=false;
    this.listarApoderado = false;
    this.listarCurso = true;
    this.listarMatricula = false;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

  }
  btnListarMatricula(){
    this.agregarApoderado=false;
    this.agregarCurso=false;
    this.agregarMatricula=false;
    this.listarApoderado = false;
    this.listarCurso = false;
    this.listarMatricula = true;
    this.searchPerso=false;
    this.searchCurso=false;
    this.searchMatricula=false;

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

    this.user.value.ID_PERFIL = '3';
    this.user.value.ID_TIPO_PERSONA = '2';

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
      alert('nombre de usuario ya ocupado')
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
    
    var usuFind = this.buscarUserr();
    console.log(usuFind);
    
    console.log(rut_user)
    
    if (rut_user == false) {
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
          const aa = async ()=>{
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
            const response = this.oraclesSevice.agregarPersona(this.user.value).subscribe({
              next(position) {
                console.log('se logro con exito agregar persona');
                aa();
                
              },
              error(msg) {
                console.log('Error Getting Location: ', msg);
              }
            });
            
            this.tostadaConfirmAdd('top')
            //this.listarDirectivos();
          } catch (error) {
            console.error('POST error:', error);
          }        
          console.log('jeeee');
          this.listarPersona();
        }else{
          console.log('La persona ya se encuentra registrada')
        }
        this.listarCredenciales();
      }         
      this.listarCredenciales();      
  }


  anadirCurso() {   
    const aa= async ()=> {
      console.log(response);
      this.curso.reset();
      this.listarCursos();
      let msg='Curso agregado con éxito!'
      this.tostadaUniversal(msg,'top')
    }    
    const response = this.oraclesSevice.agregarCurso(this.curso.value).subscribe({
      next(position) {
        console.log('se logro con exito agregar curso');
        aa();
      },
      error(msg) {
        console.log('Error Getting curso: ', msg);
      }
    }
    );;
  }


  //Modificar PERSONA
  actualizarPersona(){
    this.user.value.ID_PERFIL='3';
    this.user.value.ID_TIPO_PERSONA='2';
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
          this.user.reset();
          let msg='Persona actualizada con éxito!';
          this.tostadaUniversal(msg,'top')
        },
        error => {
          console.error('Error al actualizar persona:', error);
        }
      );

    }
  }


  compareCursosFn(valueexterno: any, valueinterno: any) {
    return valueexterno==valueinterno;

  }


  actualizarCurso(){
    this.oraclesSevice.actualizarCurso(this.curso.value).subscribe(
      response => {
        console.log('Curso actualizado:', response);
        this.listarCursos();
        this.listarCursoCompleto();
        this.curso.reset();
        let msg='Curso actualizado con éxito!';
        this.tostadaUniversal(msg,'top')
      },
      error => {
        console.error('Error al actualizar Curso:', error);
      }
    );
  }


  //Eliminar PERSONA
  async eliminarPersona(rut: string) {

    const gg = async ()=>{
      this.listarPersona();
      this.listarCredenciales();
      this.listarMatriculas();
      this.listarColegios();
    }


    const bb = async ()=>{
      

      const responsePerso = this.oraclesSevice.eliminarPersona2(rut).subscribe({
        next(position) {
          console.log('se logro con exito llamar a la credencial');
          gg();
        },
        error(msg) {
          console.log('Error Getting credencial', msg);
        }// Función de callback para manejar finalización
      });
      
      let msg='Persona eliminada con exito!'
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
        
        this.tostadaConfirmAdd('top')
        //Quitarle el comentario cuando ya funcione
        //this.enviarCorreo(this.user.value.CORREO, this.user.value.P_NOMBRE, this.user.value.S_NOMBRE, this.user.value.AP_PATERNO, this.user.value.AP_MATERNO, this.credencial.value.NOM_USUARIO, this.credencial.value.CONTRASENIA);
      }

      const ee= async(rut_alumno:any)=>this.oraclesSevice.eliminarMatriculaPersona(rut_alumno)
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


          
          

        const dd=  async (id_curso:any)=>{
          
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


  //Eliminar Curso
  eliminarCurso(id_curso: any) {
    
    const aa=()=>{
      this.listarCursoCompleto();
      this.listarMatriculas();
      this.listarCursos();
      let msg='Curso eliminado con éxito!'
      this.tostadaUniversal(msg,'top')
    }
    
    this.oraclesSevice.eliminarCurso(id_curso).subscribe({
      next(position) {
        console.log(id_curso, position)
        console.log('se logro con exito llamar a la responsePersonaCupos');
        aa(); 
      },
      error(msg) {
        console.log('Error Getting responsePersonaCupos', msg);
      }// Función de callback para manejar finalización
    })

    }


  //Buscar PERSONA

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
      console.log(this.persona)
      this.agregarApoderado=false;
      this.agregarCurso=false;
      this.agregarMatricula=false;
      this.listarApoderado = false;
      this.listarCurso = false;
      this.listarMatricula = false;
      this.searchPerso=true;
      this.searchCurso=false;
      this.searchMatricula=false;
      this.user.setValue(this.persona)
      this.listarPersona()
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
    
  buscarRutAlumno(RUT: string){
    this.oraclesSevice.buscarPersona(RUT).subscribe((data) => {
      let matriculaObtenidaRutAlumno=data[0]
      console.log(data)
      this.matriculaRutAlumno.ID_MATRICULA=matriculaObtenidaRutAlumno[0]
      this.matriculaRutAlumno.FECHA=matriculaObtenidaRutAlumno[1]
      this.matriculaRutAlumno.RUT_APODERADO=matriculaObtenidaRutAlumno[2]
      this.matriculaRutAlumno.RUT_ALUMNO=matriculaObtenidaRutAlumno[3]
      this.matriculaRutAlumno.ID_COLEGIO=matriculaObtenidaRutAlumno[4]
      this.matriculaRutAlumno.ID_CURSO=matriculaObtenidaRutAlumno[5]
      this.matriculaRutAlumno.CONTACTO_EMERGENCIA=matriculaObtenidaRutAlumno[6]
      console.log(this.matriculaRutAlumno);
    });
  }
  //Buscar CURSO

  cursodos: any = {
    ID_CURSO:''           , 
    ID_COLEGIO:''         , 
    ID_NIVEL:''           , 
    CUPO:''               ,
    DESCRIPCION :''           
  }
    
  buscarCurso(ID_CURSO: any){
    console.log('llegue ',ID_CURSO)

    this.oraclesSevice.buscarCurso(ID_CURSO).subscribe((data) => {
      console.log('data 1',data)
      this.cursoObtenida=data[0]
      console.log(data)
      this.cursodos.ID_CURSO=this.cursoObtenida[0]
      this.cursodos.ID_COLEGIO=this.cursoObtenida[1]
      this.cursodos.ID_NIVEL=this.cursoObtenida[2]
      this.cursodos.CUPO=this.cursoObtenida[3]
      this.cursodos.DESCRIPCION=this.cursoObtenida[4]      
      console.log(this.cursodos)
      this.agregarApoderado=false;
      this.agregarCurso=false;
      this.agregarMatricula=false;
      this.listarApoderado = false;
      this.listarCurso = false;
      this.listarMatricula = false;
      this.searchPerso=false;
      this.searchCurso=true;
      this.searchMatricula=false;
      
      this.curso.setValue(this.cursodos)
      this.listarCursos()
    });
  }
  
  //Funciones para buscar rut
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




  //Listar
  listarPersona(){
    const bb = async ()=>{
      this.listaPersonasFilter = this.personas.filter(persona => persona[13]=='APODERADO');
      console.log(this.listaPersonasFilter)
      
    }
    this.oraclesSevice.listarPersonas3().subscribe((data: any[]) => {
      this.personas=data
      console.log(this.personas)
      bb();
    });
  }


  listarCursoCompleto() {
    this.oraclesSevice.getDataCursoCompleto().subscribe((data: any[]) => {
      this.cursos_completos = data
      console.log(this.cursos_completos)

    });
  }

  listarColegios(){
    this.oraclesSevice.listarColegios().subscribe((data: any[]) => {
      this.colegios=data
      console.log(this.colegios)
    });
  }

  listarMatriculas(){
    this.oraclesSevice.listarMatriculas().subscribe((data: any[]) => {
      this.matriculas=data
      console.log(this.matriculas)
    });
  }

  listarCredenciales(){
    this.oraclesSevice.listarCredenciales().subscribe((data: any[]) => {
      this.credenciales=data
      console.log(this.credenciales)
    });
  }

  listarCursos(){
    this.oraclesSevice.listarCursos().subscribe((data: any[]) => {
      this.cursos=data
      console.log(this.cursos)
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
  
  listarNivel(){
    this.oraclesSevice.getDataNivel().subscribe((data: any[]) => {
      this.niveles=data
      console.log(this.niveles)
      
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


  //Funciones adicionales
  async tostadaConfirmAdd(position: 'top') {
    const toast = await this.toastController.create({
      message: 'El usuario ha sido agregado con exito!',
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

 async presentAlertBorrarCur(id_curso:any) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Alerta!',
      subHeader: 'Estas seguro/a que deseas eliminar este curso',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.eliminarCurso(id_curso);
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


  onImprimir(){
    console.log(this.listaPersonasFilter)
    const encabezado = ["RUT", "NOMBRE", "APELLIDO", "PROFESIÓN"]
    const listaPDFCuerpo:any[]=[]
    this.listaPersonasFilter.forEach(x=> {
      listaPDFCuerpo.push([x[0],x[1],x[3],x[15]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de apoderados", true);
  }

  onImprimirCurso(){
    console.log(this.cursos)
    const encabezado = ["CURSO", "CUPO"]
    const listaPDFCuerpo:any[]=[]
    this.cursos.forEach(x=> {
      listaPDFCuerpo.push([x[4]+' '+x[2],x[3]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de cursos", true);
  }

  onImprimirMatricula(){
    console.log(this.matriculas)
    const encabezado = ["RUT APODERADO", "RUT ALUMNO", "COLEGIO","CURSO","CONTACTO DE EMERGENCIA"]
    const listaPDFCuerpo:any[]=[]
    this.matriculas.forEach(x=> {
      listaPDFCuerpo.push([x[2],x[3],x[4],x[5],x[6]])
    })
    const cuerpo = listaPDFCuerpo
    this.serviceImpresion.imprimir(encabezado, cuerpo, "Listado de matriculas", true);
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
  handleChangeApoderado(e:any) {
    console.log('bandera apoderado')
    console.log(e.detail.value);
    console.log(this.listaPersonasFilter);
    console.log(this.personas);
    let persona_alumno=this.personas.filter(x=>x[13] =='ALUMNO')
    console.log(persona_alumno)
    this.listaAlumnosFiltrados=persona_alumno.filter(x=>x[17]==e.detail.value)
    console.log(this.listaAlumnosFiltrados)
  }


  anadirMatricula() {
    
    console.log(this.matricula.value);
    const personaMat = this.matricula.value;
    console.log()
    
    const aa=()=>{
      this.listarMatriculas();
      this.listarCursoCompleto();
      this.matricula.reset();
      let msg='Matricula agregada con éxito!'      
      this.tostadaUniversal(msg,'top')
      
      
    };
  
    
    const bb=()=>{  const response = this.oraclesSevice.agregarMatricula(personaMat).subscribe(
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


  eliminarMatricula(id_matricula: any) {
    this.oraclesSevice.eliminarMatricula(id_matricula)
    .subscribe(resultado => {
      console.log(resultado);
      
      this.matricula.reset();
      this.listarMatriculas();
      this.listarCursoCompleto();
      this.listarPersona();
      let msg='Matrícula eliminada con éxito!'
      this.tostadaUniversal(msg,'top')
    }, error => console.error(error));
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
        this.agregarApoderado=false;
      this.agregarCurso=false;
      this.agregarMatricula=false;
      this.listarApoderado = false;
      this.listarCurso = false;
      this.listarMatricula = false;
      this.searchPerso=false;
      this.searchCurso=false;
      this.searchMatricula=true;
        this.matricula.patchValue(this.matriculaDatos);
        console.log(this.matricula.value)

      });
    }

    actualizarMatricula(){
      this.oraclesSevice.actualizarMatricula(this.matricula.value).subscribe(
        response => {
          
          console.log('Matricula actualizada:', response);
          this.listarMatriculas();
          this.listarCursoCompleto();
          this.matricula.reset();
          let msg='Matrícula actualizada con éxito';
          this.tostadaUniversal(msg,'top')
        },
        error => {
          console.error('Error al actualizar Matricula:', error);
        }
      );
    }

    

  compareTiposPersonaFn(valueexterno: any, valueinterno: any) {
    return valueexterno==valueinterno;

  }

  async presentAlertBorrarMat(id_matricula:any) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Alerta!',
      subHeader: 'Estas seguro/a que deseas eliminar esta matrícula',
      buttons: [
        {
          text: 'Borrar',
          handler: () => {
            this.eliminarMatricula(id_matricula);
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

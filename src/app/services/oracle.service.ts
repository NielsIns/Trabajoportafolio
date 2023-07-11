import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

interface LoginResponse {
  success: boolean;
  rut?: any;

}


@Injectable({
  providedIn: 'root'
})
export class OracleService {
  personas: any[] = [];
  
  
  constructor(private http: HttpClient, private router:Router) { }
  isAuthenticated = new BehaviorSubject (false);
  
/*---------MABEL CREO QUE ES EL BLOB-------*/
  upload(persona: any): Observable<any> {

    const boundary = uuidv4();
    //const boundary: any = Math.random().toString().substring(2);
    const httpOptions = {
      headers: new HttpHeaders({
       // 'Content-Type': 'multipart/form-data'
        'Content-Type': `multipart/form-data`
      })
      
    };
    console.log('hola')
    console.log(persona)
    return this.http.post('http://localhost:4201/upload', persona);
  }

  /*---------METODOS PARA AGREGAR-------*/
  agregarPersona(persona: any/*, archivo: File*/): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('hola')
    console.log(persona)
    return this.http.post('http://localhost:4201/personasAdd', persona, httpOptions);
  }

  agregarCredencial(credencial: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('hola')
    console.log(credencial)
    return this.http.post('http://localhost:4201/credencialesAdd', credencial, httpOptions);
  }
  
  agregarColegio(colegio: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('hola')
    console.log(colegio)
    return this.http.post('http://localhost:4201/colegiosAdd', colegio, httpOptions);
  }

  agregarCurso(curso: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(curso)
    return this.http.post('http://localhost:4201/cursosAdd', curso, httpOptions);
  }

  agregarMatricula(matricula: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(matricula)
    return this.http.post('http://localhost:4201/matriculasAdd', matricula, httpOptions);
  }

  agregarCupo(){

  }


  /*---------METODOS PARA OBTENER-------*/
  getDataPerso(): Observable<any> {
    return this.http.get('http://localhost:4201/personasList');
  }

  getDataPerfil(): Observable<any> {
    return this.http.get('http://localhost:4201/perfil');
  }

  getDataGenero(): Observable<any> {
    return this.http.get('http://localhost:4201/genero');
  }

  getDataNivel(): Observable<any> {
    return this.http.get('http://localhost:4201/nivel');
  }

  getDataComuna(): Observable<any> {
    return this.http.get('http://localhost:4201/comuna');
  }

  getDataTipoPersona(): Observable<any> {
    return this.http.get('http://localhost:4201/tipoPersona');
  }

  getDataPatologia(): Observable<any> {
    return this.http.get('http://localhost:4201/patologia');
  }

  getDataProfesion(): Observable<any> {
    return this.http.get('http://localhost:4201/profesion');
  }

  getDataCargo(): Observable<any> {
    return this.http.get('http://localhost:4201/cargo');
  }

  getDataCursoCompleto(): Observable<any> {
    return this.http.get('http://localhost:4201/cursoCompletoList');
  }

  getDataMatriculaRut(RUT: any): Observable<any> {
    const url = `http://localhost:4201/obtenerMatriculaRut/${RUT}`;
    return this.http.get(url);
  }

  buscarPersona(RUT: string): Observable<any> {
    const url = `http://localhost:4201/personasBuscar/${RUT}`;
    return this.http.get(url);
  }

  buscarCredencial(RUT: string): Observable<any> {
    console.log('hola1');
    const url = `http://localhost:4201/credencialesBuscar/${RUT}`;
    return this.http.get(url);
  }

  buscarCurso(ID_CURSO: any): Observable<any> {    
    const url = `http://localhost:4201/cursosBuscar/${ID_CURSO}`;
    return this.http.get(url);
  }

  buscarCursoPersona(rut: any): Observable<any> {    
    const url = `http://localhost:4201/obtenerCursoPersona/${rut}`;
    return this.http.get(url);
  }

  buscarColegio(ID_COLEGIO: any, NOM_COLEGIO: any): Observable<any> {  
    console.log('entro a buscar colegio')  
    const url = `http://localhost:4201/colegiosBuscar/${ID_COLEGIO}/${NOM_COLEGIO}`;
    return this.http.get(url);
  }

  buscarRutAlumno(rut: any): Observable<any> {  
    console.log('entro a buscar rut alumno')  
    const url = `http://localhost:4201/rutAlumnoBuscar/${rut}`;
    return this.http.get(url);
  }

  buscarMatricula(ID_MATRICULA: any): Observable<any> {  
    console.log('entro a buscar MATRICULA')  
    const url = `http://localhost:4201/matriculasBuscar/${ID_MATRICULA}`;
    return this.http.get(url);
  }

  obtenerCuposCurso(ID_COLEGIO: any): Observable<any> {  
    console.log('entro a buscar MATRICULA')  
    const url = `http://localhost:4201/obtenerCursoCupos/${ID_COLEGIO}`;
    return this.http.get(url);
  }

  


  private url = 'http://localhost:8100/home/administrador';

/*---------METODOS PARA LISTAR-------*/

  listarPersonas3(): Observable<any> {
   return this.http.get('http://localhost:4201/personasList')
    
  }

  listarCredenciales(): Observable<any> {
   return this.http.get('http://localhost:4201/credencialList')  
  }

  listarCursos(): Observable<any> {
   return this.http.get('http://localhost:4201/cursoList')  
  }

  listarColegios(): Observable<any> {
   return this.http.get('http://localhost:4201/colegiosList')
  
  }

  listarPerfil(): Observable<any> {
    const url = `http://localhost:4201/buscarPerfil`;
    return this.http.get(url);
  }


  listarMatriculas(): Observable<any> {
    const url = `http://localhost:4201/matriculasList`;
    return this.http.get(url);
  }

  /*---------METODOS PARA ELIMINAR-------*/
  eliminarPersona2(rut: string): Observable<any> {
    const url = `http://localhost:4201/personasEliminar/${rut}`;
    return this.http.delete(url);
  }

  eliminarPersonaMatricula(rut: string): Observable<any> {
    const url = `http://localhost:4201/personasMatriculasEliminar/${rut}`;
    return this.http.delete(url);
  }

  eliminarCredencial(rut: string): Observable<any> {
    const url = `http://localhost:4201/credencialesEliminar/${rut}`;
    return this.http.delete(url);
  }
  
  eliminarCurso(id_curso: Number): Observable<any> {
    console.log('delete llega a curso') 
    const url = `http://localhost:4201/cursosEliminar/${id_curso}`;
    return this.http.delete(url);
  }

  eliminarMatricula(id_matricula: Number): Observable<any> {
    const url = `http://localhost:4201/matriculasEliminar/${id_matricula}`;
    return this.http.delete(url);
  }

  eliminarColegio(id_colegio: Number): Observable<any> {
    console.log(id_colegio)
    const url = `http://localhost:4201/colegiosEliminar/${id_colegio}`;
    console.log(url)
    return this.http.delete(url);
  }

  eliminarMatriculaPersona(rut: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    

    
    return this.http.delete(`http://localhost:4201/eliminarMatriculaRutAlumno/${rut}`, httpOptions);
  }

  eliminarColegio2(id_colegio: any): Observable<any> {
    
    

    let url=`http://localhost:4201/colegiosEliminar/${id_colegio}`
    console.log('llegue colegio')
    console.log(url)
    return this.http.delete(url);
  }
  
 

  eliminarCuposPersona(id_curso: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(id_curso,'llegue')
    return this.http.post(`http://localhost:4201/actualizarCupos/${id_curso}`, null, httpOptions);
  }




  /*---------METODOS PARA ACTUALIZAR-------*/
  actualizarPersona(persona: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('funciona actualizar')
    console.log(persona)
    return this.http.post('http://localhost:4201/actualizarPersona', persona, httpOptions);
  }
  
  actualizarCredencial(credencial: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('funciona actualizar cred')
    console.log(credencial)
    return this.http.post('http://localhost:4201/actualizarCredencial', credencial, httpOptions);
  }

  actualizarCurso(curso: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('funciona actualizar curso')
    console.log(curso)
    return this.http.post('http://localhost:4201/actualizarCurso', curso, httpOptions);
  }


  actualizarColegio(colegio: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('funciona actualizar curso')
    console.log(colegio)
    return this.http.post('http://localhost:4201/actualizarColegio', colegio, httpOptions);
  }


  actualizarMatricula(matricula: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log('funciona actualizar curso')
    console.log(matricula)
    return this.http.post('http://localhost:4201/actualizarMatricula', matricula, httpOptions);
  }

  /*---------METODOS PARA OBTENER LA AUTENTIFICACIÓN-------*/
  getAuth() {
    console.log('getAuth(): ', this.isAuthenticated.value);
    return this.isAuthenticated.value;
  }

  setAuth (value: boolean) {
    this.isAuthenticated.next(value);
    console.log(this.isAuthenticated.value)
    console.log(this.isAuthenticated)
    this.getAuth()
    console.log(this.isAuthenticated.value)
  }

  isAuthenticated$() {
    return this.isAuthenticated.asObservable();
  }

  validarUser (){
    console.log(this.isAuthenticated.value)
    this.isAuthenticated.next(true);
    console.log(this.isAuthenticated.value)

  }

  /*---------METODOS PARA DESLOGUEARSE-------*/
  logout(){
    this.isAuthenticated.next(false);

    this.router.navigate(['/login']);
  }


  login(username: any, password: any): Observable<any> {

    console.log(username, password)
    const url = 'http://localhost:4201/login';

    return this.http.post<LoginResponse>(url, { username, password });
  }

}


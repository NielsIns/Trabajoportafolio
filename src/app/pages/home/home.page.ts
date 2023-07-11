import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OracleService } from 'src/app/services/oracle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private oracleService: OracleService) { }

  usuario:any;

  ngOnInit() {

    this.usuario = history.state.persona;
    console.log(this.usuario)
    // handle the case where persona is null or undefined
  }


  logout(){
    const aa= async() =>{
      this.oracleService.getAuth();
    }

    const bb = async()=>{
      this.oracleService.logout();
      aa();
    }
    bb();
  }

}

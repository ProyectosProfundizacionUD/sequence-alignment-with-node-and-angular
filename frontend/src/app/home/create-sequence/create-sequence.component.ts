import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';

@Component({
  selector: 'app-create-sequence',
  templateUrl: './create-sequence.component.html',
  styleUrls: ['./create-sequence.component.css'],
})
export class CreateSequenceComponent implements OnInit {
  registerSequence: any;
  isChargingFile: Boolean = false;

  selectedFile: any;
  sequenceImg: any = '';

  constructor(
    private _sequence: SequenceService,
    private _router: Router,
    //private _utilitiesServices:UtilitiesService,
    private _sanitizer: DomSanitizer
  ) {
    this.registerSequence = {};
    this.selectedFile = '';
  }

  ngOnInit(): void {}

  createSequenceAsync() {}
  /*
  createBoard(){
    if(!this.registerBoard.name || !this.registerBoard.description){
      //this._utilitiesServices.openSnackBarError('Fallo el proceso: Datos icompletos')
      this.registerBoard = {};
    }else{
      const data = new FormData();
      if(this.selectedFile !=null){
        data.append('image', this.selectedFile, this.selectedFile.name);
      }
      data.append('name', this.registerBoard.name)
      data.append('description', this.registerBoard.description)


      this._sequence.CreateSequence(data).subscribe(
        (res)=>{
          this._router.navigate(['/listBoard']);
          //this._utilitiesServices.openSnackBarSuccesfull('Secuencia registrada con exito!');
          this.registerBoard = {};
        }
      )
    }
  }

*/
  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.sequenceImg = this._sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(this.selectedFile)
    );
  }
  uploadFasta(event: any){

  }
}

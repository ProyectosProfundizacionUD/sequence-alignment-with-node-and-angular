import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-align-sequence',
  templateUrl: './align-sequence.component.html',
  styleUrls: ['./align-sequence.component.css']
})
export class AlignSequenceComponent implements OnInit {
  panelOpenState = false;
  isChargingFile: Boolean = true;
  sequences: any = [];
  selectAlignment: String = "default";
  showLocalWithBase: Boolean = false;

  registerSequence: any;
  
  selectedFile: any;
  sequenceImg: any = '';

  constructor(
    private _sequence: SequenceService,
    private _router: Router,
    private _utilitiesServices: UtilsService,
    private _sanitizer: DomSanitizer
  ) {
    this.registerSequence = {};
    this.selectedFile = '';
  }

  ngOnInit(): void {
    this._sequence.listSequence().subscribe(
      (res) => {
        this.sequences = res;
        console.log(res);        
      },
      (err) => {
        console.log(err);        
      }
    );    
  }

  startAlignment(){

  }

  selectAlignmentType(type: String){
    this.selectAlignment = type;
    console.log(this.selectAlignment);
    
    if(this.selectAlignment == "LocalWithBase"){
      this.showLocalWithBase = true
    } else {
      this.showLocalWithBase = false
    }
      
  }



  async uploadFasta(event: any) {
    let fasta = <File>event.target.files[0];
    this.registerSequence.sequence = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsText(fasta);
    });

    this.registerSequence.organism = this.registerSequence.sequence
      .split('\n')[0]
      .split('|')[4]
      .split(',')[0];

    console.log(this.registerSequence.sequence);
  }
}

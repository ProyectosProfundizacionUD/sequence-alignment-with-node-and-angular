import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlignService } from 'src/app/services/align.service';
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
  resultSequences: any = [];
  originSequenceToPrint: any = [];
  selectAlignment: String = "default";
  showLocalWithBase: Boolean = false;
  showResults: boolean = false;


  sequenceFasta: any = {};
  sequenceToAlign: any;


  
  selectedFile: any;
  sequenceImg: any = '';

  constructor(
    private _sequence: SequenceService,
    private _align: AlignService,
    private _utilitiesServices: UtilsService,
  ) {
    this.sequenceToAlign = {};
    this.selectedFile = '';
  }

  ngOnInit(): void {
    this._sequence.listSequence().subscribe(
      (res) => {
        this.sequences = res;
      },
      (err) => {
        console.log(err);
      }
    );    
  }

  startAlignment(){
    this._align.align(this.sequenceToAlign).subscribe(
      (res) => {        
        this.originSequenceToPrint = res.sequence.split("");
        this.dataToArray(res.results);        
        this.showResults = true;
      },
      (err) => {
        console.log(err);        
      }
    );
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

  dataToArray(data: any){
    for (let i = 0; i < data.length; i++) {
      data[i].sequence = data[i].sequence.split("");
      data[i].alignment = data[i].alignment.split("");
    }    
    this.resultSequences = data;
  }

  async uploadFasta(event: any) {
    let fasta = <File>event.target.files[0];
    this.sequenceFasta = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsText(fasta);
    });

    this.sequenceToAlign.sequence = this.sequenceFasta
      .split("\n")[1].substring(0, 60)

    this.sequenceToAlign.organism = this.sequenceFasta
      .split('\n')[0]
      .split('|')[4]
      .split(',')[0];

    console.log(this.sequenceToAlign.sequence);
  }
}

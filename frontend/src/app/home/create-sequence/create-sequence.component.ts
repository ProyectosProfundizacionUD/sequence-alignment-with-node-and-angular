import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-sequence',
  templateUrl: './create-sequence.component.html',
  styleUrls: ['./create-sequence.component.css'],
})
export class CreateSequenceComponent implements OnInit {
  registerSequence: any;
  isChargingFile: Boolean = true;

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

  ngOnInit(): void {}

  async createSequenceAsync() {
    if (
      !this.registerSequence.sequence ||
      !this.registerSequence.description ||
      this.selectedFile == null ||
      !this.selectedFile
    ) {
      this._utilitiesServices.openSnackBarError(
        'Fallo el proceso: Datos incompletos'
      );
      this.registerSequence = {};
    } else {
      
      const img = new FormData();
      img.append('image', this.selectedFile, this.selectedFile.name);

      this._utilitiesServices.CreateImage(img).subscribe((resImg) => {
        this.registerSequence.imgUrl = resImg.data.url;

        this._sequence.CreateSequence(this.registerSequence).subscribe(
          (res) => {
            this._router.navigate(['/list-sequences']);
            this._utilitiesServices.openSnackBarSuccesfull(
              'Secuencia registrada con exito!'
            );
            this.registerSequence = {};
          },
          (err) =>
            this._utilitiesServices.openSnackBarError(
              err.error
            )
        );
      });
    }
  }

  uploadImg(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.sequenceImg = this._sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(this.selectedFile)
    );
  }

  sendImage() {
    const data = new FormData();
    data.append('image', this.selectedFile, this.selectedFile.name);
    return ;
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
    .split(',')[0]
    .slice(1, this.registerSequence.sequence
      .split('\n')[0]
      .split('|')[4]
      .split(',')[0].length
      );

    console.log(this.registerSequence.sequence);
  }
}

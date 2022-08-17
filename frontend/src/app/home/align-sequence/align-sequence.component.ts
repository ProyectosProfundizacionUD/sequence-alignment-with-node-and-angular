import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlignService } from 'src/app/services/align.service';
import { SequenceService } from 'src/app/services/sequence.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-align-sequence',
  templateUrl: './align-sequence.component.html',
  styleUrls: ['./align-sequence.component.css'],
})
export class AlignSequenceComponent implements OnInit {
  panelOpenState = false;
  isChargingFile: Boolean = true;
  sequences: any = [];
  identifier: String = '';
  resultSequences: any = [];
  originSequenceToPrint: any = [];
  selectAlignment: String = 'default';
  showLocalWithBase: Boolean = false;
  showLocal: Boolean = false;
  showResults: boolean = false;
  showResultsNeedleman: boolean = false;
  showOptionsNeedleman: boolean = false;
  resultsNeedleman: any = {};
  showResultsDotplot: boolean = false;
  resultsDotPlot: any = {};
  entryHeaders: any = {};
  sequenceToAlign: any;
  sequenceFasta: any = {};
  regularExpression = /^[GCTAN]{1,60}$/i;
  selectedFile: any;
  sequenceImg: any = '';

  constructor(
    private _sequence: SequenceService,
    private _align: AlignService,
    private _utilitiesServices: UtilsService
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
        this._utilitiesServices.openSnackBarError(err.error);
      }
    );
  }

  async startAlignment() {
    if (!this.sequenceToAlign.sequence || this.selectAlignment == 'default') {
      this._utilitiesServices.openSnackBarError(
        'Debes ingresar una secuencia y seleccionar una opción!'
      );
    } else {
      if (!/^[GCTAMN]{1,60}$/i.test(this.sequenceToAlign.sequence)) {
        this._utilitiesServices.openSnackBarError(
          'Los unicos caracteres validos son ACGTMN con una longitud maxima de 60 nucleotidos!'
        );
      } else {
        if (this.selectAlignment == 'GlobalWithBase') {
          this.clear();
          this._align.align(this.sequenceToAlign).subscribe(
            (res) => {
              this.showResultsNeedleman = false;
              this.showResultsDotplot = false;
              this.originSequenceToPrint = res.sequence.split('');
              this.dataToArray(res.results);
              this.showResults = true;
            },
            (err) => {
              this._utilitiesServices.openSnackBarError(err.error);
            }
          );
        } else if (this.selectAlignment == 'LocalWithBase') {
          if (this.localRangeValidations()) {
            this.clear();
            await this._align
              .localAlign(this.sequenceToAlign, this.entryHeaders)
              .then((res) => {
                console.log(res);
                this.showResultsNeedleman = false;
                this.showResultsDotplot = false;
                this.originSequenceToPrint = res.sequence.split('');
                this.dataToArray(res.results);
                this.showResults = true;
              })
              .catch((err) => {
                this._utilitiesServices.openSnackBarError(
                  'Ha ocurrido un error al alinear las secuencias'
                );
              });
          }
        }
      }
    }
  }
  async startAlignmentWithOneSequence() {
    if (
      !this.sequenceToAlign.sequence ||
      this.selectAlignment == 'default' ||
      !this.identifier
    ) {
      this._utilitiesServices.openSnackBarError(
        'Debes ingresar una secuencia, seleccionar un organismo a comparar y escoger una opción!'
      );
    } else {
      if (!/^[GCTAMN]{1,60}$/i.test(this.sequenceToAlign.sequence)) {
        this._utilitiesServices.openSnackBarError(
          'Los unicos caracteres validos son ACGTMN con una longitud maxima de 60 nucleotidos!'
        );
      } else {
        this.clear();
        switch (this.selectAlignment) {
          case 'Global':
            this._align
              .alignWitOneSequence(this.sequenceToAlign, this.identifier)
              .subscribe(
                (res) => {
                  this.showResultsNeedleman = false;
                  this.showResultsDotplot = false;
                  this.originSequenceToPrint = res.sequence.split('');
                  this.dataToArray(res.results);
                  this.showResults = true;
                },
                (err) => {
                  this._utilitiesServices.openSnackBarError(err.error);
                }
              );
            break;
          case 'Local':
            if (this.localRangeValidations()) {
              await this._align
                .localAlignWitOneSequence(
                  this.sequenceToAlign,
                  this.entryHeaders,
                  this.identifier
                )
                .then((res) => {
                  console.log(res);
                  this.showResultsNeedleman = false;
                  this.showResultsDotplot = false;
                  this.originSequenceToPrint = res.sequence.split('');
                  this.dataToArray(res.results);
                  this.showResults = true;
                })
                .catch((err) => {
                  this._utilitiesServices.openSnackBarError(
                    'Ha ocurrido un error al alinear las secuencias'
                  );
                });
            }
            break;
          case 'DotPlot':
            this.showResults = false;
            this.showResultsNeedleman = false;
            if(
              this.entryHeaders.x1 == undefined ||
              this.entryHeaders.x2 == undefined ||
              this.entryHeaders.y1 == undefined ||
              this.entryHeaders.y2 == undefined
              ){
                //global
                this._align.DotPlot(this.sequenceToAlign, this.identifier).subscribe(
                  (res) =>{
                    this._utilitiesServices.openSnackBarSuccesfull("El alineamiento se ha realizado de forma global")
                    this.resultsDotPlot = res;
                    this.showResultsDotplot = true;
                  },
                  (err) =>{
                    this._utilitiesServices.openSnackBarError("Ha ocurrido un error al realizar el dotplot")
                  }
                )
              } else {
                //local
                if (this.localRangeValidations()) {
                  await this._align
                    .DotPlotLocal(
                      this.sequenceToAlign,
                      this.entryHeaders,
                      this.identifier
                    )
                    .then((res) => {
                      this._utilitiesServices.openSnackBarSuccesfull("El alineamiento se ha realizado de forma local")
                      this.resultsDotPlot = res;
                      this.showResultsDotplot = true;
                    })
                    .catch((err) => {
                      this._utilitiesServices.openSnackBarError(
                        'Ha ocurrido un error al alinear las secuencias'
                      );
                    });
                }
              }
            break;
          case 'NeedlemanAndWunsch':
            if(this.needlemanValidations()){
              this._align.alignWithNeedlemanAndWunsch(this.sequenceToAlign, this.identifier).subscribe(
                (res) => {
                  console.log(res);
                  this.showResults = false;
                  this.resultsNeedleman = res;
                  this.showResultsNeedleman = true;
                  this.showResultsDotplot = false;
                },
                (err) => {
                  this._utilitiesServices.openSnackBarError(
                    'Ha ocurrido un error al alinear las secuencias a través del algoritmo de needleman and wunsch'
                  );
                }
              );
            } else {
              this._utilitiesServices.openSnackBarError(
                'Debes rellenar todos los campos correctamente antes de empezar'
              );
            }
            break;
          default:
            this._utilitiesServices.openSnackBarError(
              'No ha seleccionado una opción correcta'
            );
            break;
        }
      }
    }
  }

  selectAlignmentType(type: String) {
    this.selectAlignment = type;
    console.log(this.selectAlignment);

    if (this.selectAlignment == 'LocalWithBase') {
      this.showLocalWithBase = true;
      this.showOptionsNeedleman = false;
    } else if (this.selectAlignment == 'Local') {
      this.showLocal = true;
      this.showOptionsNeedleman = false;
    } else if (this.selectAlignment == 'NeedlemanAndWunsch') {
      this.showLocal = false;
      this.showLocalWithBase = false;
      this.showOptionsNeedleman = true;
    } else if (this.selectAlignment == 'DotPlot') {
      this.showLocal = true;
      this.showLocalWithBase = false;
      this.showOptionsNeedleman = false;
    } else {
      this.showLocal = false;
      this.showLocalWithBase = false;
      this.showOptionsNeedleman = false;
    }
  }

  dataToArray(data: any) {
    for (let i = 0; i < data.length; i++) {
      data[i].sequence = data[i].sequence.split('');
      data[i].alignment = data[i].alignment.split('');
    }
    this.resultSequences = data;
  }

  clear() {
    this.showResults = false;
    this.originSequenceToPrint = [];
    this.resultSequences = [];
  }
  needlemanValidations(){
    if(
      !this.sequenceToAlign.coincidence ||
      this.sequenceToAlign.coincidence === "" ||
      !this.sequenceToAlign.difference ||
      this.sequenceToAlign.difference === "" ||
      !this.sequenceToAlign.gaps ||
      this.sequenceToAlign.gaps  === ""
    ){
      this._utilitiesServices.openSnackBarError("Debes ingresar todos los campos correctamente");
      return false;
    }
    return true;
  }

  localRangeValidations() {
    if (
      this.entryHeaders.x1 == undefined ||
      this.entryHeaders.x2 == undefined ||
      this.entryHeaders.y1 == undefined ||
      this.entryHeaders.y2 == undefined
    ) {
      this._utilitiesServices.openSnackBarError(
        'Debes ingresar todos los rangos!'
      );
      return false;
    }
    if (
      this.entryHeaders.x1 > 60 ||
      this.entryHeaders.x2 > 60 ||
      this.entryHeaders.y1 > 60 ||
      this.entryHeaders.y2 > 60 ||
      this.entryHeaders.x1 < 0 ||
      this.entryHeaders.x2 < 0 ||
      this.entryHeaders.y1 < 0 ||
      this.entryHeaders.y2 < 0
    ) {
      this._utilitiesServices.openSnackBarError(
        'Los rangos no pueden ser mayores a 60 o menores a 0'
      );
      return false;
    }
    if (
      this.entryHeaders.x1 > this.entryHeaders.x2 ||
      this.entryHeaders.y1 > this.entryHeaders.y2
    ) {
      this._utilitiesServices.openSnackBarError(
        'Los rangos iniciales no pueden ser mayores a los finales'
      );
      return false;
    }

    return true;
  }

  async uploadFasta(event: any) {
    let fasta = <File>event.target.files[0];
    this.sequenceFasta = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsText(fasta);
    });

    this.sequenceToAlign.sequence = this.sequenceFasta
      .split('\n')[1]
      .substring(0, 60);

    this.sequenceToAlign.organism = this.sequenceFasta
      .split('\n')[0]
      .split('|')[4]
      .split(',')[0]
      .slice(
        1,
        this.sequenceFasta.split('\n')[0].split('|')[4].split(',')[0].length
      );
  }
  validatePositions(i: number, j: number){
    let paintTraceBack = false;
    this.resultsNeedleman.traceBackPositions.forEach((pairPosition: number[]) => {
      if(pairPosition[0] == i && pairPosition[1] == j){
        console.log(`${[i,j]} esta dentro de las posiciones`);      
        
        paintTraceBack = true;
      }
    });

    return paintTraceBack;
  }
}

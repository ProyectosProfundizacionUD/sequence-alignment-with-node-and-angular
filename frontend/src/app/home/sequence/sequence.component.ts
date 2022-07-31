import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent implements OnInit {
  sequenceData : any =  {}
  constructor(
    private _activeRoute: ActivatedRoute,
    private _sequenceService: SequenceService,
    private _router: Router,
    private _utilitiesServices: UtilsService
  ) { }

  ngOnInit(): void {
    this._sequenceService.listSequenceByFilter(this._activeRoute.snapshot.params.identifier).subscribe(
      (res) => {
        this.sequenceData = res[0];
      },
      (err) => {
        this._utilitiesServices.openSnackBarError("Ha ocurrido un error al obtener las secuencias");
      }
    );
  }
  
  goBack(){
    this._router.navigate([`list-sequences`])
  }
}

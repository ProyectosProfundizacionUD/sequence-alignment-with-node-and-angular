import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';

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
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._sequenceService.listSequenceByFilter(this._activeRoute.snapshot.params.identifier).subscribe(
      (res) => {
        this.sequenceData = res[0];
      },
      (err) => {
        console.log(err); //! por cambiar!!!
      }
    );
  }
  
  goBack(){
    this._router.navigate([`list-sequences`])
  }
}

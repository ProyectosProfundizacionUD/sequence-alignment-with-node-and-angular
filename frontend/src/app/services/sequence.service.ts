import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {
  private env: String;
  constructor(private _httpClient: HttpClient) { 
    this.env =  environment.apiEndpoint;
  }

  listSequenceByFilter(filter: String){
    return this._httpClient.get<any>(`${ this.env }sequence/${filter}`);
  }
  listSequence(){
    return this._httpClient.get<any>(`${ this.env }sequence`);
  }
}

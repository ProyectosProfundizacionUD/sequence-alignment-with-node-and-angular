import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlignService {
  private env: String;
  constructor(private _httpClient: HttpClient) { 
    this.env =  environment.apiEndpoint;
  }
  
  align(data: any){
    return this._httpClient.post<any>(`${ this.env }align`, data);
  }
}

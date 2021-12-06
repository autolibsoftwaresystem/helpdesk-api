import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public InstitutionName = '';
  public InstitutionLogo = '';
  public ContentPath = '';
  public RemoteAccessURL = '';
  public StrictLogin = false;

  constructor() {
  };

  getBaseURL(): String {
    return environment.apiUrl;
  }

  getHeader(): any {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');


    return headers;
  };

}

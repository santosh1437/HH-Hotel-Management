import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocksService {

  private API_URL = "http://65.21.221.132:7793/";
  constructor(private http: HttpClient) { }

  locks(){
    return this.http.get(this.API_URL + "ttlock/locks");
  }
  lockPasswordList(data:any){
    return this.http.post(this.API_URL + "ttlock/getLockPwdList", data);
  }
  addPasscode(data:any){
    return this.http.post(this.API_URL + "ttlock/add-passcode", data);
  }
  getUnlockRecords(data:any){
    return this.http.post(this.API_URL + "ttlock/getUnlockRecords", data);
  }
  deletePasscode(data:any){
    return this.http.post(this.API_URL + "ttlock/delete-passcode", data);
  }

}

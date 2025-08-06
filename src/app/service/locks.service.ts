import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocksService {

  private API_URL = "https://lockapi.hustlehub.tech/";
  constructor(private http: HttpClient) { }

  upload(data: any) {
    return this.http.post<any>('https://lockapi.hustlehub.tech/v1/' + "upload", data, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: 'progress', message: progress };
            } else {
              // Handle cases where `total` is undefined
              return { status: 'progress', message: 'Unknown progress' };
            }
  
          case HttpEventType.Response:
            return event.body;
  
          default:
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }
  

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
  getProperties(){
    return this.http.get(this.API_URL + "ttlock/getProperties");
  }
  getBookings(){
    return this.http.get(this.API_URL + "ttlock/getBookings");
  }
   getPMSReport(){
    return this.http.get(this.API_URL + "ttlock/getPMSReport");
  }
  saveStaff(data:any){
    return this.http.post(this.API_URL + "ttlock/saveStaff", data);
  }
  getStaff(){
    return this.http.get(this.API_URL + "ttlock/getStaff");
  }
}

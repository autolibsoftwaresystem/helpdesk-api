import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getInstituteDetails() {
    let instituteDetails = this.auth.getInstituteDetails();
    return this.http.post(environment.apiUrl + 'institute/get-institute-details',
      { instituteId: instituteDetails['instituteId'] });
  }

  editInstituteDetails(institute) {
    return this.http.post(environment.apiUrl + '/institute/edit-institute', institute);
  }

  // saveContact(id, instituteId, firstName, lastName, phone, emailId, street1, street2, city, state, country, zipcode) {
  //   const httpHeaders: HttpHeaders = new HttpHeaders();
  //   httpHeaders.append('Authorization', "Bearer " + localStorage.getItem('token'))
  //   let request = {
  //     "id": id, "instituteId": instituteId, "firstName": firstName,
  //     "lastName": lastName, "phone": phone, "emailId": emailId, "street1": street1, "street2": street2, "city": city, "state": state, "country": country, "zipcode": zipcode
  //   };
  //   return this.http.post(environment.apiUrl + 'institute/save-institute-contact',
  //     request, { headers: httpHeaders });
  // }

  deletesContact(id, instituteId, emailId) {

    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Authorization', "Bearer " + localStorage.getItem('token'))
    let request = { "id": id, "instituteId": instituteId, "emailId": emailId };
    return this.http.post(environment.apiUrl + 'institute/delete-institute-contact',
      request, { headers: httpHeaders });
  }

  getContact(id, instituteId, emailId) {
    const httpHeaders: HttpHeaders = new HttpHeaders();
    httpHeaders.append('Authorization', "Bearer " + localStorage.getItem('token'))
    let request = { "instituteId": instituteId };
    return this.http.post(environment.apiUrl + 'institute/get-institute',
      request, { headers: httpHeaders });
  }

  getSaveContact(firstname = "", lastname = "", emailid = "", mobileno = "", address1 = "", address2 = "", city = "", state = "", country = "", pincode = "") {
    let request = {
      ChannelName: "WEB", firstname: firstname, lastname: lastname, emailid: emailid, mobileno: mobileno, address1: address1, address2: address2, city: city, state: state, country: country, pincode: pincode
    }
    console.log(request);
    return this.http.post(environment.apiUrl + 'institute/save-institute-contact', request);
  }

  changePassword(old_password, new_password) {
    let request = { "ChangePasswordReq": { "username": this.auth.getLoginEmailId(), "new_password": new_password, "old_password": old_password } };
    return this.http.post(environment.apiUrl + 'institute/changePassword', request);
  }

  forgetPassword(username) {
    let request = { "SendOTPReq": { "username": username } };
    return this.http.post(environment.apiUrl + 'institute/forgetPassword', request);
  }

  verifyOTP(username, otp) {
    let request = { "CheckOTPReq": { "username": username, "otp": otp } };
    return this.http.post(environment.apiUrl + 'institute/checkOTP', request);
  }

  updatePassword(username, new_password) {
    let request = { "ResetPasswordReq": { "username": username, "new_password": new_password } };
    return this.http.post(environment.apiUrl + 'institute/resetPassword', request);
  }

  saveContact(id, firstName, lastName, phone, emailId, street1, street2, city, state, country, zipcode, isBlocked) {
    let instituteDetails = this.auth.getInstituteDetails();
    let request = {
      "id": id, "instituteId": instituteDetails['instituteId'], "firstName": firstName,"lastName": lastName, 
      "phone": phone, "emailId": emailId, "street1": street1, "street2": street2, "city": city, 
      "state": state, "country": country, "zipcode": zipcode, "isBlocked": isBlocked
    };
    return this.http.post(environment.apiUrl + 'institute/save-institute-contact',
      request);
  }

  getAllContact() {
    let instituteDetails = this.auth.getInstituteDetails();
    console.log(instituteDetails);
    let request = { "instituteId": instituteDetails['instituteId'] };
    return this.http.post(environment.apiUrl + 'institute/get-institute-contacts',
      request);
  }

  deleteContact(id, emailId) {
    let instituteDetails = this.auth.getInstituteDetails();
    let request = { "id": id, "instituteId": instituteDetails['instituteId'], "emailId": emailId };
    return this.http.post(environment.apiUrl + 'institute/delete-institute-contact',
      request);
  }

  getInstituteProducts() {
    let instituteDetails = this.auth.getInstituteDetails();
    console.log(instituteDetails);
    let request = { institute: { "instituteId": instituteDetails['instituteId'] } };
    return this.http.post(environment.apiUrl + 'institute/get-institute-products',
      request);
  }

  getMyBills() {
    let instituteDetails = this.auth.getInstituteDetails();
    let request = { institute: { "instituteId": instituteDetails['instituteId'] } };
    return this.http.post(environment.apiUrl + 'institute/getInstituteAmc',
      request);
  }

}

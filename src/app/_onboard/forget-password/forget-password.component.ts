import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { InstituteService } from 'src/app/_services/institute.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  email_id = '';
  otp = '';
  loading = false;
  submitted = false;
  showReset = 0;
  new_password = '';
  confirm_password = '';

  constructor(private http: HttpClient,private tst :ToastrService,private is : InstituteService) { }

  ngOnInit(): void {
  }

  forgetPassword()
  {
  this.loading = true;
  this.is.forgetPassword(this.email_id).subscribe(res=>{
  this.loading = false;
   console.log(res);
  if (res['StatusCode'] == '00')
  {
  this.tst.success['Send Success..!!'];
  this.showReset = 1;
  }
   else{
   this.tst.error(res['StatusDesc']);
   this.tst.error('Invalid User');
   }
   })
   } 

   checkOTPCode() {
    this.is.verifyOTP(this.email_id, this.otp).subscribe(res => {
      this.loading = true;
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.showReset = 2;
        this.loading = false;
      }

      else if (res['StatusCode'] == '02') {
        Swal.fire('', 'Incorrect OTP', 'warning');
        this.loading = false;
        return false;
      }

      else {
        Swal.fire('', res['StatusDesc'], 'warning');
        this.loading = false;
        return false;
      }

    }, error => {
      console.error(error); this.loading = false;
    })
  }

  updatePassword() {
    this.loading = true;
    this.is.updatePassword(this.email_id, this.new_password).subscribe(res => {
      console.log(res);
      this.loading = false;
      if (res['StatusCode'] == '00') {

        this.tst.success('Password Updated..!!');
        window.location.href = '/login';
      }
      else {
        this.tst.error(res['StatusDesc']);
      }
    })
  }

}

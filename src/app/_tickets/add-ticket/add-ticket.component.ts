import { Component, OnInit } from '@angular/core';
import { AddTicket } from './AddTicket';
import { TicketService } from 'src/app/_services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { InstituteService } from 'src/app/_services/institute.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.css']
})
export class AddTicketComponent implements OnInit {
  constructor(private ts: TicketService, private is: InstituteService, private tst: ToastrService, private route: Router) { }
  ticket: AddTicket = new AddTicket;
  instituteName = "instituteNameinstituteName";
  submitInProgress = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '400',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Summary about the ticket',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };
  InstProducts = [];

  files = [];
  ngOnInit() {
    this.ticket = this.ts.getAddTicketEmptyEntity();
    console.log(this.ticket);
    this.getInstituteProducts();
  }

  changes() {
    console.log(this.ticket);
  }

  clear() {
    window.location.reload();
  }

  getInstituteProducts() {
    this.is.getInstituteProducts().subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        // let InstituteProducts: Array<any> = res['InstituteProducts'];

        // InstituteProducts.forEach(instProducts => {
        //   this.Products.push(instProducts['product']);
        // })

        // if (this.Products.length > 0) {
        //   let _product = this.Products[0];
        //   this.ticket.product = _product.name;
        // }

        this.InstProducts = res['InstituteProducts'];

        if (this.InstProducts.length > 0) {
          let _i_product = this.InstProducts[0];
          this.ticket.product = _i_product.product.name;
          this.ticket.serviceUnder = _i_product.currentServiceUnder;
          console.log(_i_product);
          console.log(this.ticket);
        }
      }
    })
  }

  // loadProducts() {
  //   this.ts.loadProducts().subscribe(res => {
  //     console.log(res);
  //     this.Products = res['productList'];
  //     if (this.Products.length > 0) {
  //       let _product = this.Products[0];
  //       this.ticket.product = _product.name;
  //     }
  //   })
  // }

  AddTicket() {
    console.log(this.ticket);

    if (this.ticket.subject == '') {
      this.tst.info('Subject Cannot be empty');
      return;
    } else if (this.ticket.serviceType == '') {
      this.tst.info('Service Type Cannot be empty');
      return;
    } else if (this.ticket.emailId == '') {
      this.tst.info('Email Id Cannot be empty');
      return;
    }
    this.submitInProgress = true;

    let _ticket = Object.assign({}, this.ticket);
    _ticket.subject = Base64.encode(_ticket.subject);
    _ticket.summary = Base64.encode(_ticket.summary);

    this.ts.AddTicket(_ticket).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        if (this.files.length > 0) {
          this.uploadAttachments(res);
        } else {
          this.submitInProgress = false;
          this.tst.success('Ticket Raised Successfully');
          this.route.navigateByUrl('/ticket/view-ticket/' + res['Ticket']['ticketId']);
        }
      }
    });
  }

  uploadAttachments(res) {
    let successCount = 0; let failedCount = 0;
    this.files.forEach(file => {
      let ticket = res['Ticket']
      // this.ts.AddTicketAttachment(ticket['ticketId'], file).subscribe(rs => {
      //   console.log(rs);
      // });

      this.ts.AddTicketAttachment(ticket.ticketId, file).subscribe(rs => {
        successCount = successCount + 1;
        this.finishAddAttachmentResponse(this.files.length, successCount, failedCount, ticket.ticketId);
      }, error => {
        failedCount = failedCount + 1;
        this.finishAddAttachmentResponse(this.files.length, successCount, failedCount, ticket.ticketId);
      });

    })
  }


  finishAddAttachmentResponse(totalCount, successCount, failedCount, ticketId) {
    let successFailedCount = +successCount + +failedCount;
    console.log(totalCount, successCount, failedCount, totalCount == successFailedCount)
    if (totalCount == successFailedCount) {
      this.submitInProgress = false;
      this.tst.success('Ticket Raised Successfully');
      this.route.navigateByUrl('/ticket/view-ticket/' + ticketId);
    }
  }

  public fileChange(event) {
    this.files = [];
    console.log(event);
    if (event.target && event.target.files) {
      console.log("Inside Event Target");
      const selectedFile: Array<any> = event.target.files;
      console.log(selectedFile.length);
      selectedFile.forEach(file => {
        this.files.push(file);
      })
    }
    console.log(this.files.length, this.files);
  }


  serviceUnderByProduct() {
    console.log(this.ticket.product);

    this.InstProducts.forEach(ip => {
      if (this.ticket.product == ip.product.name) {
        this.ticket.serviceUnder = ip.currentServiceUnder;
      }
    })
  }

}

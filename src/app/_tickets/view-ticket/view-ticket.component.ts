import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Ticket } from '../tickets/Ticket';
import { TicketService } from 'src/app/_services/ticket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {

  constructor(private ts: TicketService, private router: Router, private route: ActivatedRoute, private tst: ToastrService) { }

  ticket: Ticket = new Ticket;
  ticketAttachments: Array<any> = [];
  ticketReplies: Array<any> = [];
  ticketServiceInvoice = null;
  ticketRating = null;

  reply = '';

  @ViewChild('attachment', { static: false })
  attachmentRef: ElementRef;
  attachmentsInProgress = false;
  replyInProgress = false;
  showReply = false;
  closeTicketProgress = false;


  ngOnInit() {
    let ticketId = this.route.snapshot.paramMap.get('id');
    this.ts.getTicketDetails(ticketId).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        let InstituteDetails = this.ts.auth.getInstituteDetails();
        let ticket = res['Ticket'];
        if (InstituteDetails['instituteId'] != ticket['institute']['instituteId']) {
          this.tst.info('Ticket #' + ticket['ticketId'] + ' not belongs to you');
          this.router.navigateByUrl('');
        } else {
          this.ticket = res['Ticket'];
          this.ticketAttachments = res['TicketAttachments'];
          this.ticketReplies = res['TicketReply'];
          this.ticketServiceInvoice = res['TicketServiceInvoice'];
          this.ticketRating = res['TicketRating'];

          this.ticketReplies.sort((a, b) => b.id - a.id);
        }
      }
    });
  }

  fileChange(event) {
    console.log(event);
    if (event.target && event.target.files) {
      console.log("Inside Event Target");
      const selectedFile: Array<any> = event.target.files;
      console.log(selectedFile.length);
      if (selectedFile.length == 0)
        return;
      let successCount = 0; let failedCount = 0;
      this.attachmentsInProgress = true;
      selectedFile.forEach(file => {
        this.ts.AddTicketAttachment(this.ticket.ticketId, file).subscribe(rs => {
          successCount = successCount + 1;
          this.finishAddAttachmentResponse(selectedFile.length, successCount, failedCount);
        }, error => {
          failedCount = failedCount + 1;
          this.finishAddAttachmentResponse(selectedFile.length, successCount, failedCount);
        });
      })
    }
  }

  finishAddAttachmentResponse(totalCount, successCount, failedCount) {
    let successFailedCount = +successCount + +failedCount;
    console.log(totalCount, successCount, failedCount, totalCount == successFailedCount)
    if (totalCount == successFailedCount) {
      this.attachmentsInProgress = false;
      this.attachmentRef.nativeElement.value = '';
      this.tst.info(successCount + ' files  uploaded successfully , ' + failedCount + ' failed.')
      if (successCount > 0)
        this.ngOnInit();
    }
  }

  onButtonClick() {
    console.log('INSIDE');
    document.getElementById('textInput').className = "show";
  }

  downloadTicketAttachmnet(attachment) {
    console.log(attachment);
    window.open(environment.contentPath + attachment['ticket']['ticketId'] + '/' + attachment['fileName'], '_blank');
  }

  downloadTicketServiceInvoice(fileName) {
    console.log(fileName);
    window.open(environment.contentPath + '_service_invoices/' + fileName, '_blank');
  }

  sendReply() {
    if (this.reply == '')
      return;

    console.log(this.reply);
    this.replyInProgress = true;
    this.ts.addTicketReply(this.reply, this.ticket).subscribe(res => {
      console.log(res); this.replyInProgress = false;
      if (res['StatusCode'] == '00') {
        this.ngOnInit();
        this.reply = '';
        this.replyInProgress = false;
        this.showReply = false;
      }
    }, error => { console.log(error); this.replyInProgress = false; })

  }

  closeTicket() {

    Swal.fire({
      title: 'Are you sure?',
      text: "This will make ticket closed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Close it!'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.closeTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Closed the ticket Successfully', '', 'success');
            this.ngOnInit();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })

  }

  reopenTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reopen this ticket",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.reopenTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('ReOpened the ticket Successfully', '', 'success');
            this.ngOnInit();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })

  }

  resultEmitted(event) {
    console.log(event);
    this.ticketRating = null;
    this.ngOnInit();
  }




}

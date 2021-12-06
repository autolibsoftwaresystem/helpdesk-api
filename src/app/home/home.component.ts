import { Component, OnInit } from '@angular/core';
import { InstituteService } from '../_services/institute.service';
import { Ticket } from '../_tickets/tickets/Ticket';
import { TicketService } from '../_services/ticket.service';
import { AuthService } from '../_services/auth.service';



declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private is: InstituteService, private ts: TicketService, private auth: AuthService) { }

  TicketStatus = {
    Raised: 0, ReOpened: 0, Assigned: 0, Rejected: 0, Closed: 0, Hold: 0, Waiting_For_Client_Reply: 0
  }
  statusSelected = 'Raised';
  tickets: Array<Ticket> = [];
  instituteProducts: Array<any> = [];
  instContactDetails: any = {};
  modalTitle:string;
  dialogRef:any;
  Institute: any = {};
  
  ngOnInit() {

    $('.js-tilt').tilt({
      glare: true,
      maxGlare: .5,
      reset: true,
      scale: 1.05,
      easing: "cubic-bezier(.03,.98,.52,.99)",
      perspective: 1000,
      maxTilt: 50
    });

    this.instContactDetails = this.auth.getInstituteContactDetails();

    console.log(this.instContactDetails);
    this.is.getInstituteDetails().subscribe(res => {
      this.Institute = res['Institute'];
    }, error => console.log(error));

    this.subscribeToTickets();
    this.getInstituteProducts();
  }

  getInstituteProducts() {
    this.is.getInstituteProducts().subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.instituteProducts = res['InstituteProducts'];
        console.log(this.instituteProducts);
      }
    })
  }

  subscribeToTickets() {
    this.ts.subscribeToTickets().subscribe(tickets => {
      console.log(tickets);
      this.tickets = new Array();
      this.tickets = tickets;
      this.GetTicketStatusCount();
    });
  }

  getAllInstitutionTickets() {
    this.ts.getAllInstitutionTickets().subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.tickets = res['Tickets'];
        console.log(this.tickets);
        this.tickets.sort((a, b) => b.ticketId - a.ticketId);
        this.GetTicketStatusCount();
      }
    })
  }

  GetTicketStatusCount() {
    this.TicketStatus = {
      Raised: 0, ReOpened: 0, Assigned: 0, Rejected: 0, Closed: 0, Hold: 0, Waiting_For_Client_Reply: 0
    }
    this.tickets.forEach(ticket => {
      this.TicketStatus[ticket.status] = +this.TicketStatus[ticket.status] + 1;
    })
  }

  

 
}

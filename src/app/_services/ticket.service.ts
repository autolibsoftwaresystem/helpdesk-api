import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AddTicket } from '../_tickets/add-ticket/AddTicket';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../_tickets/tickets/Ticket';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  private __tickets$: BehaviorSubject<any> = new BehaviorSubject(new Array());

  subscribeToTickets() {
    console.log("subscribeToTickets");
    this.UpdateInstitutionTickets();
    return this.__tickets$.asObservable();
  }

  UpdateInstitutionTickets() {
    console.log("UpdateInstitutionTickets");
    this.getAllInstitutionTickets().subscribe(res => {
      console.log("res");
      if (res['StatusCode'] == '00') {
        console.log("StatusCode");
        let tickets: Array<any> = res['Tickets'];
        tickets.sort((a, b) => +(new Date(b.lastupdatedatetime)) - +(new Date(a.lastupdatedatetime)));
        this.__tickets$.next(res['Tickets'])
      }
    })
  }

  getAddTicketEmptyEntity(): AddTicket {
    let claims = this.auth.getInstituteDetails();
    let addTicket = new AddTicket;
    addTicket.instituteId = claims['instituteId'];
    addTicket.instituteName = claims['instituteName'];
    addTicket.emailId = this.auth.getLoginEmailId();
    addTicket.priority = "NotPreferred";
    addTicket.serviceUnder = claims['serviceUnder'];
    addTicket.institute = claims;
    addTicket.status = 'Raised';
    return addTicket;
  }

  loadProducts() {
    return this.http.post(environment.apiUrl + '/agent/get-products', {});
  }

  AddTicket(ticket) {
    return this.http.post(environment.apiUrl + 'ticket/add-ticket', ticket);
  }

  AddTicketAttachment(ticketId, file) {
    let form = new FormData();
    form.append('ticketId', ticketId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'ticket/add-ticket-attachment', form);
  }

  getAllInstitutionTickets() {
    let InstituteDetails = this.auth.getInstituteDetails();
    return this.http.post(environment.apiUrl + 'ticket/get-all-institute-tickets', { institute: InstituteDetails });
  }

  getTicketDetails(ticketId) {
    return this.http.post(environment.apiUrl + 'ticket/get-ticket', { ticketId: ticketId });
  }

  addTicketReply(reply, ticket) {
    let request = {
      reply: reply,
      replyBy: this.auth.getLoginEmailId(),
      ticket: ticket
    }
    return this.http.post(environment.apiUrl + 'ticket/add-ticket-reply', request);
  }

  closeTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Closed';
    let request = {
      ticket: _ticket,
      instituteContact: this.auth.getInstituteContactDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  reopenTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'ReOpened';

    console.log(ticket);
    console.log(_ticket);
    let request = {
      ticket: _ticket,
      instituteContact: this.auth.getInstituteContactDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  addRating(rating) {
    return this.http.post(environment.apiUrl + 'ticket/add-ticket-rating', rating);
  }

}

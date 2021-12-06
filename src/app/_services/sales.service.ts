import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  viewPDF(dealId, filename) {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/' + dealId + '/' + filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  loadQuotations(filters) {
    let req = filters;
    return this.http.post(environment.apiUrl + 'sales/get-quotations', req);
  }

  loadDeals(filters): Observable<any> {
    let req = filters;
    return this.http.post(environment.apiUrl + 'deals/get-deals', req);
  }

  getSalesNeededData(needed) {
    let req = { needed: needed }
    return this.http.post(environment.apiUrl + 'sales/get-sales-needed-data', req);
  }


  getDealDetails(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal/' + dealId);
  }

  deleteDeal(dealId) {
    return this.http.get(environment.apiUrl + 'deals/delete-deal/' + dealId);
  }

  

  

  getDealQuotation(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-quotation/' + dealId);
  }

  

  

  getDealSalesOrder(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-sales-order/' + dealId);
  }

  getDealPurchaseOrder(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-purchase-order/' + dealId);
  }

  

  getDealInvoice(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-invoice/' + dealId);
  }

  getQuotationDetails(quoteId) {
    return this.http.get(environment.apiUrl + 'sales/get-quotation/' + quoteId);
  }

  getAllNotes(dealId) {
    let req = { dealId: dealId }
    return this.http.post(environment.apiUrl + 'deals/get-all-notes', req);
  }

  

  generateQuotationPDF(dealQuotation, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      dealQuotation: dealQuotation, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/generate-quotation-pdf', req);
  }

  UploadGeneratedQuotationPDF(dealQuoteId, file) {
    let form = new FormData();
    form.append('dealQuoteId', dealQuoteId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-quotation-pdf', form);
  }

  generateInvoicePDF(dealInvoice, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      dealInvoice: dealInvoice, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/generate-invoice-pdf', req);
  }

  UploadGeneratedInvoicePDF(dealInvoiceId, file) {
    let form = new FormData();
    form.append('dealInvoiceId', dealInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-invoice-pdf', form);
  }

  UploadGeneratedPurchaseOrderPDF(dealPurchaseOrderId, file) {
    let form = new FormData();
    form.append('dealPurchaseOrderId', dealPurchaseOrderId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-purchase-order-pdf', form);
  }

  generateSalesOrderPDF(salesOrder, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      salesOrder: salesOrder, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/generate-sales-order-pdf', req);
  }

  UploadGeneratedSalesOrderPDF(dealSalesOrderId, file) {
    let form = new FormData();
    form.append('dealSalesOrderId', dealSalesOrderId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-sales-order-pdf', form);
  }

  
  getDealPayments(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-payments/' + dealId);
  }

  deleteDealPayments(payment) {
    return this.http.post(environment.apiUrl + 'deals/delete-deal-payment', payment);
  }

  generateReceipt(payment,designation,addFullSeal,addRoundSeal,addSign) {

    let req = {
      payment: payment, designation: designation, addFullSeal: addFullSeal,
      addRoundSeal: addRoundSeal, addSign: addSign,signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/create-deal-payment-receipt', req);
  }

  getAmcPayment(id) {
    console.log(id); 
    return this.http.get(environment.apiUrl + 'deals/get-amc-payments/'+id);
  }

  loadDealQuotationsReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-quotations-report', req);
  }

  loadInvoicesReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-invoices-report/', req);
  }

  loadPaymentsReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-payments-report/', req);
  }

}

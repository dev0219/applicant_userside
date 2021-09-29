import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, timeout} from 'rxjs/operators';
import {ScrollToConfigOptions, ScrollToService} from '@nicky-lenaers/ngx-scroll-to';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "https://apply.insure/api";
// const apiUrl = "/api";
// const apiUrl = "http://localhost:3000/api";


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(public http: HttpClient, private _scrollToService: ScrollToService) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getZillow(data): Observable<any> {
    return this.http.post(apiUrl+'/get_zillow', data, httpOptions)
      .pipe(
        timeout(10000),
        map(this.extractData),
        catchError(this.handleError));
  }

  SendLife(data): Observable<any> {
    return this.http.post(apiUrl+'/send_life', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  sendEmail(data): Observable<any> {
    return this.http.post(apiUrl+'/send_more_email', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  sendLifeEmail(data): Observable<any> {
    return this.http.post(apiUrl+'/send_life_email', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  sendAdvanceLifeEmail(data): Observable<any> {
    return this.http.post(apiUrl+'/send_advance_life_email', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getDataByID(data): Observable<any> {
    return this.http.post(apiUrl+'/getDataByID', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getUserByID(data): Observable<any> {
    return this.http.post(apiUrl+'/getUserByID', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getLinkByID(data): Observable<any> {
    return this.http.post(apiUrl+'/getLinkByID', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  register(data): Observable<any> {
    return this.http.post(apiUrl+'/register', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }


  addGroup(data): Observable<any> {
    return this.http.post(apiUrl+'/add_group', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }


  getGroups(data): Observable<any> {
    return this.http.post(apiUrl+'/get_groups', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  deleteGroup(data): Observable<any> {
    return this.http.post(apiUrl+'/delete_group', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  addLink(data): Observable<any> {
    return this.http.post(apiUrl+'/add_link', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }


  getAllLinks(): Observable<any> {
    return this.http.get(apiUrl+'/get_all_links', httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getAllUsers(): Observable<any> {
    return this.http.get(apiUrl+'/get_all_users', httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  getStatistics(data): Observable<any> {
    return this.http.post(apiUrl+'/get_statistics', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  checkAdmin(): Observable<any> {
    return this.http.get(apiUrl+'/check_admin', httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  deleteUser(data): Observable<any> {
    return this.http.post(apiUrl+'/delete_user', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  deleteLink(data): Observable<any> {
    return this.http.post(apiUrl+'/delete_link', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  sendMessage(data): Observable<any> {
    return this.http.post(apiUrl+'/send_message', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination
    };
    this._scrollToService.scrollTo(config);
  }

  getPlymouth(data): Observable<any> {
    return this.http.post(apiUrl+'/get_plymouth', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }


  getStillWater(data): Observable<any> {
    return this.http.post(apiUrl+'/get_stillwater', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }


  getUniversal(data): Observable<any> {
    return this.http.post(apiUrl+'/get_universal', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }


  getNeptuneFlood(data): Observable<any> {
    return this.http.post(apiUrl+'/get_neptuneflood', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }

  getHavenLife(data): Observable<any> {
    return this.http.post(apiUrl+'/get_havenlife', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }

  getEthoslife(data): Observable<any> {
    return this.http.post(apiUrl+'/get_ethoslife', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }

  getHippo(data): Observable<any> {
    return this.http.post(apiUrl+'/get_hippo', data, httpOptions)
      .pipe(
        timeout(15000),
        map(this.extractData),
        catchError(this.handleError));
  }

  signupRequest(Form,urls): Observable<any> {
    return this.http.post(apiUrl+'/send_signup_request', {data:Form,urls:urls}, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  sendLifeUploadDocEmail(data) {
    return this.http.post(apiUrl+'/send_life_upload_doc_email', data)
    .pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  fileUpload(data) {
    const formData = new FormData();
    formData.append('file', data[0]);
    const BaseUrl = 'https://apply.insure/' 
    return this.http.post(BaseUrl+'fileupload', formData)
    .pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
   
  sendAdvanceLifeUploadDocEmail(data) {
    return this.http.post(apiUrl+'/send_adavace_life_upload_doc_email', data)
    .pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  sendLifeFormEmail(data) {
    return this.http.post(apiUrl+'/send_life_form_email', data)
    .pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  sendEthosLifeMail(data){
    return this.http.post(apiUrl+'/send_ethos_email', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
  
  get_nationwide(data){
    return this.http.post(apiUrl+'/get_nationwide', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  AccurateQuoteMail(data){
    return this.http.post(apiUrl+'/send_accurate_quote_mail', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }

  OthorLineOfBusinessMail(data){
    return this.http.post(apiUrl+'/send_line_of_business_mail', data, httpOptions)
      .pipe(
        map(this.extractData),
        catchError(this.handleError));
  }
}

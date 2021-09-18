import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-advance-quote-upload',
  templateUrl: './advance-quote-upload.component.html',
  styleUrls: ['./advance-quote-upload.component.scss']
})
export class AdvanceQuoteUploadComponent implements OnInit {
 
  public files: any = [];
  @Output() setQuoteUpload: EventEmitter<object> = new EventEmitter<object>();

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    
  }
  quote_upload_submit()
  {
    this.setQuoteUpload.emit(this.files);
  }

  uploadFile(event){ 
    if(event.target.files.length > 0){
      if (event.target.files && event.target.files[0]){
        let ext = ["png","jpg","pdf","jpeg"];
        // validation code.
        if(typeof event.target.files[0].name != "undefined" && event.target.files[0].name != ""){
          for(let i = 0; i < event.target.files.length; i++){
            let selectedext = event.target.files[i].name.split(".")[event.target.files[i].name.split(".").length - 1];
            selectedext = selectedext.toLowerCase();
            if(ext.indexOf(selectedext) == -1){
              this.commonService.modalOpen('Warning', 'Only PDF, JPG, PNG file are acceptable.');
              return;
            }
          }
          this.files = event.target.files;
        }
      }
    }   
  }

  removeFile(key){
    var arr: any = [];
    for(var i = 0; i< this.files.length; i++){
      if(i != key){
        arr.push(this.files[i]);
      }
    }
    this.files = arr;
  }
}

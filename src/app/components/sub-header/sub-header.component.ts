import {Component, Input, OnInit, HostListener} from '@angular/core';
import {CommonService} from "../../services/common.service";
import * as config from "../../config/config";
import { HttpClient } from '@angular/common/http';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  @Input('quote_id') public quote_id: string = '';
  // private imageFolderURL = '../../assets/images/agents/';
  private urlHash = location.href.split('/')[3] || '';
  // private imageExtension = '.png';

  public agentInfo = {};
  public imgsrc = '../../assets/images/agents/dummy.png';
  public menuoption = 0;
  constructor(public commonService: CommonService,private http: HttpClient,private router: Router) {
    this.checkAgent();
  }

  ngOnInit() {
  }

  checkAgent(){
    const Baseapi = "https://apply.insure/all";
    let currentAgent = (this.router.url.split('/')[1] != "f" && this.router.url.split('/')[1] != "life") ? this.router.url.split('/')[1] : this.router.url.split('/')[2];
    let cagent = currentAgent.split("?");
    if(cagent.length > 1){
      let agnt = cagent[0].toString();
      currentAgent = agnt;
    }
    this.http.get(Baseapi)
    .subscribe(
        data => {
            let csvToRowArray = data;
            let temp = 0;
            console.log(data)
            for (const [key, row] of Object.entries(csvToRowArray)) {              
              if(row['link'].toString().trim() == currentAgent){
                temp = 1;
                let userArr = [];
                userArr['email'] = row['email'];
                userArr['name'] = row['firstname'] + ' ' + row['lastname'];
                userArr['logo'] = row['introimage'];
                userArr['phone'] = row['phone'];               
                if( row['propertyimage']!= undefined || row['propertyimage']!= ''){
                  userArr['favicon'] = row['propertyimage'];
                }else{
                  userArr['favicon'] = '';
                }
                if(row['introimage'] != '' || row['introimage']!= undefined){
                  userArr['sitelogo'] = row['introimage'];
                }else{
                  userArr['sitelogo'] = '';
                }
                if(row['agentimage'] != ''|| row['agentimage']!= undefined){
                  userArr['agent_image'] = row['agentimage'];
                }else{
                  userArr['agent_image'] = '';
                }
                let arr = [];
                arr[row['link']] = userArr;
                config['agentsInfo'] =arr;
                this.urlHash = currentAgent;
              }
            }
            if(temp == 0){
              this.router.navigate(['/']);
            }else{
              this.agentInfo = {
                logo: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['logo'] : this.imgsrc,
                name: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['name'] : '',
                email: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['email'] : '',
                phone: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['phone'] : '',
                favicon: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['favicon'] : '',
                sitelogo: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['sitelogo'] : '',
                agent_image: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['agent_image'] : '',
              }
             
            }
        },
        error =>{
          console.log(error);
        }
    );
    // this.http.get('assets/agents.csv', {responseType: 'text'})
    // .subscribe(
    //     data => {
    //         let csvToRowArray = data.split("\n");
    //         let temp = 0;
    //         for (let index = 1; index <= csvToRowArray.length - 1; index++) {
    //           let row = csvToRowArray[index].split(",");
    //           if(row[0].trim() == currentAgent){
    //             temp = 1;
    //             let userArr = [];
    //             userArr['email'] = row[1];
    //             userArr['additional_email'] = row[2];
    //             userArr['name'] = row[3];
    //             userArr['logo'] = row[4];
    //             userArr['phone'] = row[5];               
    //             if( row[8]!= undefined || row[8]!= ''){
    //               userArr['favicon'] = row[8];
    //             }else{
    //               userArr['favicon'] = '';
    //             }
    //             if(row[9] != '' || row[9]!= undefined){
    //               userArr['sitelogo'] = row[9];
    //             }else{
    //               userArr['sitelogo'] = '';
    //             }
    //             if(row[10] != ''|| row[10]!= undefined){
    //               userArr['agent_image'] = row[10];
    //             }else{
    //               userArr['agent_image'] = '';
    //             }
    //             let arr = [];
    //             arr[row[0]] = userArr;
    //             config['agentsInfo'] =arr;
    //             this.urlHash = currentAgent;
    //           }
    //         }
           
    //         if(temp == 0){
    //           this.router.navigate(['/']);
    //         }else{
    //           this.agentInfo = {
    //             logo: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['logo'] : this.imgsrc,
    //             name: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['name'] : '',
    //             email: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['email'] : '',
    //             phone: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['phone'] : '',
    //             favicon: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['favicon'] : '',
    //             sitelogo: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['sitelogo'] : '',
    //             agent_image: ( typeof config.agentsInfo[this.urlHash] !== "undefined") ? config.agentsInfo[this.urlHash]['agent_image'] : '',
    //           }
             
    //         }
    //     },
    //     error =>{
    //       console.log(error);
    //     }
    // );
  }

  changeSource(event){
    this.agentInfo['logo'] = this.imgsrc;
  }

  @HostListener('document:click', ['$event']) clickout(event) {
	  // Click outside of the menu was detected
    if(event.target.id == "navmenutoggle"){
      this.menuoption = this.menuoption = 1;
    }else{
      if(this.menuoption == 1){
        this.menuoption = 0;
      }
    }
	}

  handleModelClick(event: Event) {
	  event.stopPropagation(); // Stop the propagation to prevent reaching document
  }
}

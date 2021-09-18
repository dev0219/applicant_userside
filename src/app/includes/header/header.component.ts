import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../authentication.service";
import {ApiService} from "../../api-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  emailAry: object = {
    'guard': 'info@guardha.com',
    'pete': 'peter.hughes3@guardha.com',
    'landing': 'peter.hughes3@guardha.com',
    'login': 'peter.hughes3@guardha.com',
    'links': 'peter.hughes3@guardha.com',
    'password': 'peter.hughes3@guardha.com',
    'register': 'peter.hughes3@guardha.com',
    'pricing': 'peter.hughes3@guardha.com',
    'group': 'peter.hughes3@guardha.com',
    'safeguard': 'info@safeguardha.com',
    'jon': 'jon@safeguardha.com',
    'gaby': 'gaby@safeguardha.com',
    'dan': 'dan@safeguardha.com',
    'blayre': 'blayre@safeguardha.com',
    'carnegie': 'info@carnegieha.com',
    'jeff': 'jeff@carnegieha.com',
    'tj': 'tj.ervin@carnegieha.com',
    'trey': 'trey.cheek@carnegieha.com',
    'gola': 'tim.gola@carnegieha.com',
    'fox': 'tim.fox@carnegieha.com',
    'mike': 'michael.warner@greaterpenn.com',
    'tc': 'tom@usautoandhome.com',
    'jason': 'jason@safeguardha.com',
    'TJ2': 'tj.ervin@patriotha.com',
    'DGP': 'dan@patriotha.com',
    'DGC': 'dan@carnegieha.com',
    'LD': 'larenzo@carnegieha.com',
    'zo': 'larenzo@guardha.com',
    'bill': 'bill.oconnell@pinnaclepartnerscorp.com',
    'neilc': 'neil@carnegieha.com',
    'manfra': 'peter.manfra@carnegieha.com',
    'wilt': 'jason@pinnaclemutual.com',
    'premier': 'quote@premierha.com',
    'ironvalley': 'quote@pinnaclemutual.com',
    'ivy': 'quote@pinnaclemutual.com',
    'power': 'quote@pinnaclemutual.com',
    'lancaster': 'quote@pinnaclemutual.com',
    'ocean': 'quote@pinnaclemutual.com',
    'strive': 'quote@pinnaclemutual.com',
    'edge': 'quote@pinnaclemutual.com',
    'crescent': 'quote@pinnaclemutual.com',
    'golden': 'quote@pinnaclemutual.com',
    'northeast': 'quote@pinnaclemutual.com',
    'treasure': 'quote@pinnaclemutual.com',
    'oldetown': 'quote@pinnaclemutual.com',
    'jordan': 'Jordan@carnegieha.com',
    'tommy': 'tommy@pinnaclemutual.com',
    'jpin': 'Jordan@pinnaclemutual.com',
    'neil': 'Neil.Moerman@guardha.com',
    'premierpete': 'peter.manfra@premierhomeandauto.com',
    'joe': 'joe@safeguardha.com',
    'brian': 'brian@premierhomeandauto.com',
    'ringer': 'Sue@safeguardha.com',
    'jennifer': 'jennifer@safeguardha.com',
    'eileen': 'Eileen@carnegieha.com',
    'caitlin': 'Caitlin@carnegieha.com',
    'nc': 'Jess@nchomeandauto.com',
  };
  agent_email: string;
  showRegister: boolean = false;

  constructor(private router: Router, public auth: AuthenticationService, public apiService: ApiService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.agent_email = this.emailAry[this.router.url.split('/')[1] == '' ? 'pete' : this.router.url.split('/')[1]];
    }, 300);
    this.isAdminExists()
  }

  isAdminExists(): void {
    this.apiService.checkAdmin().subscribe(res => {
      if (res['status'] == 'success' && res['result'] == false) {
        this.showRegister = true;
      }
    }, (err) => {
    });
  }
}

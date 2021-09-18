import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AdvanceHomeComponent} from './advance-home/advance-home.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {SettingsComponent} from "./settings/settings.component";
import {LandingComponent} from "./landing/landing.component";
import {LinksComponent} from "./links/links.component";
import {GroupComponent} from "./group/group.component";
import {PricingComponent} from "./pricing/pricing.component";
import {PasswordComponent} from "./password/password.component";
import {AboutusComponent} from "./agent/aboutus/aboutus.component";
import {SalesTeamsComponent} from "./agent/sales-teams/sales-teams.component";
import {CampaignsComponent} from "./agent/campaigns/campaigns.component";
import { SignupComponent } from './signup/signup.component';
import {LifeHomeComponent} from './life-home/life-home.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {path: 'landing', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password', component: PasswordComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'links', component: LinksComponent},
  {path: 'group', component: GroupComponent},
  {path: 'pricing', component: PricingComponent},
  {path: 'guard', component: HomeComponent},
  //{path: 'pete', component: HomeComponent},
  {path: 'safeguard', component: HomeComponent},
  {path: 'jon', component: HomeComponent},
  {path: 'gaby', component: HomeComponent},
  {path: 'dan', component: HomeComponent},
  {path: 'blayre', component: HomeComponent},
  {path: 'carnegie', component: HomeComponent},
  {path: 'jeff', component: HomeComponent},
  {path: 'tj', component: HomeComponent},
  {path: 'trey', component: HomeComponent},
  {path: 'gola', component: HomeComponent},
 // {path: 'fox', component: HomeComponent},
  {path: 'mike', component: HomeComponent},
  {path: 'tc', component: HomeComponent},
  {path: 'jason', component: HomeComponent},
  {path: 'bill', component: HomeComponent},
  {path: 'zo', component: HomeComponent},
  {path: 'TJ2', component: HomeComponent},
  {path: 'DGP', component: HomeComponent},
  {path: 'DGC', component: HomeComponent},
  {path: 'LD', component: HomeComponent},
  {path: 'neilc', component: HomeComponent},
  {path: 'manfra', component: HomeComponent},
  {path: 'wilt', component: HomeComponent},
  {path: 'premier', component: HomeComponent},
  {path: 'ironvalley', component: HomeComponent},
  {path: 'ivy', component: HomeComponent},
  {path: 'power', component: HomeComponent},
  {path: 'lancaster', component: HomeComponent},
  {path: 'ocean', component: HomeComponent},
  {path: 'strive', component: HomeComponent},
  {path: 'edge', component: HomeComponent},
  {path: 'crescent', component: HomeComponent},
  {path: 'golden', component: HomeComponent},
  {path: 'northeast', component: HomeComponent},
  {path: 'treasure', component: HomeComponent},
  {path: 'oldetown', component: HomeComponent},
  {path: 'jordan', component: HomeComponent},
  {path: 'tommy', component: HomeComponent},
  {path: 'jpin', component: HomeComponent},
  {path: 'neil', component: HomeComponent},
  {path: 'premierpete', component: HomeComponent},
  {path: 'joe', component: HomeComponent},
  {path: 'brian', component: HomeComponent},
  {path: 'ringer', component: HomeComponent},
  {path: 'jennifer', component: HomeComponent},
  {path: 'eileen', component: HomeComponent},
  {path: 'caitlin', component: HomeComponent},
  {path: 'nc', component: HomeComponent},
  {path: 'patriot', component: HomeComponent},
  {path: 'about', component: AboutusComponent},
  {path: 'sales-teams', component: SalesTeamsComponent},
  {path: 'campaigns', component: CampaignsComponent},
  {path: 'f/:agent', component: AdvanceHomeComponent },
  {path: ':agent', component:  HomeComponent },
  {path: 'life/:agent', component: LifeHomeComponent},
  {path: '', component: LandingComponent},
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MDBSpinningPreloader} from '../../projects/ng-uikit-pro-standard/src/lib/pro/mdb-pro.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrderComponent} from './order/order.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {HttpClientModule} from '@angular/common/http';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbdDatepickerBasic} from './directives/datepicker';
import {FileUploadModule} from 'ng2-file-upload';
import {ButtonsModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/buttons";
import {SelectModule} from "../../projects/ng-uikit-pro-standard/src/lib/pro/material-select";
import {CardsModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/cards";
import {ModalModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/modals";
import {InputUtilitiesModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/input-utilities";
import {InputsModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/inputs";
import {DropdownModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/dropdown";
import {CheckboxModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/checkbox";
import {SidenavModule} from "../../projects/ng-uikit-pro-standard/src/lib/pro/sidenav";
import {AccordionModule} from "../../projects/ng-uikit-pro-standard/src/lib/pro/accordion";
import {TableModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/tables";
import {WavesModule} from "../../projects/ng-uikit-pro-standard/src/lib/free/waves";
import {ToastModule, ToastService} from '../../projects/ng-uikit-pro-standard/src/lib/pro/alerts';
import {MDBBootstrapModulesPro} from '../../projects/ng-uikit-pro-standard/src/lib/mdb.module';
import {AgmCoreModule} from '@agm/core';

import { OwlModule } from 'ngx-owl-carousel';

import {NgbdModalContent} from "./home/ngbd.modal.content";
import {ApiService} from "./api-service";
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthenticationService} from "./authentication.service";
import {ProfileComponent} from './profile/profile.component';
import {StatisticsComponent} from './statistics/statistics.component';
import {SettingsComponent} from './settings/settings.component';
import {LandingComponent} from './landing/landing.component';
import {LinksComponent} from './links/links.component';
import {GroupComponent} from './group/group.component';
import {PricingComponent} from './pricing/pricing.component';
import {PasswordComponent} from './password/password.component';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
import { BuyHomeComponent } from './components/buy-home/buy-home.component';
import { LoaderComponent } from './loader/loader.component';
import {AdvancePageTenComponent} from "./components/advance-page-ten/advance-page-ten.component";
import {AdvancePageSevenComponent} from "./components/advance-page-seven/advance-page-seven.component";
import {PageSixComponent} from "./components/page-six/page-six.component";
import { PageSevenComponent } from './components/page-seven/page-seven.component';
import { PageFiveComponent } from './components/page-five/page-five.component';
import { PageEightComponent } from './components/page-eight/page-eight.component';
import { PageNineComponent } from './components/page-nine/page-nine.component';
import { PageTenComponent } from './components/page-ten/page-ten.component';
import { FormLabelInputComponent } from './components/form-label-input/form-label-input.component';
import { NextButtonComponent } from './components/next-button/next-button.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AdvanceHomeComponent } from './advance-home/advance-home.component';
import { PageAdavanceFiveComponent } from './components/page-adavance-five/page-adavance-five.component';
import { PageAdvanceSixComponent } from './components/page-advance-six/page-advance-six.component';
import { AboutusComponent } from './agent/aboutus/aboutus.component';
import { SalesTeamsComponent } from './agent/sales-teams/sales-teams.component';
import { CampaignsComponent } from './agent/campaigns/campaigns.component';
import { SignupComponent } from './signup/signup.component';
import { LifeHomeComponent } from './life-home/life-home.component';
import { PageOneComponent } from './components/page-one/page-one.component';
import { InsuaraceTypeSelectionComponent } from './components/insuarace-type-selection/insuarace-type-selection.component';
import { AdvanceCurrentAutoPremiumComponent } from './components/advance-current-auto-premium/advance-current-auto-premium.component';
import { AdvanceQuoteUploadComponent } from './components/advance-quote-upload/advance-quote-upload.component';
import { SigninComponent } from './signin/signin.component';
@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    HomeComponent,
    NgbdDatepickerBasic,
    NgbdModalContent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    StatisticsComponent,
    SettingsComponent,
    LandingComponent,
    LinksComponent,
    GroupComponent,
    PricingComponent,
    PasswordComponent,
    HeaderComponent,
    FooterComponent,
    BuyHomeComponent,
    LoaderComponent,
    AdvancePageTenComponent,
    AdvancePageSevenComponent,
    PageSevenComponent,
    PageFiveComponent,
    PageEightComponent,
    PageNineComponent,
    PageTenComponent,
    PageSixComponent,
// common
    FormLabelInputComponent,
NextButtonComponent,
SubHeaderComponent,
AdvanceHomeComponent,
PageAdavanceFiveComponent,
PageAdvanceSixComponent,
AboutusComponent,
SalesTeamsComponent,
CampaignsComponent,
SignupComponent,
LifeHomeComponent,
PageOneComponent,
InsuaraceTypeSelectionComponent,
AdvanceCurrentAutoPremiumComponent,
AdvanceQuoteUploadComponent,
PageSevenComponent,
SigninComponent
  ],
  imports: [
    NgbModule,
    //AIzaSyAbsbffrWgoeXaNnBBgwOLzoqqFmF6JJ3k === old
    //New its working on localhost- AIzaSyBqAaqErAb9CllThpl5z4H5tHJVDBpO0IE
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbsbffrWgoeXaNnBBgwOLzoqqFmF6JJ3k',
      libraries: ["places"]
    }),
    Ng4LoadingSpinnerModule.forRoot(),
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    InputUtilitiesModule,
    DropdownModule,
    CheckboxModule,
    InputsModule,
    GooglePlaceModule,
    ButtonsModule,
    WavesModule,
    TableModule,
    CardsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SelectModule,
    MDBBootstrapModulesPro.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AccordionModule,
    SidenavModule,
    ModalModule,
    ScrollToModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    ToastModule.forRoot(),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    DatePickerModule,
    OwlModule
  ],
  providers: [ApiService, AuthenticationService, MDBSpinningPreloader, ToastService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [NgbdModalContent]
})
export class AppModule {
}

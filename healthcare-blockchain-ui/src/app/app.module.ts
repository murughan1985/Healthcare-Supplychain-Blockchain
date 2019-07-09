/*
# Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License.
# A copy of the License is located at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# or in the "license" file accompanying this file. This file is distributed
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied. See the License for the specific language governing
# permissions and limitations under the License.
#
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as $ from 'jquery';
import * as popper from 'popper.js';
import * as bootstrap from 'bootstrap';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './ui/shared/header/header.component';
import { SidenavComponent } from './ui/shared/sidenav/sidenav.component';
import { FooterComponent } from './ui/shared/footer/footer.component';
import { SigninComponent } from './ui/signin/signin.component';
import { SignupComponent } from './ui/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { NgosListComponent } from './ui/healthcare-blockchain/healthcare-blockchain.component';

// Shared Services
import { AuthService, ApiService, SessionService, DonorService} from './services/shared';
import { AssetTrackingService } from './services/assetTrackingService';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    SignupComponent,
    NgosListComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AuthService,
    ApiService,
    SessionService,
    AssetTrackingService,
    DonorService
  ],
  bootstrap: [AppComponent],
    
    entryComponents: [NgosListComponent]
})
export class AppModule {

}

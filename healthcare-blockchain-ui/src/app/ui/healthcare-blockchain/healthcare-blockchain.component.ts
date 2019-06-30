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
import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService, UtilsService } from 'src/app/services/shared';
import { AssetTrackingService } from 'src/app/services/assetTrackingService';

@Component({
  selector: 'app-ngos-list',
  templateUrl: './healthcare-blockchain.component.html',
  styleUrls: ['./healthcare-blockchain.component.scss']
})
export class NgosListComponent implements OnInit {


  @HostListener('window:resize', ['$event'])
  update(event) { UtilsService.onHeightChange('.container-dynamic-height'); }



  constructor(private assetTrackService: AssetTrackingService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver) {
 
  }
  assertCreat={
      assetId: null as string,
      assetName:null as string,
      assetType:null as string,
      assetExpirtyDate:null as Date,
      aManufacturerId:null as number
  }
  message:String
  getAsset={
      fAssetId:null as number,
      fAssetName:null as string,
      fmanufacturer:null as string,
      
  }
  fetched:boolean =false
  manuFaCreate={
      manufacturerId:null as number,
      manufacturerName:null as string,
      manufacturerLocation:null as string
  }

  messageManufacturer:string
  
  distrBuCreate={
      distributorId: null as number,
      distributorName: null as string,
      distributorLocation:null as string
      
  }
  messageDistributor: string

  hospitalCreate={
      hospitalId:null as number,
      hospitalName: null as string,
      hospitalLocation: null as string
      
  }
  messageHospital:string

  pharmaCreate={
      pharmacyId: null as number,
      pharmacyName: null as string,
      pharmacyLocation: null as string

  }
  messagePharmacy:string

  assetTrans={
      tassetId:null as number,
      transferTo:null as number
  }

  disposeasset={
    dassetId:null as number
  }
      messageTransfer:string
      messageDispose:string
  
  ngOnInit() {
 
  }
  submitManufacturer(manuFaCreate){
    this.assetTrackService.submitManufaturerData(manuFaCreate).subscribe(data => {
        if (data) {
          this.messageManufacturer = "Manufacturer created successfully.";
        } else {
          console.log("manufature error")
        }
      })
  }

  submitDistributor(distrBuCreate){
    this.assetTrackService.submitDistributorData(distrBuCreate).subscribe(data => {
      if (data) {
        this.messageDistributor = "Distributor created successfully.";
      } else {
        console.log("manufature error")
      }
    })
  }


  submitHospital(hospitalCreate){
    this.assetTrackService.submitHospitalData(hospitalCreate).subscribe(data => {
      if (data) {
        this.messageDistributor = "Hospital created successfully.";
      } else {
        console.log("manufature error")
      }
    })
  }

  submitPharmacy(pharmaCreate){
    this.assetTrackService.submitPharmacyData(pharmaCreate).subscribe(data => {
      if (data) {
        this.messageDistributor = "Pharma created successfully.";
      } else {
        console.log("manufature error")
      }
    })
  }
  submitAsset(assertCreat){
    this.assetTrackService.submitAssetData(assertCreat).subscribe(data => {
      if (data) {
        this.messageDistributor = "Asset created successfully.";
      } else {
        console.log("manufature error")
      }
    })
  }
  transferAsset(assetTrans){
    this.assetTrackService.transferAssetData(assetTrans).subscribe(data => {
      if (data) {
        this.messageDistributor = "Asset transfered successfully .";
      } else {
        console.log("manufature error")
      }
    })
  }

  disposeAsset(disposeasset){
    this.assetTrackService.disposeAssetData(disposeasset).subscribe(data => {
      if (data) {
        this.messageDispose = "Asset disposed successfully.";
      } else {
        console.log("manufature error")
      }
    })
  }

  get(assetId){
    this.assetTrackService.getAssetData(assetId).subscribe(data => {
      if (data) {
        this.getAsset.fAssetName = data.name;
        this.getAsset.fmanufacturer = data.owner;
        this.fetched = true;
      } else {
        console.log("dispose error")
      }
    })
   

  }
}

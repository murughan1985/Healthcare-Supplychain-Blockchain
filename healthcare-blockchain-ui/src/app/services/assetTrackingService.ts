import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class AssetTrackingService {

  constructor(private http: HttpClient) {
}

submitManufaturerData(manufacturerData): Observable<any> {
  console.log("manu",manufacturerData)
  return this.http.post(`http://localhost:3000/api/manufacturer`,manufacturerData)
}

submitDistributorData(distributorData): Observable<any> {
  console.log("dis",distributorData)
  return this.http.post(`http://localhost:3000/api/distributor`,distributorData)
}

submitHospitalData(hospitalData): Observable<any> {
 console.log("hos",hospitalData)
  return this.http.post(`http://localhost:3000/api/hospital`,hospitalData)
}

submitPharmacyData(pharmacyData): Observable<any> {
  console.log(pharmacyData)
  return this.http.post(`http://localhost:3000/api/pharmacy`,pharmacyData)
}

submitAssetData(assetData): Observable<any> {
  console.log("asset",assetData)
  return this.http.post(`http://localhost:3000/api/asset`,assetData)
}

transferAssetData(transferAsset): Observable<any> {
  console.log("transe",transferAsset)
  return this.http.put(`http://localhost:3000/api/transfer`,transferAsset)
}
disposeAssetData(dispoassetData): Observable<any> {
  console.log("dis",dispoassetData)
  return this.http.put(`http://localhost:3000/api/asset/`,dispoassetData)

}
getAssetData(assetId): Observable<any> {
  console.log("assid",assetId)
  return this.http.get(`http://localhost:3000/api/asset/${assetId}`)

}

}


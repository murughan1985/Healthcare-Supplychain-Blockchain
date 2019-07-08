'use strict';
const shim = require('fabric-shim');
const util = require('util');

const stateType = {
    Manufacturer: 'Manufacturered',
    Distributor: 'Distributed',
    Hospital: 'Delivered',
    Pharmacy: 'Delivered',
    Customer: 'Sold',
    Recall: 'Recalled',
    Disposal: 'Disposed'
};

async function queryByString(stub, queryString) {

    let docType = "";
    let startKey = "";
    let endKey = "";
    let jsonQueryString = JSON.parse(queryString);
    if (jsonQueryString['selector'] && jsonQueryString['selector']['docType']) {
      docType = jsonQueryString['selector']['docType'];
      startKey = docType + "0";
      endKey = docType + "z";
    }
    else {
      throw new Error('##### queryByString - Cannot call queryByString without a docType element: ' + queryString);   
    }
  
    let iterator = await stub.getStateByRange(startKey, endKey);
  
    // Iterator handling is identical for both CouchDB and LevelDB result sets, with the 
    // exception of the filter handling in the commented section below
    let allResults = [];
    while (true) {
      let res = await iterator.next();
  
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log('##### queryByString iterator: ' + res.value.value.toString('utf8'));
  
        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } 
        catch (err) {
          console.log('##### queryByString error: ' + err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        // ******************* LevelDB filter handling ******************************************
        // LevelDB: additional code required to filter out records we don't need
        // Check that each filter condition in jsonQueryString can be found in the iterator json
        // If we are using CouchDB, this isn't required as rich query supports selectors
        let jsonRecord = jsonQueryString['selector'];
        // If there is only a docType, no need to filter, just return all
        console.log('##### queryByString jsonRecord - number of JSON keys: ' + Object.keys(jsonRecord).length);
        if (Object.keys(jsonRecord).length == 1) {
          allResults.push(jsonRes);
          continue;
        }
        for (var key in jsonRecord) {
          if (jsonRecord.hasOwnProperty(key)) {
            console.log('##### queryByString jsonRecord key: ' + key + " value: " + jsonRecord[key]);
            if (key == "docType") {
              continue;
            }
            console.log('##### queryByString json iterator has key: ' + jsonRes.Record[key]);
            if (!(jsonRes.Record[key] && jsonRes.Record[key] == jsonRecord[key])) {
              // we do not want this record as it does not match the filter criteria
              continue;
            }
            allResults.push(jsonRes);
          }
        }
        // ******************* End LevelDB filter handling ******************************************
        // For CouchDB, push all results
        // allResults.push(jsonRes);
      }
      if (res.done) {
        await iterator.close();
        console.log('##### queryByString all results: ' + JSON.stringify(allResults));
        console.log('============= END : queryByString ===========');
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }
  

let Chaincode = class {

    async Init(stub) {
        return shim.success();
    }

    async Invoke(stub) {
        //Read input parameters
        let ret = stub.getFunctionAndParameters();

        //Read function name
        let method = this[ret.fcn];
        if (!method) {
            console.error('##### Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
            throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
        }
        try {
            //Invoke method
            let response = await method(stub, ret.params);
            //Return the respose
            return shim.success(response);
        } catch (err) {
            console.log('##### Invoke - error: ' + err);
            return shim.error(err);
        }
    }

    async initLedger(stub, args) {

    }

    /**
  * Creates a new Manufacturer
  * 
  * @param {*} stub 
  * @param {*} args - JSON as follows:
  * {
   "manufacturerId": "1",
   "manufacturerName": "manufacturer1",
   "manufacturerLocation":"AL"
    }
  */
    async createManufacturer(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let manufacturerId = 'manufacturer' + json['manufacturerId'];
        json['docType'] = 'manufacturer';

        // Check if the manufacturer already exists, read data from ledger
        let manufacturer = await stub.getState(manufacturerId);
        if (manufacturer.toString()) {
            throw new Error('##### createManufacturer - This manufacturer already exists: ' + json['manufacturerId']);
        }
        //Insert into peer ledger
        await stub.putState(manufacturerId, Buffer.from(JSON.stringify(json)));
    }

    /**
  * Creates a new Asset
  * 
  * @param {*} stub 
  * @param {*} args - JSON as follows:
  * {
   "assetId": "1",
   "assetName": "needle",
   "assetType":"Medical Supplies", 
   "assetExpirtyDate":"2019-30-12",
   "owner":"1"//ManufacturerId,
   "state":"Manufacturered",
    }
  */
    async createAsset(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let assetId = 'asset' + json['assetId'];
        json['owner'] = 'manufacturer' + json['owner'];
        json['state'] = stateType.Manufacturer;
        //Each document in CouchDB should have docType for better quey performance
        json['docType'] = 'medicaldevice';

        // Check if the assset already exists, read data from ledger
        let asset = await stub.getState(assetId);
        if (asset.toString()) {
            throw new Error('##### createAsset - This Asset already exists: ' + json['assetId']);
        }
        //Insert into peer ledger
        await stub.putState(assetId, Buffer.from(JSON.stringify(json)));
    }

    /**
* Creates a new distributor
* 
* @param {*} stub 
* @param {*} args - JSON as follows:
* {
"distributorId": "1",
"distributorName": "distributor1",
"distributorLocation":"IL"
}
*/
    async createDistributor(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let distributorId = 'distributor' + json['distributorId'];
        json['docType'] = 'distributor';

        // Check if the distributor already exists, read data from ledger
        let distributor = await stub.getState(distributorId);
        if (distributor.toString()) {
            throw new Error('##### createDistributor - This distributor already exists: ' + json['distributorId']);
        }
        //Insert into peer ledger
        await stub.putState(distributorId, Buffer.from(JSON.stringify(json)));
    }

    /**
* Creates a new hospital
* 
* @param {*} stub 
* @param {*} args - JSON as follows:
* {
"hospitalId": "1",
"hospitalName": "hospital1",
"hospitalLocation":"CO"
}
*/
    async createHospital(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let hospitalId = 'hospital' + json['hospitalId'];
        json['docType'] = 'hospital';

        // Check if the hospital already exists, read data from ledger
        let hospital = await stub.getState(hospitalId);
        if (hospital.toString()) {
            throw new Error('##### createHospital - This hospital already exists: ' + json['hospitalId']);
        }
        //Insert into peer ledger
        await stub.putState(hospitalId, Buffer.from(JSON.stringify(json)));
    }

    /**
* Creates a new pharmacy
* 
* @param {*} stub 
* @param {*} args - JSON as follows:
* {
"pharmacyId": "1",
"pharmacyName": "pharmacy1",
"pharmacyLocation":"CA"
}
*/
    async createPharmacy(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let pharmacyId = 'pharmacy' + json['pharmacyId'];
        json['docType'] = 'pharmacy';

        // Check if the pharmacy already exists, read data from ledger
        let pharmacy = await stub.getState(pharmacyId);
        if (pharmacy.toString()) {
            throw new Error('##### createPharmacy - This pharmacy already exists: ' + json['pharmacyId']);
        }
        //Insert into peer ledger
        await stub.putState(pharmacyId, Buffer.from(JSON.stringify(json)));
    }

    async getAssetDetail(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let assetId = 'asset' + json['assetId'];

        //read data from ledger
        let assetAsBytes = await stub.getState(assetId);
        if (!assetAsBytes || assetAsBytes.toString().length <= 0) {
            throw new Error(`${assetId} does not exist`);
        }
        return assetAsBytes;
    }

      /**
   * Retrieves all donors
   * 
   * @param {*} stub 
   * @param {*} args 
   */
  async queryAllAssets(stub, args) {
    console.log('============= START : queryAllAssets ===========');
    console.log('##### queryAllAssets arguments: ' + JSON.stringify(args));
 
    let queryString = '{"selector": {"docType": "medicaldevice"}}';
    return queryByString(stub, queryString);
  }

  async queryAll(stub, args) {
    console.log('============= START : queryAllAssets ===========');
    console.log('##### queryAllAssets arguments: ' + JSON.stringify(args));
 
     //Read input values
     let json = JSON.parse(args);
     let docType = json['docType'];

    let queryString = '{"selector": {"docType": "' + docType + '"}}';
    return queryByString(stub, queryString);
  }



        /**
* Transfer asset
* 
* @param {*} stub 
* @param {*} args - JSON as follows:
* {
"assetId": "1",
"transferTo": "1",
"transferToMember":"distributor"
}
*/

    async transferAsset(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let assetId = 'asset' + json['assetId'];
        let transferTo = json['transferTo'];
        let transferToMember = json['transferToMember'];
        let json = JSON.parse(args);

        //read data from ledger
        let assetAsBytes = await stub.getState(assetId);

        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetId} does not exist`);
        }
        const asset = JSON.parse(assetAsBytes.toString());
        let state = asset.state;
        //Transfer to Distributor
        if (state = stateType.Manufacturer && (transferToMember = "distributor")) {
            asset.state = stateType.Distributor;
            asset.owner = 'distributor' + transferTo;
        }
        //Transfer to Hospital
        else if (state = stateType.Distributor && (transferToMember = "hospital")) {
            asset.state = stateType.Hospital;
            asset.owner = 'hospital' + transferTo;
        }
        //Transfer to Pharmacy
        else if (state = stateType.Distributor && (transferToMember = "pharmacy")) {
            asset.state = stateType.Pharmacy;
            asset.owner = 'pharmacy' + transferTo;
        }
        //Transfer to Customer
        else if (transferToMember = "user") {
            if (state = stateType.Pharmacy || (state = stateType.Hospital)) {
                asset.state = stateType.Customer;
                asset.owner = 'customer' + transferTo;
            }
        }
        //Update peer ledger world state 
        await stub.putState(assetId, Buffer.from(JSON.stringify(asset)));
    }

    async disposeAsset(stub, args) {
        //Read input values
        let json = JSON.parse(args);
        let assetId = json['assetId'];

        //read data from ledger
        let assetAsBytes = await stub.getState(assetId);

        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetId} does not exist`);
        }
        const asset = JSON.parse(assetAsBytes.toString());
        asset.state = stateType.Disposal;

        //Update peer ledger world state 
        await stub.putState(assetId, Buffer.from(JSON.stringify(asset)));
    }

    /**
  * Retrieves the Fabric block and transaction details for a key or an array of keys
  * 
  * @param {*} stub 
  * @param {*} args - JSON as follows:
  * [
  *    {"key": "a207aa1e124cc7cb350e9261018a9bd05fb4e0f7dcac5839bdcd0266af7e531d-1"}
  * ]
  * 
  */
    async queryHistoryForKey(stub, args) {
        console.log('============= START : queryHistoryForKey ===========');
        console.log('##### queryHistoryForKey arguments: ' + JSON.stringify(args));

        // args is passed as a JSON string
        let json = JSON.parse(args);
        let key = json['key'];
        let docType = json['docType']
        console.log('##### queryHistoryForKey key: ' + key);
        let historyIterator = await stub.getHistoryForKey(docType + key);
        console.log('##### queryHistoryForKey historyIterator: ' + util.inspect(historyIterator));
        let history = [];
        while (true) {
            let historyRecord = await historyIterator.next();
            console.log('##### queryHistoryForKey historyRecord: ' + util.inspect(historyRecord));
            if (historyRecord.value && historyRecord.value.value.toString()) {
                let jsonRes = {};
                console.log('##### queryHistoryForKey historyRecord.value.value: ' + historyRecord.value.value.toString('utf8'));
                jsonRes.TxId = historyRecord.value.tx_id;
                jsonRes.Timestamp = historyRecord.value.timestamp;
                jsonRes.IsDelete = historyRecord.value.is_delete.toString();
                try {
                    jsonRes.Record = JSON.parse(historyRecord.value.value.toString('utf8'));
                } catch (err) {
                    console.log('##### queryHistoryForKey error: ' + err);
                    jsonRes.Record = historyRecord.value.value.toString('utf8');
                }
                console.log('##### queryHistoryForKey json: ' + util.inspect(jsonRes));
                history.push(jsonRes);
            }
            if (historyRecord.done) {
                await historyIterator.close();
                console.log('##### queryHistoryForKey all results: ' + JSON.stringify(history));
                console.log('============= END : queryHistoryForKey ===========');
                return Buffer.from(JSON.stringify(history));
            }
        }
    }
}
shim.start(new Chaincode());


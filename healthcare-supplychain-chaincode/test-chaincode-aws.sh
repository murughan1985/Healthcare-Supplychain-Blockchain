#!/bin/bash

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

echo Run this script on the Fabric client node, OUTSIDE of the CLI container
echo
echo Add Asset and Particants

# Note the Args below - we are passing in a JSON payload, rather than the usual array of strings that Fabric requires. 
# IMO this is much better as we can clearly see what each argument means, rather than just passing an array of strings
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
    -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
    cli peer chaincode invoke -C mychannel -n healthcare \
    -c  '{"Args":["createDistributor","{\"distributorId\": \"1\", \"distributorName\": \"distributor1\", \"distributorLocation\": \"IL\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
    -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
    cli peer chaincode invoke -C mychannel -n healthcare \
    -c  '{"Args":["createAsset","{\"assetId\": \"1\", \"assetName\": \"needle\",  \"assetExpirtyDate\": \"2019-07-22T11:52:20.182Z\", \"assetOwner\": \"1\" }"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n healthcare -c  '{"Args":["createManufacturer","{\"manufacturerId\": \"1\", \"manufacturerName\": \"manufacturer1\", \"manufacturerLocation\": \"AL"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["createManufacturer","{\"manufacturerId\": \"1\", \"manufacturerName\": \"manufacturer1\", \"manufacturerLocation\": \"AL"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createAsset","{\"assetId\": \"1\", \"assetName\": \"needle\",  \"assetExpirtyDate\": \"2019-07-22T11:52:20.182Z\", \"assetOwner\": \"1\" }"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createDistributor","{\"distributorId\": \"1\", \"distributorName\": \"distributor1\", \"distributorLocation\": \"IL"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createHospital","{\"hospitalId\": \"1\", \"hospitalName\": \"hospital1\", \"hospitalLocation\": \"CO"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \ 
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \ 
-c '{"Args":["createPharmacy","{\"pharmacyId\": \"1\", \"pharmacyName\": \"pharmacy1\", \"pharmacyLocation\": \"CA"}"]}'


echo Query asset

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["getAssetDetail","{\"assetId\": \"1\"}"]}'

echo transfer asset to Distributor

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \
-c '{"Args":["transferAsset","{\"assetId\": \"1\", \"transferTo\": \"1\", \"transferToMember\": \"distributor\"}"]}'

echo transfer asset to Hospital

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \ 
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \
-c '{"Args":["transferAsset","{\"assetId\": \"1\", \"transferTo\": \"1\", \"transferToMember\": \"hospital\"}"]}'

echo transfer asset to Pharmacy

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \
-c '{"Args":["transferAsset","{\"assetId\": \"1\", \"transferTo\": \"1\", \"transferToMember\": \"pharmacy\"}"]}'

echo dispose asset

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode invoke -o $ORDERER -C $CHANNEL -n $CHAINCODENAME \
-c '{"Args":["disposeAsset","{\"assetId\": \"1\"}"]}'

echo Query history for a specific key

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
-e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
cli peer chaincode query -C $CHANNEL -n $CHAINCODENAME -c '{"Args":["queryHistoryForKey","{\"key\": \"136772b8c4bc84c09f86d8f936ae107a5fcbfbaa25b15d4a9ee7059dac1b312a-0\"}"]}'

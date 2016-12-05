var request = require('request')

var client = { 
     devKey: process.env.ebay_dev_key
}
  
var ebay = {
    search: function( ISBN ){
             return new Promise(function(resolve, reject) {
                 var ebaySearchUrl = "https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=" + client.devKey + "&OPERATION-NAME=findItemsByProduct&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=10&GLOBAL-ID=EBAY-US&siteid=0&productId.@type=ISBN&productId=" + ISBN;
                //console.log(ebaySearchUrl)
                request
                    .get(ebaySearchUrl, function(error, response, body) {
                        var result = JSON.parse(body)
                        //console.log(result)                    
                        var resultsArray = [];

                       if(result.findItemsByProductResponse[0].ack[0] == "Success"){

                           resultsArray = result.findItemsByProductResponse[0].searchResult[0].item;

                       }

                        resolve(resultsArray)
                    })
        
            })
    }
};

module.exports = ebay;


var Amazon = require('amazon-product-api');

var client = Amazon.createClient({
        awsId: process.env.amazon_id,
        awsSecret: process.env.amazon_secret_key
});
  
var amazon = {
    search: function( searchTerm ){
            //console.log(client)
            var searchResults = client.itemSearch({
                    keywords: searchTerm,
                    searchIndex: 'Books',
                    responseGroup: 'ItemAttributes'
            }).then(function(results){
                    console.log("in amazon")
                   return results.map( function( result ){
                      var productPrice = result.ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                       return {
                           url: result.DetailPageURL[0],
                           title: result.ItemAttributes[0].Title[0],
                           price: productPrice,
                           type: result.ItemAttributes[0].ProductTypeName[0],
                           features: result.ItemAttributes[0].Feature
                       };                  
                   } );
            }).catch(function(err){
                        return err;
                });
            return searchResults;
    }
};

module.exports = amazon;

    
   
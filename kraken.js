const key          = "1rR7A9MDHnX8CtA7KK9Z+MayCSlFApMe2PsW+EhFIalTHfq+1S1cEDHD" // API Key
const secret       = "1yT7drZWYCEwTtAXUlI1addRpzGoMPdx+1RBz64prBjkc76PV2u549KYaFBeXOsfZvVpAioZwIFMD9Zrvu1WFw==" // API Private Key
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(key, secret);
 
(async () => {
    // Display user's open orders
    console.log(await kraken.api('OpenOrders'));
 
})();
const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: 'test_NDqEURQSdMmFQpQBn2dDGeJvSanM2u' });

// CREATE PAYMENT

app.post('/payment', function(req, res, next) {
  // create paymnet here 
});


(async () => {
  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value: '10.00', // We enforce the correct number of decimals through strings
    },
    description: 'Order #12345',
    redirectUrl: 'https://webshop.example.org/order/12345/',
    webhookUrl: 'https://webshop.example.org/payments/webhook/',
    metadata: {
      order_id: '12345',
    }, 
  });
})();

// GET PAYMENT
(async () => {
  const payment = await mollieClient.payments.get('tr_Eq8xzWUPA4');
})();

// DELETE PAYMENT
(async () => {
  const canceledPayment = await mollieClient.payments.delete('tr_Eq8xzWUPA4');
})();

// LIST ALL PAYMENT METHODS
(async () => {
  // Methods for the Payments API
  let methods = await mollieClient.methods.all();

  // Methods for the Orders API
  methods = await mollieClient.methods.all({ resource: 'orders' });
})();


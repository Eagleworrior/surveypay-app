const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.post('/paystack/webhook', (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;
  
  if (event.event === 'charge.success') {
    const data = event.data;
    console.log('Payment successful:', data.reference, data.amount / 100, data.currency);
    
    // TODO: Save to database here
    // Example: mark order as paid using data.reference
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Server running'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

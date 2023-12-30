const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./expense-tracker-6c710-firebase-adminsdk-3df4p-5fd430dfbc.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expense-tracker-6c710.firebaseio.com'
});
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/investments', require('./routes/investments'));
app.use('/travelexpenses', require('./routes/travelexpenses'));
app.use('/tripexpenses', require('./routes/tripexpenses'));
app.use('/miscellaneous', require('./routes/miscellaneous'));
app.use('/monthlyexpenses', require('./routes/monthlyexpenses'));

app.get('*', express.static(path.join(__dirname, 'build')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


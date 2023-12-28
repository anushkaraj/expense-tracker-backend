const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 5000; // Choose a port number

app.use(cors());
const admin = require('firebase-admin');
const serviceAccount = require('./expense-tracker-6c710-firebase-adminsdk-3df4p-5fd430dfbc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expense-tracker-6c710.firebaseio.com',
});

app.use(express.json()); // Add this line to parse JSON requests
app.post('/updateName', async (req, res) => {
    try {
      const { newName } = req.body;
  
      // Update the name in Firestore for the hardcoded user ID 'user123'
      const userRef = admin.firestore().collection('users').doc('user123');
      await userRef.update({ name: newName });
  
      res.json({ message: `Name updated to "${newName}" for user with ID 'user123'.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
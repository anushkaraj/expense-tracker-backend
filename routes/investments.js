const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();


const serviceAccount = require('../expense-tracker-6c710-firebase-adminsdk-3df4p-5fd430dfbc.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expense-tracker-6c710.firebaseio.com'
});

// Function to add a new record
router.post('/addRecord', (req, res) => {
  const { category, year, month, amount, date, description } = req.body;

  // Get a reference to the Firestore database
  const db = admin.firestore();

  // Specify the path to your document
  const docPath = `investments/investment`; // Dynamically use the category received from React

  // Retrieve the document
  const docRef = db.doc(docPath);

  docRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        res.status(404).send('Document not found');
      } else {
        // Access the data
        const data = doc.data();

        // Add the new record
        if (!data.investments[category][year]) {
          data.investments[category][year] = {};
        }

        if (!data.investments[category][year][month]) {
          data.investments[category][year][month] = {};
        }

        const newInvestmentKey = `investment${Object.keys(data.investments[category][year][month]).length + 1}`;
        data.investments[category][year][month][newInvestmentKey] = {
          amount,
          date,
          description
        };

        // Update the document
        return docRef.update(data);
      }
    })
    .then(() => {
      console.log('Document updated with new record');
      // Send the complete JSON data as a response
      return docRef.get();
    })
    .then(doc => {
      const updatedData = doc.data();
      res.status(200).json(updatedData);
    })
    .catch(error => {
      console.error('Error updating document:', error);
      res.status(500).send('Internal server error');
    });
});

// Function to delete a record
router.post('/deleteRecord', (req, res) => {
  const { category, year, month, investmentKey } = req.body;

  // Get a reference to the Firestore database
  const db = admin.firestore();

  // Specify the path to your document
  const docPath = `investments/investment`; // Dynamically use the category received from React

  // Retrieve the document
  const docRef = db.doc(docPath);

  docRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        res.status(404).send('Document not found');
      } else {
        // Access the data
        const data = doc.data();

        // Check if the record exists before deleting
        if (data.investments[category][year] && data.investments[category][year][month] && data.investments[category][year][month][investmentKey]) {
          // Delete the specified record
          delete data.investments[category][year][month][investmentKey];
          console.log('Record deleted successfully');
          // Update the document
          return docRef.update(data);
        } else {
          console.log('Record not found!');
        }
      }
    })
    .then(() => {
      // Send the complete JSON data as a response
      return docRef.get();
    })
    .then(doc => {
      const updatedData = doc.data();
      res.status(200).json(updatedData);
    })
    .catch(error => {
      console.error('Error updating document:', error);
      res.status(500).send('Internal server error');
    });
});
// Function to get the complete JSON data
router.get('/getCompleteData', (req, res) => {
    // Get a reference to the Firestore database
    const db = admin.firestore();
  
    // Specify the path to your document
    const docPath = 'investments/investment';
  
    // Retrieve the document
    const docRef = db.doc(docPath);
  
    docRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
          res.status(404).send('Document not found');
        } else {
          // Access the data and send it as a JSON response
          const data = doc.data();
          res.status(200).json(data);
        }
      })
      .catch(error => {
        console.error('Error getting document:', error);
        res.status(500).send('Internal server error');
      });
  });
  
  module.exports = router;
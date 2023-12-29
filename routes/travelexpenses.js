
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');


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
        if(!data.travelexpenses[category])
        {
          data.travelexpenses[category]={};
        }
        if (!data.travelexpenses[category][year]) {
          data.travelexpenses[category][year] = {};
        }

        if (!data.travelexpenses[category][year][month]) {
          data.travelexpenses[category][year][month] = {};
        }

        const newInvestmentKey = `investment${Object.keys(data.travelexpenses[category][year][month]).length + 1}`;
        data.travelexpenses[category][year][month][newInvestmentKey] = {
          amount,
          date,
          description
        };
        console.log(data)
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
        if (data.travelexpenses[category][year] && data.travelexpenses[category][year][month] && data.travelexpenses[category][year][month][investmentKey]) {
          // Delete the specified record
          delete data.travelexpenses[category][year][month][investmentKey];
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
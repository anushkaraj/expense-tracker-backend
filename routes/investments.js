const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();

router.post('/addRecord', (req, res) => {
  const { category,amount, date, description } = req.body;
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString('en-us', { month: 'long' });
  const db = admin.firestore();
  const docPath = `investments/investment`; // Dynamically use the category received from React
  const docRef = db.doc(docPath);

  docRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        res.status(404).send('Document not found');
      } else {
        const data = doc.data();
        if(!data.investments[category])
        {
          data.investments[category]={};
        }
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
        console.log(data)
        return docRef.update(data);
      }
    })
    .then(() => {
      console.log('Document updated with new record');
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

router.post('/deleteRecord', (req, res) => {
  console.log(req.body)
  const { category, date, investmentKey } = req.body;
  console.log(category)
  console.log(req.body)
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString('en-us', { month: 'long' });
  const db = admin.firestore();

  const docPath = `investments/investment`; 
  const docRef = db.doc(docPath);

  docRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
        res.status(404).send('Document not found');
      } else {
        const data = doc.data();
        if (data.investments[category][year] && data.investments[category][year][month] && data.investments[category][year][month][investmentKey]) {
          delete data.investments[category][year][month][investmentKey];
          console.log('Record deleted successfully');
        if (Object.keys(data.investments[category][year][month]).length === 0) {
            delete data.investments[category][year][month];
        }
        if (Object.keys(data.investments[category][year]).length === 0) {
            delete data.investments[category][year];
        }
        if (Object.keys(data.investments[category]).length === 0) {
            delete data.investments[category];
        }
          return docRef.update(data);
        } else {
          console.log('Record not found!');
        }
      }
    })
    .then(() => {
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

router.get('/getCompleteData', (req, res) => {
    const db = admin.firestore();
    const docPath = 'investments/investment';
    const docRef = db.doc(docPath);
  
    docRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
          res.status(404).send('Document not found');
        } else {
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
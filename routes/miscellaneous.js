const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

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
          
          if(!data.miscellaneous[category])
          {
            data.miscellaneous[category]={};
          }
          if (!data.miscellaneous[category][year]) {
            data.miscellaneous[category][year] = {};
          }
  
          if (!data.miscellaneous[category][year][month]) {
            data.miscellaneous[category][year][month] = {};
          }
          const newInvestmentKey = `investment${Object.keys(data.miscellaneous[category][year][month]).length + 1}`;
          data.miscellaneous[category][year][month][newInvestmentKey] = {
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
        if (data.miscellaneous[category][year] && data.miscellaneous[category][year][month] && data.miscellaneous[category][year][month][investmentKey]) {
          delete data.miscellaneous[category][year][month][investmentKey];
          console.log('Record deleted successfully');
        if (Object.keys(data.miscellaneous[category][year][month]).length === 0) {
            delete data.miscellaneous[category][year][month];
        }
        if (Object.keys(data.miscellaneous[category][year]).length === 0) {
            delete data.miscellaneous[category][year];
        }
        if (Object.keys(data.miscellaneous[category]).length === 0) {
            delete data.miscellaneous[category];
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

router.get("/getCompleteData", (req, res) => {
    const db = admin.firestore();
    const docPath = "investments/investment";
    const docRef = db.doc(docPath);
    
    docRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document!");
          res.status(404).send("Document not found");
        } else {
          const data = doc.data();
          const dateObject = new Date();
          const year = dateObject.getFullYear();
          const month = dateObject.toLocaleString('en-us', { month: 'long' });
          const currentYear = data.miscellaneous['currentyear'];
          const currentMonthName = data.miscellaneous['currentmonth'];
  
          if (month !== currentMonthName) {
            let sum = 0;
  
            for (const category in data.miscellaneous) {
              if (category !== "currentyear" && category !== "currentmonth" && category !== "budget") {
                const investments = data.miscellaneous[category][currentYear][currentMonthName];
                if (investments) {
                  for (const investmentKey in investments) {
                    sum += parseFloat(investments[investmentKey].amount);
                  }
                }
              }
            }
  
            const updatedBudget = parseInt(data.miscellaneous['budget']) + sum;
            data.miscellaneous['budget'] = updatedBudget;
            data.miscellaneous['currentmonth']=month;
            data.miscellaneous['currentyear']=year;

  

            docRef.update(data)
              .then(() => {
                res.status(200).json({data});
              })
              .catch((updateError) => {
                console.error("Error updating document:", updateError);
                res.status(500).send("Internal server error");
              });
          } else {
            res.status(200).json(data);
          }
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        res.status(500).send("Internal server error");
      });
  });
  

router.post("/updatebudgetamount", (req, res) => {
  const { newbudget } = req.body;
  const db = admin.firestore();
  const docPath = `investments/investment`; 
  const docRef = db.doc(docPath);
  docRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document!");
        res.status(404).send("Document not found");
      } else {
        const data = doc.data();
        if (data.miscellaneous['budget']) {
          data.miscellaneous['budget']=newbudget;
          console.log("budget updated successfully");
          return docRef.update(data);
        } else {
          console.log("No budget found!");
        }
      }
    })
    .then(() => {
      return docRef.get();
    })
    .then((doc) => {
      const updatedData = doc.data();
      res.status(200).json(updatedData);
    })
    .catch((error) => {
      console.error("Error updating document:", error);
      res.status(500).send("Internal server error");
    });
});


module.exports = router;


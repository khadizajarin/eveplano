// firestore-to-csv/export-users.js

const admin = require('firebase-admin');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Initialize Firebase Admin SDK
const serviceAccount = require('./react-eveplano-firebase-adminsdk-wu7hr-9270b84390.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportCollectionToCsv(collectionName, csvColumns, csvPath) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  const records = snapshot.docs.map((doc) => {
    const data = doc.data();

    Object.keys(data).forEach((key) => {
      if (data[key] && data[key].toDate) {
        data[key] = data[key].toDate().toISOString();
      }
    });

    return data;
  });

  const csvWriter = createCsvWriter({
    path: csvPath,
    header: csvColumns,
  });

  await csvWriter.writeRecords(records);
  console.log(`${collectionName} exported to ${csvPath}`);
}


(async () => {
  await exportCollectionToCsv(
    'users',
    [
      { id: 'email', title: 'Email' },
      { id: 'displayName', title: 'Name' },
      { id: 'phoneNumber', title: 'Phone' },
      { id: 'role', title: 'Role' },
      { id: 'country', title: 'Country' },
      { id: 'division', title: 'Division' },
      { id: 'city', title: 'City' },
    ],
    './users.csv'
  );
})();
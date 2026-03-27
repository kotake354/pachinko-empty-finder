import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase Adminの初期化
const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk.json');
const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountFile);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();
const slug = 'l-shinuchi-yoshimune';

async function main() {
  const doc = await db.collection('machines').doc(slug).get();
  if (doc.exists) {
    const data = doc.data();
    console.log('--- ALL DATA ---');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('Document not found:', slug);
  }
}

main();

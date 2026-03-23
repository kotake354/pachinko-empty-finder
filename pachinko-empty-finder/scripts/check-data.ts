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
const slug = 'l-akudama-drive';

async function main() {
  const doc = await db.collection('machines').doc(slug).get();
  if (doc.exists) {
    const data = doc.data();
    console.log('--- settings ---');
    console.log('Type:', typeof data?.settings);
    console.log('IsArray:', Array.isArray(data?.settings));
    console.log('Content:', JSON.stringify(data?.settings, null, 2));
    
    console.log('\n--- ceiling ---');
    console.log('IsArray:', Array.isArray(data?.ceiling));
  } else {
    console.log('Document not found');
  }
}

main();

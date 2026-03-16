import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'fileName and contentType are required' }, { status: 400 });
    }

    // 1. 新しいユニークなファイル名を作成
    // crypto.randomUUID() を使用して拡張子付きの安全なファイル名を生成
    const uniqueFileName = `${crypto.randomUUID()}-${fileName}`;

    // 環境変数のチェック
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error('Missing R2 environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName, // 元の fileName の代わりに、ユニークにした名前を使う
      ContentType: contentType,
    });

    // 署名付きURLを生成 (例: 15分間有効)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    // フロントエンドには、署名付きURLと一緒に「実際に保存されるファイル名」も返す
    return NextResponse.json({ 
      uploadUrl: signedUrl,
      fileName: uniqueFileName
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

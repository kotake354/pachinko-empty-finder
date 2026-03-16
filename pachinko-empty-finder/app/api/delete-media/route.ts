import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export async function POST(req: NextRequest) {
    try {
        const { fileName } = await req.json();

        if (!fileName) {
            return NextResponse.json({ error: 'ファイル名が指定されていません' }, { status: 400 });
        }

        const deleteParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));

        return NextResponse.json({ message: 'ファイルが正常に削除されました' });
    } catch (error: any) {
        console.error('R2 delete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

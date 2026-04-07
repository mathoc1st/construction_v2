import type { IMinioService } from '$lib/types/minio/minio.service.types';
import {
	CopyObjectCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class MinioService implements IMinioService {
	private _client: S3Client;

	constructor(client: S3Client) {
		this._client = client;
	}

	get client(): S3Client {
		return this._client;
	}

	async generatePresignedGetUrl(
		bucketName: string,
		objectKey: string,
		expiresInSeconds?: number
	): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: bucketName,
			Key: objectKey
		});

		const url = await getSignedUrl(this._client, command, { expiresIn: expiresInSeconds || 3600 });

		return url;
	}

	async uploadImages(file: File): Promise<string> {
		const buffer = Buffer.from(await file.arrayBuffer());

		const key = `${crypto.randomUUID()}-${file.name}`;

		const command = new PutObjectCommand({
			Bucket: 'images',
			Key: key,
			Body: buffer,
			ContentType: file.type
		});

		await this._client.send(command);

		return key;
	}

	async uploadTemporaryImage(file: File): Promise<string> {
		const buffer = Buffer.from(await file.arrayBuffer());

		const key = `${crypto.randomUUID()}-${file.name}`;

		const command = new PutObjectCommand({
			Bucket: 'images',
			Key: `temp/${key}`,
			Body: buffer,
			ContentType: file.type
		});

		await this._client.send(command);

		return key;
	}

	async moveObject(
		sourceBucket: string,
		sourceKey: string,
		destinationBucket: string,
		destinationKey: string
	): Promise<void> {
		await this._client.send(
			new CopyObjectCommand({
				CopySource: `/${sourceBucket}/${sourceKey}`,
				Bucket: destinationBucket,
				Key: destinationKey
			})
		);

		await this._client.send(
			new DeleteObjectCommand({
				Bucket: sourceBucket,
				Key: sourceKey
			})
		);
	}
}

let minioService: IMinioService | null = null;

export function getMinioService(): IMinioService {
	if (!minioService) {
		const s3 = new S3Client({
			region: 'us-east-1',
			endpoint: 'http://localhost:9000',
			credentials: {
				accessKeyId: 'admin',
				secretAccessKey: 'password'
			},
			forcePathStyle: true
		});

		minioService = new MinioService(s3);
	}
	return minioService;
}

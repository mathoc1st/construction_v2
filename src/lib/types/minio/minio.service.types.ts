import type { S3Client } from '@aws-sdk/client-s3';

export interface IMinioService {
	get client(): S3Client;

	generatePresignedGetUrl(
		bucketName: string,
		objectKey: string,
		expiresInSeconds?: number
	): Promise<string>;
	uploadObject(bucketName: string, folder: string, key: string, file: File): Promise<void>;

	moveObject(
		sourceBucket: string,
		sourceKey: string,
		destinationBucket: string,
		destinationKey: string
	): Promise<void>;
}

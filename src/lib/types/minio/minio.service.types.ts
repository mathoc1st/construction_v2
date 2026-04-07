import type { S3Client } from '@aws-sdk/client-s3';

export interface IMinioService {
	get client(): S3Client;

	generatePresignedGetUrl(
		bucketName: string,
		objectKey: string,
		expiresInSeconds?: number
	): Promise<string>;

	moveObject(
		sourceBucket: string,
		sourceKey: string,
		destinationBucket: string,
		destinationKey: string
	): Promise<void>;
	uploadImages(file: File): Promise<string>;
}

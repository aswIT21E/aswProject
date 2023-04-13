import S3 from 'aws-sdk/clients/s3';

export class S3Service {
  private bucketName: string;
  private region: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private s3Client;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.region = process.env.AWS_BUCKET_REGION;
    this.accessKeyId = process.env.AWS_ACCESS_KEY;
    this.secretAccessKey = process.env.AWS_SECRET;

    this.s3Client = new S3({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  public async uploadFile(body: any): Promise<S3.ManagedUpload.SendData> {
    const uploadParams: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Body: body.data,
      Key: body.name,
    };
    const res = this.s3Client.upload(uploadParams).promise();
    return res;
  }
}

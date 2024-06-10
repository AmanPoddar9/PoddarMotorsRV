import { S3 } from 'aws-sdk';
import { promisify } from 'util';
import { parse } from 'url';
import mime from 'mime-types';

const s3 = new S3({
  accessKeyId: 'AKIAZQ3DNQ6CJUV7YGIH',
  secretAccessKey: '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',
  region: 'ap-south-1',
});
const parseRequestBody = async (req) => {
  const buffers = [];
  for await (const chunk of req.body) {
    buffers.push(chunk);
  }
  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
};


export async function POST(req) {
  try {

  let s3 = new S3({
    credentials: {
      accessKeyId: 'AKIAZQ3DNQ6CJUV7YGIH',
      secretAccessKey: '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',
    },
    region: 'ap-south-1',
  });

  console.log("Parsing Request Body")
  const requestObject = await parseRequestBody(req);
  console.log("Request Body Parsed. No. of Data Uris: ", Object.keys(requestObject).length)
  const allSignedUrls = []
  for (const [fileName, dataUri] of Object.entries(requestObject)) {
    await uploadDataToS3(s3, dataUri, fileName);
    const signedUrl = await gets3Url(s3, fileName);
    allSignedUrls.push({ fileName, signedUrl });
  }
console.log(allSignedUrls)
  return new Response(JSON.stringify(allSignedUrls), { status: 200 });
} catch (err) {
    // console.error(err.response.data);
    return new Response(JSON.stringify({ error: 'Error generating pre-signed URLs' }), { status: 500 });
  }
};

const uploadDataToS3 = async (s3, data, fileName) => {
  const bucketName = 'realvaluestorage';
  let contentType = mime.lookup(fileName)
  console.log(contentType)
  await s3.upload({
    Bucket: bucketName,
    Key: fileName,
    Body: Buffer.from(data, 'base64'),
    ContentEncoding: 'base64',
    ContentType:contentType,
  }).promise();
};

const gets3Url = async (s3, objectKey) => {
  const bucketName = 'realvaluestorage';
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 604800, // 7 days in seconds
  };
  return s3.getSignedUrlPromise('getObject', params);
};
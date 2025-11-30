import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  PutObjectAclCommand,
} from '@aws-sdk/client-s3'

export async function POST(req) {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    const imagesArray = await req.json()

    const bucketName = process.env.AWS_S3_BUCKET || 'realvaluestorage'
    const uploadedURLS = []

    for (let i = 0; i < imagesArray.length; i++) {
      const { name, data } = imagesArray[i]
      const extension = name.split('.').pop()
      const key = `${Math.random().toString(36).substring(2, 15)}.${extension}`

      const params = {
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(data, 'base64'),
        ContentType: `image/${extension}`,
      }

      const command = new PutObjectCommand(params)

      await s3Client.send(command)

      const paramsACL = {
        Bucket: bucketName,
        Key: key,
        Body: Buffer.from(data, 'base64'),
        ContentType: `image/${extension}`,
        ACL: 'public-read',
      }

      const commandACL = new PutObjectAclCommand(paramsACL)

      await s3Client.send(commandACL)

      const url = `https://${bucketName}.s3.amazonaws.com/${key}`
      uploadedURLS.push(url)
    }
    console.log(uploadedURLS)
    return new Response(JSON.stringify({ urls: uploadedURLS }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 })
  }
}

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
    // Validate environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('❌ AWS credentials not found in environment variables')
      console.error('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'MISSING')
      console.error('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'MISSING')
      return new Response(
        JSON.stringify({ 
          error: 'AWS credentials not configured. Please contact administrator.' 
        }), 
        { status: 500 }
      )
    }

    console.log('✅ AWS credentials found, initializing S3 client...')

    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })

    const imagesArray = await req.json()
    console.log(`📸 Uploading ${imagesArray.length} images...`)

    const bucketName = process.env.AWS_S3_BUCKET || 'realvaluestorage'
    const uploadedURLS = []

    for (let i = 0; i < imagesArray.length; i++) {
      const { name, data } = imagesArray[i]
      const extension = name.split('.').pop()
      const key = `${Math.random().toString(36).substring(2, 15)}.${extension}`

      console.log(`Uploading image ${i + 1}/${imagesArray.length}: ${name}`)

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
        ACL: 'public-read',
      }

      const commandACL = new PutObjectAclCommand(paramsACL)
      await s3Client.send(commandACL)

      const url = `https://${bucketName}.s3.amazonaws.com/${key}`
      uploadedURLS.push(url)
      console.log(`✅ Uploaded: ${url}`)
    }
    
    console.log(`✅ All ${uploadedURLS.length} images uploaded successfully`)
    return new Response(JSON.stringify({ urls: uploadedURLS }), { status: 200 })
  } catch (err) {
    console.error('❌ Error uploading to S3:', err)
    console.error('Error details:', err.message)
    console.error('Error code:', err.Code)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to upload images to S3', 
        details: err.message 
      }), 
      { status: 500 }
    )
  }
}

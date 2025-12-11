/**
 * Migration script to move local Directus files to Supabase Storage
 *
 * This script:
 * 1. Reads all files from local Directus uploads folder
 * 2. Uploads them to Supabase S3-compatible storage
 * 3. Outputs SQL to update the database records
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configuration from Directus .env
const S3_CONFIG = {
  endpoint: 'https://rcnrmnwmhfqxcovixwms.supabase.co/storage/v1/s3',
  region: 'eu-central-1',
  credentials: {
    accessKeyId: '2153835fe65756c6d1f30546c69fa81d',
    secretAccessKey: 'ad1ce100cc275ab00887a4b4f4991b7f2aa75bbc784d884ba5d502f2d9c33556',
  },
  bucket: 'media',
  forcePathStyle: true,
};

const UPLOADS_DIR = path.join(__dirname, '../../directus-cms/uploads');

// Get content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
  };
  return types[ext] || 'application/octet-stream';
}

async function migrateFiles() {
  // Create S3 client
  const s3 = new S3Client({
    endpoint: S3_CONFIG.endpoint,
    region: S3_CONFIG.region,
    credentials: S3_CONFIG.credentials,
    forcePathStyle: S3_CONFIG.forcePathStyle,
  });

  // Get list of files in uploads directory
  const files = fs.readdirSync(UPLOADS_DIR);

  // Filter to only original files (not transformations which have __)
  const originalFiles = files.filter(f => !f.includes('__'));

  console.log(`Found ${originalFiles.length} original files to migrate`);

  for (const filename of originalFiles) {
    const filePath = path.join(UPLOADS_DIR, filename);

    // Skip directories
    if (fs.statSync(filePath).isDirectory()) continue;

    console.log(`\nMigrating: ${filename}`);

    try {
      // Read file
      const fileBuffer = fs.readFileSync(filePath);
      const contentType = getContentType(filename);

      // Upload to Supabase S3
      const command = new PutObjectCommand({
        Bucket: S3_CONFIG.bucket,
        Key: filename,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await s3.send(command);
      console.log(`  ✓ Uploaded to Supabase`);

      // Extract UUID from filename (format: uuid.ext)
      const uuid = filename.replace(/\.[^/.]+$/, '');

      // Log the UUID for manual database update
      console.log(`  → UUID: ${uuid} - needs DB update to storage='supabase'`);

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }

  console.log('\n\nMigration complete!');
  console.log('Next step: Update database records to change storage from "local" to "supabase"');
  console.log('Run this SQL in Supabase:');
  console.log('UPDATE directus_files SET storage = \'supabase\' WHERE storage = \'local\';');
}

migrateFiles().catch(console.error);

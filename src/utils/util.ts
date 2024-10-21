import * as sharp from 'sharp';

async function processImage(imageBuffer: Buffer): Promise<string> {
  const resizedImage = await sharp(imageBuffer)
    .resize(500, 500, {
      fit: sharp.fit.cover, // Mantém o aspecto 1:1 (quadrado)
    })
    .toBuffer();

  const imageBase64 = resizedImage.toString('base64');

  const photoUrl = `https://simulated-storage-url/${imageBase64}.png`;
  console.log(photoUrl);

  return photoUrl;
}

export default processImage;

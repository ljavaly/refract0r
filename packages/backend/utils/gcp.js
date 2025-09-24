import { Storage } from "@google-cloud/storage";

const ASSET_BASE_URL = "https://storage.googleapis.com/refract0r-assets";
const BUCKET_NAME = "refract0r-assets";
const THUMBNAILS_PREFIX = "video_thumbnails/";

// Initialize Google Cloud Storage client
const storage = new Storage();

async function getThumbnails() {
  return new Promise(async (resolve, reject) => {
    try {
      const bucket = storage.bucket(BUCKET_NAME);

      // List all files in the thumbnails folder
      const [files] = await bucket.getFiles({
        prefix: THUMBNAILS_PREFIX,
      });

      // Filter out the folder itself and get only image files
      const thumbnailUrls = files
        .filter((file) => {
          const fileName = file.name;
          // Skip the folder itself and only include image files
          return (
            fileName !== THUMBNAILS_PREFIX &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
          );
        })
        .map((file) => {
          // Generate public URL for each file
          return `${ASSET_BASE_URL}/${file.name}`;
        });

      resolve({
        thumbnailUrls: thumbnailUrls,
        count: thumbnailUrls.length,
      });
    } catch (error) {
      console.error("Error fetching thumbnails from GCS:", error);
      reject({
        error: "Failed to fetch thumbnails from Google Cloud Storage",
        message: error.message,
      });
    }
  });
}

export { getThumbnails };

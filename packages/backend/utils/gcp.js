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
      const thumbnails = files
        .filter((file) => {
          const fileName = file.name;
          // Skip the folder itself and only include image files
          return (
            fileName !== THUMBNAILS_PREFIX &&
            /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
          );
        })
        .map((file) => {
          const fileName = file.name.split(THUMBNAILS_PREFIX)[1].split(".")[0];
          let fileId = null;

          try {
            fileId = parseInt(fileName.split("thumbnail_")[1]);
          }
          catch (error) {
            console.error("Failed to parse ID from file name:", fileName);
          }

          // Generate public URL for each file
          return {
            id: fileId,
            url: `${ASSET_BASE_URL}/${file.name}`,
          };
        });

      resolve({
        thumbnails: thumbnails,
        count: thumbnails.length,
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

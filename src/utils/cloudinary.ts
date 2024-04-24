import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvy6tahbs",
  api_key: process.env.CLOUDINARY_API_KEY || "662934167494451",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "J-zjlr9QuaV6KoQIc7yE7UD1S0M",
});

export default cloudinary;

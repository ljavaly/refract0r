// Shared configuration for Refract0r

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export const APP_CONFIG = {
  NAME: "Refract0r",
  VERSION: "1.0.0",
  DESCRIPTION: "A modern video streaming platform",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_PASSWORD_LENGTH: 8,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
};

export const FILE_UPLOADS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_FORMATS: ["mp4", "webm", "avi", "mov"],
  ALLOWED_IMAGE_FORMATS: ["jpg", "jpeg", "png", "gif", "webp"],
};

export const CACHE = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_ITEMS: 1000,
};

export const SECURITY = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

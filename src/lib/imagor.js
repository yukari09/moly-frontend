/**
 * Builds a URL path for our internal image proxy API route.
 * This function is safe to use on the client side.
 * @param {string} imagePath The path of the image in storage (e.g., 'avatars/user-id/file.jpg').
 * @param {object} [options] Processing options.
 * @param {number} [options.width=0] The target width.
 * @param {number} [options.height=0] The target height.
 * @param {boolean} [options.smart=false] Use smart cropping.
 * @param {Array<string>} [options.filters=[]] Array of filters, e.g., ['quality(85)'].
 * @returns {string} The path for our internal API.
 */
export function buildImageUrl(imagePath, options = {}) {
  if (!imagePath) {
    return "";
  }

  const {
    width = 0,
    height = 0,
    smart = false,
    filters = [],
  } = options;

  let pathParts = [];

  if (width > 0 || height > 0) {
    pathParts.push(`${width}x${height}`);
  }

  if (smart) {
    pathParts.push('smart');
  }

  if (filters.length > 0) {
    pathParts.push(`filters:${filters.join(':')}`);
  }

  pathParts.push(imagePath);

  return `/api/images/${pathParts.join('/')}`;
}

// This function is intended for SERVER-SIDE USE ONLY.
import crypto from 'crypto';

const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;
const imagorSecret = process.env.IMAGOR_SECRET_KEY;

/**
 * Builds a secure Imagor URL with HMAC signature.
 */
export function buildImagorUrl(imagePath, options = {}) {
  if (!imageHost || !imagePath) {
    return "";
  }

  const {
    width = 0,
    height = 0,
    fitIn = '',
    smart = false,
    filters = [],
  } = options;

  let path = '';

  if (fitIn) {
    path += 'fit-in/';
  }
  
  path += `${width}x${height}/`;

  if (smart) {
    path += 'smart/';
  }

  if (filters.length > 0) {
    path += `filters:${filters.join(':')}/`;
  }

  path += imagePath;

  if (!imagorSecret) {
    return `${imageHost}/unsafe/${path}`;
  }

  const hmac = crypto.createHmac('sha1', imagorSecret);
  hmac.update(path);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_');

  return `${imageHost}/${signature}/${path}`;
}

import crypto from 'crypto';

const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;
const imagorSecret = process.env.IMAGOR_SECRET_KEY;

/**
 * Builds a secure Imagor URL with HMAC signature.
 * This function is intended for SERVER-SIDE USE ONLY.
 * @param {string} imagePath The path of the image in storage (e.g., 'avatars/user-id/file.jpg').
 * @param {object} [options] Processing options.
 * @param {number} [options.width=0] The target width.
 * @param {number} [options.height=0] The target height.
 * @param {string} [options.fitIn=''] Fit-in option, e.g., 'fit-in'.
 * @param {boolean} [options.smart=false] Use smart cropping.
 * @param {Array<string>} [options.filters=[]] Array of filters, e.g., ['quality(85)'].
 * @returns {string} The full, signed Imagor URL.
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
    // If no secret is provided, return an "unsafe" URL.
    // This is useful for local development if Imagor is run without a secret.
    return `${imageHost}/unsafe/${path}`;
  }

  const hmac = crypto.createHmac('sha1', imagorSecret);
  hmac.update(path);
  const signature = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_');

  return `${imageHost}/${signature}/${path}`;
}
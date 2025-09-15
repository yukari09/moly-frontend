import logger from './logger';
import { Client } from '@elastic/elasticsearch';

if (!process.env.ELASTICSEARCH_NODE) {
  logger.error('ELASTICSEARCH_NODE environment variable is not set.');
}
if (!process.env.ELASTICSEARCH_USERNAME) {
  logger.error('ELASTICSEARCH_USERNAME environment variable is not set.');
}
if (!process.env.ELASTICSEARCH_PASSWORD) {
  logger.error('ELASTICSEARCH_PASSWORD environment variable is not set.');
}

const clientSingleton = () => {
  return new Client({
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
    // If you are using a self-signed certificate with a local instance,
    // you might need to uncomment the following lines:
    // tls: {
    //   rejectUnauthorized: false
    // }
  });
};

const globalForElastic = globalThis;
const client = globalForElastic.elasticClient ?? clientSingleton();

export default client;

if (process.env.NODE_ENV !== 'production') globalForElastic.elasticClient = client;

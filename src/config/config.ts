export default {
  environment: {
    nodeEnv: {
      doc: 'The Node Environment',
      format: 'String',
      default: 'development',
      nullable: false,
      env: 'NODE_ENV',
    },
    port: {
      doc: 'The API listening port. By default is 5000',
      format: 'Number',
      default: 0,
      nullable: true,
      env: 'PORT',
    },
    host: {
      doc: 'Server Host.',
      format: 'String',
      default: 'localhost',
      nullable: true,
      env: 'HOST',
    },
  },
  DB: {
    url: {
      doc: 'The DB cluster URL',
      format: 'String',
      default: 'localhost',
      nullable: false,
      env: 'MONGO_URL',
    },
    testUrl: {
      doc: 'The DB Testing cluster URL',
      format: 'String',
      default: 'localhost',
      nullable: false,
      env: 'MONGO_TEST_URL',
    },
  },
  hashing: {
    salt: {
      doc: 'Hashing Salt',
      format: 'Number',
      default: 10,
      nullable: false,
      env: 'SALT',
    },
    jwtSecret: {
      doc: 'JWT Secret Key',
      format: 'String',
      default: 'mysecret',
      nullable: false,
      env: 'JWT_SECRET',
    },
  },
  mailer: {
    key: {
      doc: 'Google Mailing Services Key',
      format: 'String',
      default: '',
      nullable: false,
      env: 'EMAIL_KEY',
    },
    user: {
      doc: 'Google Mailing Services User',
      format: 'String',
      default: '',
      nullable: false,
      env: 'EMAIL_USER',
    },
  },
  cloudinary: {
    cloudName: {
      doc: 'Cloudinary Cloud Name',
      format: 'String',
      default: '',
      nullable: false,
      env: 'CLOUD_NAME',
    },
    apiKey: {
      doc: 'Cloudinary API Key',
      format: 'String',
      default: '',
      nullable: false,
      env: 'CLOUDINARY_API_KEY',
    },
    apiSecret: {
      doc: 'Cloudinary API Secret',
      format: 'String',
      default: '',
      nullable: false,
      env: 'CLOUDINARY_API_SECRET',
    },
  },
  paymob: {
    apiKey: {
      doc: 'paymob API key',
      format: 'String',
      default: '',
      nullable: false,
      env: 'PAYMOB_API_KEY',
    },
    mobileWalletIntegrationId: {
      doc: 'Mobile Walled Integration Id',
      format: 'Number',
      default: '',
      nullable: false,
      env: 'PAYMOB_MOBILE_WALLET_INTEGRATION_ID',
    },
    creditCardIntegrationId: {
      doc: 'Credit Card Integration Id',
      format: 'Number',
      default: '',
      nullable: false,
      env: 'PAYMOB_CREDIT_CARD_INTEGRATION_ID',
    },
    frameId: {
      doc: 'Frame Id',
      format: 'Number',
      default: '',
      nullable: false,
      env: 'PAYMOB_FRAME_ID',
    },
    mobileWalletNumber: {
      doc: 'Mobile Wallet Number',
      format: 'Number',
      default: '',
      nullable: false,
      env: 'PAYMOB_MOBILE_WALLET_NUMBER',
    },
    hmacSecret: {
      doc: 'HMAC secret',
      format: 'String',
      default: '',
      nullable: false,
      env: 'HMAC_Secret',
    },
    publicKey: {
      doc: 'public Key',
      format: 'String',
      default: '',
      nullable: false,
      env: 'publicKey',
    },
    secretKey: {
      doc: 'secret Key',
      format: 'String',
      default: '',
      nullable: false,
      env: 'secretKey',
    },
  },
};

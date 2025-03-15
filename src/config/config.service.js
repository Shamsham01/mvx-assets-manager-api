const { NetworkConfig } = require('@multiversx/sdk-network-providers');
const { NetworkConfig, normalizeNetworkConfig } = require('../types/network');
const { AppError } = require('../utils/errors');
const { environmentService } = require('./environment.config');
const { pemService } = require('./pem.config');

class ConfigService {
  private config: Config;

  constructor() {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      network: {
        chainId: process.env.CHAIN === 'mainnet' ? '1' : 'T',
        ChainID: process.env.CHAIN === 'mainnet' ? '1' : 'T',
        MinGasLimit,
        MinGasPrice,
        GasPerDataByte: 1500
      },
      apiProvider: process.env.API_PROVIDER || 'https://api.multiversx.com',
      port: parseInt(process.env.PORT || '3000', 10),
      apiKey: process.env.API_KEY || 'default-key',
      security: {
        apiKeyHeader: process.env.API_KEY_HEADER || 'x-api-key',
        apiKeys: (process.env.API_KEYS || '').split(',').filter(key => key),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        cors: {
          enabled: process.env.CORS_ENABLED === 'true',
          origin: (process.env.CORS_ORIGIN || '*').split(','),
          methods: (process.env.CORS_METHODS || 'GET,POST').split(',')
        }
      }
    };
  }

  public getEnvironment() {
    return this.config.environment;
  }

  public getNetwork() {
    return this.config.network;
  }

  public getSdkNetwork() {
    return normalizeNetworkConfig(this.config.network);
  }

  public getApiProvider() {
    return this.config.apiProvider;
  }

  public getPort() {
    return this.config.port;
  }

  public getApiKey() {
    return this.config.apiKey;
  }

  public getSecurity() {
    return this.config.security;
  }

  public getConfig() {
    return this.config;
  }

  public validateConfig() {
    const { security } = this.config;

    if (!security.apiKeys.length) {
      throw new AppError('INTERNAL_ERROR', 'No API keys configured');
    }

    // PEM validation is handled by PemService
  }

  public reloadConfig() {
    pemService.reloadPem();
  }
}

const configService = new ConfigService();
module.exports = configService; 
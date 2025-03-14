import { NetworkConfig as SdkNetworkConfig } from '@multiversx/sdk-network-providers';
import { NetworkConfig, normalizeNetworkConfig } from '../types/network';
import { AppError } from '../utils/errors';
import { environmentService } from './environment.config';
import { pemService } from './pem.config';

export interface Config {
  environment: string;
  network: NetworkConfig;
  apiProvider: string;
  port: number;
  apiKey: string;
  security: SecurityConfig;
}

export interface SecurityConfig {
  apiKeyHeader: string;
  apiKeys: string[];
  rateLimitWindow: number;
  rateLimitMax: number;
  cors: {
    enabled: boolean;
    origin: string[];
    methods: string[];
  };
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  network: NetworkConfig;
  security: SecurityConfig;
  pemFilePath: string;
  pemContent: string;
}

export class ConfigService {
  private config: Config;

  constructor() {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      network: {
        chainId: process.env.CHAIN === 'mainnet' ? '1' : 'T',
        ChainID: process.env.CHAIN === 'mainnet' ? '1' : 'T',
        MinGasLimit: 50000,
        MinGasPrice: 1000000000,
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

  public getEnvironment(): string {
    return this.config.environment;
  }

  public getNetwork(): NetworkConfig {
    return this.config.network;
  }

  public getSdkNetwork(): SdkNetworkConfig {
    return normalizeNetworkConfig(this.config.network);
  }

  public getApiProvider(): string {
    return this.config.apiProvider;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getApiKey(): string {
    return this.config.apiKey;
  }

  public getSecurity(): SecurityConfig {
    return this.config.security;
  }

  public getConfig(): Config {
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

export const configService = new ConfigService();
export default configService; 
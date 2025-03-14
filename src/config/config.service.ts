import { NetworkConfig } from '@multiversx/sdk-network-providers';
import { ApiError } from '../utils/errors';
import { environmentService } from './environment.config';
import { pemService } from './pem.config';

export interface Config {
  environment: string;
  network: NetworkConfig;
  apiProvider: string;
  port: number;
  apiKey: string;
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
        minGasLimit: 50000,
        minGasPrice: 1000000000,
        gasPerDataByte: 1500
      },
      apiProvider: process.env.API_PROVIDER || 'https://api.multiversx.com',
      port: parseInt(process.env.PORT || '3000', 10),
      apiKey: process.env.API_KEY || 'default-key'
    };
  }

  public getEnvironment(): string {
    return this.config.environment;
  }

  public getNetwork(): NetworkConfig {
    return this.config.network;
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

  public getConfig(): Config {
    return this.config;
  }

  public validateConfig() {
    const { security } = this.config;

    if (!security.apiKeys.length) {
      throw new ApiError('CONFIG_ERROR', 'No API keys configured');
    }

    // PEM validation is handled by PemService
  }

  public reloadConfig() {
    pemService.reloadPem();
  }
}

export const configService = new ConfigService();
export default configService; 
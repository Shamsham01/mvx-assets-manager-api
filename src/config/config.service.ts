import { ApiError } from '../utils/errors';
import { environmentService } from './environment.config';
import { pemService } from './pem.config';

export interface NetworkConfig {
  chainId: string;
  apiUrl: string;
  gatewayUrl: string;
  explorerUrl: string;
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

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.initializeConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private initializeConfig() {
    const env = environmentService.getConfig();
    const pem = pemService.getConfig();
    
    this.config = {
      port: parseInt(process.env.PORT || '3000', 10),
      environment: env.isDevelopment ? 'development' : env.isProduction ? 'production' : 'test',
      network: this.getNetworkConfig(env.isDevelopment || env.isTest),
      security: {
        apiKeyHeader: process.env.API_KEY_HEADER || 'x-api-key',
        apiKeys: (process.env.API_KEYS || '').split(',').filter(key => key),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        cors: {
          enabled: process.env.CORS_ENABLED === 'true',
          origin: (process.env.CORS_ORIGIN || '*').split(','),
          methods: (process.env.CORS_METHODS || 'GET,POST').split(',')
        }
      },
      pemFilePath: pem.pemPath,
      pemContent: pem.pemContent
    };
  }

  private getNetworkConfig(isTestEnvironment: boolean): NetworkConfig {
    return {
      chainId: isTestEnvironment ? 'T' : '1',
      apiUrl: isTestEnvironment 
        ? (process.env.TESTNET_API_URL || 'https://testnet-api.multiversx.com')
        : (process.env.MAINNET_API_URL || 'https://api.multiversx.com'),
      gatewayUrl: isTestEnvironment
        ? (process.env.TESTNET_GATEWAY_URL || 'https://testnet-gateway.multiversx.com')
        : (process.env.MAINNET_GATEWAY_URL || 'https://gateway.multiversx.com'),
      explorerUrl: isTestEnvironment
        ? (process.env.TESTNET_EXPLORER_URL || 'https://testnet-explorer.multiversx.com')
        : (process.env.MAINNET_EXPLORER_URL || 'https://explorer.multiversx.com')
    };
  }

  public getConfig(): AppConfig {
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
    this.initializeConfig();
  }
}

export const configService = ConfigService.getInstance();
export default configService; 
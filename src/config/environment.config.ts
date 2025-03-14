import path from 'path';
import dotenv from 'dotenv';
import { ApiError } from '../utils/errors';

export interface EnvironmentConfig {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  envFile: string;
}

class EnvironmentService {
  private static instance: EnvironmentService;
  private config: EnvironmentConfig;

  private constructor() {
    this.initializeConfig();
  }

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  private initializeConfig() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFile = this.getEnvFile(nodeEnv);

    // Load environment file
    const envConfig = dotenv.config({
      path: envFile
    });

    if (envConfig.error) {
      throw new ApiError('CONFIG_ERROR', `Error loading environment file: ${envConfig.error.message}`);
    }

    this.config = {
      isDevelopment: nodeEnv === 'development',
      isProduction: nodeEnv === 'production',
      isTest: nodeEnv === 'test',
      envFile
    };
  }

  private getEnvFile(environment: string): string {
    const envFiles = {
      development: '.env.development',
      production: '.env.production',
      test: '.env.test'
    };

    const defaultEnvFile = '.env';
    const envFile = envFiles[environment] || defaultEnvFile;

    return path.resolve(process.cwd(), envFile);
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }
}

export const environmentService = EnvironmentService.getInstance();
export default environmentService; 
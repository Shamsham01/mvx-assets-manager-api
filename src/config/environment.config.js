const path = require('path');
const dotenv = require('dotenv');
const { AppError } = require('../utils/errors');

class EnvironmentService {
  private static instance: EnvironmentService;
  private config: EnvironmentConfig;

  private constructor() {
    this.initializeConfig();
  }

  public static getInstance() {
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
      throw new AppError('CONFIG_ERROR', `Error loading environment file: ${envConfig.error.message}`);
    }

    this.config = {
      isDevelopment === 'development',
      isProduction === 'production',
      isTest === 'test',
      envFile
    };
  }

  private getEnvFile(environment) {
    const envFiles = {
      development: '.env.development',
      production: '.env.production',
      test: '.env.test'
    };

    const defaultEnvFile = '.env';
    const envFile = envFiles[environment] || defaultEnvFile;

    return path.resolve(process.cwd(), envFile);
  }

  public getConfig() {
    return this.config;
  }
}

const environmentService = EnvironmentService.getInstance();
module.exports = environmentService; 
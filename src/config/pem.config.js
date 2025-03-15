const fs = require('fs');
const path = require('path');
const { AppError } = require('../utils/errors');
const { environmentService } = require('./environment.config');

class PemService {
  private static instance: PemService;
  private config: PemConfig;

  private constructor() {
    this.initializeConfig();
  }

  public static getInstance() {
    if (!PemService.instance) {
      PemService.instance = new PemService();
    }
    return PemService.instance;
  }

  private initializeConfig() {
    const pemPath = this.resolvePemPath();
    const pemContent = this.loadPemFile(pemPath);

    this.config = {
      pemContent,
      pemPath
    };
  }

  private resolvePemPath() {
    const pemPath = process.env.PEM_FILE_PATH;
    
    if (!pemPath) {
      throw new AppError('CONFIG_ERROR', 'PEM file path not configured');
    }

    // If path is absolute, use it (path.isAbsolute(pemPath)) {
      return pemPath;
    }

    // If path is relative, resolve it from the project root
    return path.resolve(process.cwd(), pemPath);
  }

  private loadPemFile(pemPath) {
    try {
      // Check if file exists
      if (!fs.existsSync(pemPath)) {
        throw new AppError('CONFIG_ERROR', `PEM file not found at path: ${pemPath}`);
      }

      // Read file content
      const content = fs.readFileSync(pemPath, 'utf8');

      // Validate PEM format
      if (!this.isValidPemFormat(content)) {
        throw new AppError('CONFIG_ERROR', 'Invalid PEM file format');
      }

      return content;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('CONFIG_ERROR', `Error loading PEM file: ${error.message}`);
    }
  }

  private isValidPemFormat(content) {
    // Basic PEM format validation
    const pemRegex = /^-----BEGIN PRIVATE KEY-----\n[\s\S]*\n-----END PRIVATE KEY-----\n?$/;
    return pemRegex.test(content);
  }

  public getConfig() {
    return this.config;
  }

  public reloadPem() {
    this.initializeConfig();
  }
}

const pemService = PemService.getInstance();
module.exports = pemService; 
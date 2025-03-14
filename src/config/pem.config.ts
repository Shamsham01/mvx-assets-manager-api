import fs from 'fs';
import path from 'path';
import { ApiError } from '../utils/errors';
import { environmentService } from './environment.config';

export interface PemConfig {
  pemContent: string;
  pemPath: string;
}

class PemService {
  private static instance: PemService;
  private config: PemConfig;

  private constructor() {
    this.initializeConfig();
  }

  public static getInstance(): PemService {
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

  private resolvePemPath(): string {
    const pemPath = process.env.PEM_FILE_PATH;
    
    if (!pemPath) {
      throw new ApiError('CONFIG_ERROR', 'PEM file path not configured');
    }

    // If path is absolute, use it as is
    if (path.isAbsolute(pemPath)) {
      return pemPath;
    }

    // If path is relative, resolve it from the project root
    return path.resolve(process.cwd(), pemPath);
  }

  private loadPemFile(pemPath: string): string {
    try {
      // Check if file exists
      if (!fs.existsSync(pemPath)) {
        throw new ApiError('CONFIG_ERROR', `PEM file not found at path: ${pemPath}`);
      }

      // Read file content
      const content = fs.readFileSync(pemPath, 'utf8');

      // Validate PEM format
      if (!this.isValidPemFormat(content)) {
        throw new ApiError('CONFIG_ERROR', 'Invalid PEM file format');
      }

      return content;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('CONFIG_ERROR', `Error loading PEM file: ${error.message}`);
    }
  }

  private isValidPemFormat(content: string): boolean {
    // Basic PEM format validation
    const pemRegex = /^-----BEGIN PRIVATE KEY-----\n[\s\S]*\n-----END PRIVATE KEY-----\n?$/;
    return pemRegex.test(content);
  }

  public getConfig(): PemConfig {
    return this.config;
  }

  public reloadPem(): void {
    this.initializeConfig();
  }
}

export const pemService = PemService.getInstance();
export default pemService; 
import fs from 'fs';
import { UserSigner } from '@multiversx/sdk-wallet/out';
import { WalletError } from './errors';
import { configService } from '../config/config.service';

class WalletManager {
  private static instance: WalletManager;
  private signer: UserSigner | null = null;

  private constructor() {}

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  public async initialize() {
    const { pemFilePath } = configService.getConfig();
    
    if (!pemFilePath) {
      throw new WalletError('PEM file path not configured');
    }

    try {
      const pemContent = await fs.promises.readFile(pemFilePath, { encoding: 'utf-8' });
      this.signer = UserSigner.fromPem(pemContent);
    } catch (error: any) {
      throw new WalletError(`Failed to load PEM file: ${error.message}`);
    }
  }

  public getSigner(): UserSigner {
    if (!this.signer) {
      throw new WalletError('Wallet not initialized');
    }
    return this.signer;
  }

  public getAddress(): string {
    return this.getSigner().getAddress().bech32();
  }
}

export const walletManager = WalletManager.getInstance();
export default walletManager; 
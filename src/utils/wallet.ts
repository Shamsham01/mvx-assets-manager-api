import { UserSigner } from '@multiversx/sdk-wallet';
import { AppError } from './errors';

export class WalletManager {
  private walletPem: string | null = null;
  private signer: UserSigner | null = null;

  public initialize(): void {
    // Initialize wallet manager
    this.walletPem = null;
    this.signer = null;
  }

  public setWalletPem(pem: string): void {
    try {
      const signer = UserSigner.fromPem(pem);
      this.walletPem = pem;
      this.signer = signer;
    } catch (error) {
      throw new AppError('UNAUTHORIZED', 'Invalid PEM file');
    }
  }

  public getWalletPem(): string {
    if (!this.walletPem) {
      throw new AppError('UNAUTHORIZED', 'No wallet PEM set');
    }
    return this.walletPem;
  }

  public getSigner(): UserSigner {
    if (!this.signer) {
      throw new AppError('UNAUTHORIZED', 'No signer available');
    }
    return this.signer;
  }

  public clear(): void {
    this.walletPem = null;
    this.signer = null;
  }
}

export const walletManager = new WalletManager(); 
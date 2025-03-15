const { UserSigner } = require('@multiversx/sdk-wallet');
const { AppError } = require('./errors');

class WalletManager {
  private walletPem = null;
  private signer = null;

  public initialize() {
    // Initialize wallet manager
    this.walletPem = null;
    this.signer = null;
  }

  public setWalletPem(pem) {
    try {
      const signer = UserSigner.fromPem(pem);
      this.walletPem = pem;
      this.signer = signer;
    } catch (error) {
      throw new AppError('UNAUTHORIZED', 'Invalid PEM file');
    }
  }

  public getWalletPem() {
    if (!this.walletPem) {
      throw new AppError('UNAUTHORIZED', 'No wallet PEM set');
    }
    return this.walletPem;
  }

  public getSigner() {
    if (!this.signer) {
      throw new AppError('UNAUTHORIZED', 'No signer available');
    }
    return this.signer;
  }

  public clear() {
    this.walletPem = null;
    this.signer = null;
  }
}

const walletManager = new WalletManager(); 
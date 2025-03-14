import { NetworkConfig as SdkNetworkConfig } from '@multiversx/sdk-network-providers';

export interface NetworkConfig extends Partial<SdkNetworkConfig> {
  chainId?: string; // Compatibility with older code
  ChainID?: string; // SDK format
}

// Adapt our config format to SDK format
export function normalizeNetworkConfig(config: NetworkConfig): SdkNetworkConfig {
  return {
    ChainID: config.chainId || config.ChainID || 'T',
    MinGasLimit: config.minGasLimit || 50000,
    MinGasPrice: config.minGasPrice || 1000000000,
    GasPerDataByte: config.gasPerDataByte || 1500
  };
} 
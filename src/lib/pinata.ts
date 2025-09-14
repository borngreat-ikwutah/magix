import { PinataSDK } from "pinata-web3";

class PinataStorage {
  private pinata: PinataSDK;

  constructor() {
    const jwt = import.meta.env.VITE_PINATA_JWT;
    if (!jwt) {
      throw new Error("VITE_PINATA_JWT environment variable is required");
    }

    this.pinata = new PinataSDK({
      pinataJwt: jwt,
      pinataGateway: "gateway.pinata.cloud", // Free gateway
    });
  }

  /**
   * Upload campaign image to Pinata IPFS
   */
  async uploadCampaignImage(
    file: File,
    campaignId: string,
  ): Promise<{
    ipfsHash: string;
    url: string;
    size: number;
    filename: string;
  }> {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const filename = `campaign-${campaignId}-${timestamp}.${extension}`;

      // Upload to Pinata
      const upload = await this.pinata.upload.file(file).addMetadata({
        name: filename,
        keyValues: {
          campaignId: campaignId,
          type: "campaign-image",
          uploadedAt: new Date().toISOString(),
        },
      });

      return {
        ipfsHash: upload.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
        size: file.size,
        filename: filename,
      };
    } catch (error: any) {
      console.error("Pinata upload failed:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload campaign metadata as JSON
   */
  async uploadCampaignMetadata(metadata: {
    campaignId: string;
    title: string;
    description: string;
    imageHash: string;
    creator: string;
    goalAmount: string;
    deadline: string;
  }): Promise<{
    ipfsHash: string;
    url: string;
  }> {
    try {
      const upload = await this.pinata.upload.json(metadata).addMetadata({
        name: `campaign-${metadata.campaignId}-metadata`,
        keyValues: {
          campaignId: metadata.campaignId,
          type: "campaign-metadata",
          creator: metadata.creator,
        },
      });

      return {
        ipfsHash: upload.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`,
      };
    } catch (error: any) {
      console.error("Pinata metadata upload failed:", error);
      throw new Error(`Failed to upload metadata:. ${error}`);
    }
  }

  /**
   * Get file URL with multiple gateway fallbacks
   */
  getFileUrl(ipfsHash: string): string[] {
    return [
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
      `https://dweb.link/ipfs/${ipfsHash}`,
    ];
  }

  /**
   * Get optimized image URL (Pinata's image optimization)
   */
  getOptimizedImageUrl(
    ipfsHash: string,
    options: {
      width?: number;
      height?: number;
      format?: "webp" | "png" | "jpg";
    } = {},
  ): string {
    const params = new URLSearchParams();

    if (options.width) params.append("img-width", options.width.toString());
    if (options.height) params.append("img-height", options.height.toString());
    if (options.format) params.append("img-format", options.format);

    const queryString = params.toString();
    const baseUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
}

// Export singleton instance
export const pinataStorage = new PinataStorage();

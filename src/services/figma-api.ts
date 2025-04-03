import type {
  FigmaFileResponse,
  FigmaImageResponse,
  FigmaFileImagesResponse,
  FigmaNodesResponse,
  FigmaErrorResponse
} from '../types/api-types.js';

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export class FigmaAPIError extends Error {
  constructor(public response: FigmaErrorResponse) {
    super(response.err);
    this.name = 'FigmaAPIError';
  }
}

export class FigmaAPIService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'X-Figma-Token': this.accessToken,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new FigmaAPIError({
        err: data.err || 'Unknown error occurred',
        status: response.status,
      });
    }

    return data as T;
  }

  /**
   * Get file information
   * @param fileKey The file key from the Figma file URL
   * @param versionId Optional version ID to get a specific version
   * @returns File information including document, components, and styles
   */
  async getFile(fileKey: string, versionId?: string): Promise<FigmaFileResponse> {
    const versionParam = versionId ? `?version=${versionId}` : '';
    return this.fetchWithAuth<FigmaFileResponse>(`/files/${fileKey}${versionParam}`);
  }

  /**
   * Get nodes information
   * @param fileKey The file key from the Figma file URL
   * @param nodeIds Array of node IDs to get information for
   * @returns Information about the specified nodes
   */
  async getNodes(fileKey: string, nodeIds: string[]): Promise<FigmaNodesResponse> {
    const nodeIdsParam = nodeIds.join(',');
    return this.fetchWithAuth<FigmaNodesResponse>(`/files/${fileKey}/nodes?ids=${nodeIdsParam}`);
  }

  /**
   * Get image URLs for nodes
   * @param fileKey The file key from the Figma file URL
   * @param nodeIds Array of node IDs to get images for
   * @param format Optional image format (jpg, png, svg, pdf)
   * @param scale Optional scale factor (0.01 to 4)
   * @returns URLs for the specified node images
   */
  async getImages(
    fileKey: string,
    nodeIds: string[],
    format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png',
    scale: number = 1
  ): Promise<FigmaImageResponse> {
    const nodeIdsParam = nodeIds.join(',');
    const params = new URLSearchParams({
      ids: nodeIdsParam,
      format,
      scale: scale.toString(),
    });
    return this.fetchWithAuth<FigmaImageResponse>(`/images/${fileKey}?${params}`);
  }

  /**
   * Get image fills information
   * @param fileKey The file key from the Figma file URL
   * @returns Information about image fills in the file
   */
  async getFileImages(fileKey: string): Promise<FigmaFileImagesResponse> {
    return this.fetchWithAuth<FigmaFileImagesResponse>(`/files/${fileKey}/images`);
  }

  /**
   * Get component information
   * @param fileKey The file key from the Figma file URL
   * @param componentId The component ID
   * @returns Component information
   */
  async getComponent(fileKey: string, componentId: string): Promise<FigmaFileResponse> {
    return this.fetchWithAuth<FigmaFileResponse>(`/files/${fileKey}/components/${componentId}`);
  }

  /**
   * Get component set information
   * @param fileKey The file key from the Figma file URL
   * @param componentSetId The component set ID
   * @returns Component set information
   */
  async getComponentSet(fileKey: string, componentSetId: string): Promise<FigmaFileResponse> {
    return this.fetchWithAuth<FigmaFileResponse>(`/files/${fileKey}/component_sets/${componentSetId}`);
  }

  /**
   * Get style information
   * @param fileKey The file key from the Figma file URL
   * @param styleId The style ID
   * @returns Style information
   */
  async getStyle(fileKey: string, styleId: string): Promise<FigmaFileResponse> {
    return this.fetchWithAuth<FigmaFileResponse>(`/files/${fileKey}/styles/${styleId}`);
  }
} 
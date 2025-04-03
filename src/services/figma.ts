import fs from "fs";
import { parseFigmaResponse, SimplifiedDesign } from "./simplify-node-response.js";
import type {
  GetImagesResponse,
  GetFileResponse,
  GetFileNodesResponse,
  GetImageFillsResponse,
} from "@figma/rest-api-spec";
import { downloadFigmaImage } from "~/utils/common.js";
import { Logger } from "~/server.js";
import { FigmaAPIService } from './figma-api.js';
import type { Node, Component, ComponentSet, Style } from '../types/node-types.js';

export interface FigmaError {
  status: number;
  err: string;
}

type FetchImageParams = {
  /**
   * The Node in Figma that will either be rendered or have its background image downloaded
   */
  nodeId: string;
  /**
   * The local file name to save the image
   */
  fileName: string;
  /**
   * The file mimetype for the image
   */
  fileType: "png" | "svg";
};

type FetchImageFillParams = Omit<FetchImageParams, "fileType"> & {
  /**
   * Required to grab the background image when an image is used as a fill
   */
  imageRef: string;
};

export class FigmaService {
  private api: FigmaAPIService;
  private readonly baseUrl = "https://api.figma.com/v1";
  private readonly apiKey: string;

  constructor(accessToken: string) {
    this.apiKey = accessToken;
    this.api = new FigmaAPIService(accessToken);
  }

  /**
   * Get file information
   * @param fileKey The file key from the Figma file URL
   * @param versionId Optional version ID to get a specific version
   * @returns File information including document, components, and styles
   */
  async getFile(fileKey: string, versionId?: string) {
    return this.api.getFile(fileKey, versionId);
  }

  /**
   * Get node information
   * @param fileKey The file key from the Figma file URL
   * @param nodeId The node ID to get information for
   * @returns Information about the specified node
   */
  async getNode(fileKey: string, nodeId: string): Promise<Node> {
    const response = await this.api.getNodes(fileKey, [nodeId]);
    return response.nodes[nodeId];
  }

  /**
   * Get multiple nodes information
   * @param fileKey The file key from the Figma file URL
   * @param nodeIds Array of node IDs to get information for
   * @returns Information about the specified nodes
   */
  async getNodes(fileKey: string, nodeIds: string[]): Promise<Node[]> {
    const response = await this.api.getNodes(fileKey, nodeIds);
    return nodeIds.map(id => response.nodes[id]);
  }

  /**
   * Get image URL for a node
   * @param fileKey The file key from the Figma file URL
   * @param nodeId The node ID to get image for
   * @param format Optional image format (jpg, png, svg, pdf)
   * @param scale Optional scale factor (0.01 to 4)
   * @returns URL for the specified node image
   */
  async getNodeImage(
    fileKey: string,
    nodeId: string,
    format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png',
    scale: number = 1
  ): Promise<string> {
    const response = await this.api.getImages(fileKey, [nodeId], format, scale);
    return response.images[nodeId];
  }

  /**
   * Get image URLs for multiple nodes
   * @param fileKey The file key from the Figma file URL
   * @param nodeIds Array of node IDs to get images for
   * @param format Optional image format (jpg, png, svg, pdf)
   * @param scale Optional scale factor (0.01 to 4)
   * @returns URLs for the specified node images
   */
  async getNodeImages(
    fileKey: string,
    nodeIds: string[],
    format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png',
    scale: number = 1
  ): Promise<Record<string, string>> {
    const response = await this.api.getImages(fileKey, nodeIds, format, scale);
    return response.images;
  }

  /**
   * Get component information
   * @param fileKey The file key from the Figma file URL
   * @param componentId The component ID
   * @returns Component information
   */
  async getComponent(fileKey: string, componentId: string): Promise<Component> {
    const response = await this.api.getComponent(fileKey, componentId);
    return response.components.get(componentId)!;
  }

  /**
   * Get component set information
   * @param fileKey The file key from the Figma file URL
   * @param componentSetId The component set ID
   * @returns Component set information
   */
  async getComponentSet(fileKey: string, componentSetId: string): Promise<ComponentSet> {
    const response = await this.api.getComponentSet(fileKey, componentSetId);
    return response.componentSets.get(componentSetId)!;
  }

  /**
   * Get style information
   * @param fileKey The file key from the Figma file URL
   * @param styleId The style ID
   * @returns Style information
   */
  async getStyle(fileKey: string, styleId: string): Promise<Style> {
    const response = await this.api.getStyle(fileKey, styleId);
    return response.styles.get(styleId)!;
  }

  /**
   * Get all components in a file
   * @param fileKey The file key from the Figma file URL
   * @returns Map of component IDs to component information
   */
  async getAllComponents(fileKey: string): Promise<Map<string, Component>> {
    const response = await this.api.getFile(fileKey);
    return response.components;
  }

  /**
   * Get all component sets in a file
   * @param fileKey The file key from the Figma file URL
   * @returns Map of component set IDs to component set information
   */
  async getAllComponentSets(fileKey: string): Promise<Map<string, ComponentSet>> {
    const response = await this.api.getFile(fileKey);
    return response.componentSets;
  }

  /**
   * Get all styles in a file
   * @param fileKey The file key from the Figma file URL
   * @returns Map of style IDs to style information
   */
  async getAllStyles(fileKey: string): Promise<Map<string, Style>> {
    const response = await this.api.getFile(fileKey);
    return response.styles;
  }

  private async request<T>(endpoint: string): Promise<T> {
    if (typeof fetch !== "function") {
      throw new Error(
        "The MCP server is being run in a Node.js environment where `fetch` is not available. You won't be able to access any data related to the Figma file.\n\nAs the coding AI assistant, PLEASE ABORT THE CURRENT REQUEST. No alternate approaches will work. Help the user fix this issue so you can proceed by letting them know that they need to run the MCP server with Node.js version 18 or higher.",
      );
    }
    try {
      Logger.log(`Calling ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "X-Figma-Token": this.apiKey,
        },
      });

      if (!response.ok) {
        throw {
          status: response.status,
          err: response.statusText || "Unknown error",
        } as FigmaError;
      }

      return await response.json();
    } catch (error) {
      if ((error as FigmaError).status) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Failed to make request to Figma API: ${error.message}`);
      }
      throw new Error(`Failed to make request to Figma API: ${error}`);
    }
  }

  async getImageFills(
    fileKey: string,
    nodes: FetchImageFillParams[],
    localPath: string,
  ): Promise<string[]> {
    if (nodes.length === 0) return [];

    let promises: Promise<string>[] = [];
    const endpoint = `/files/${fileKey}/images`;
    const file = await this.request<GetImageFillsResponse>(endpoint);
    const { images = {} } = file.meta;
    promises = nodes.map(async ({ imageRef, fileName }) => {
      const imageUrl = images[imageRef];
      if (!imageUrl) {
        return "";
      }
      return downloadFigmaImage(fileName, localPath, imageUrl);
    });
    return Promise.all(promises);
  }

  async getImages(
    fileKey: string,
    nodes: FetchImageParams[],
    localPath: string,
  ): Promise<string[]> {
    const pngIds = nodes.filter(({ fileType }) => fileType === "png").map(({ nodeId }) => nodeId);
    const pngFiles =
      pngIds.length > 0
        ? this.request<GetImagesResponse>(
            `/images/${fileKey}?ids=${pngIds.join(",")}&scale=2&format=png`,
          ).then(({ images = {} }) => images)
        : ({} as GetImagesResponse["images"]);

    const svgIds = nodes.filter(({ fileType }) => fileType === "svg").map(({ nodeId }) => nodeId);
    const svgFiles =
      svgIds.length > 0
        ? this.request<GetImagesResponse>(
            `/images/${fileKey}?ids=${svgIds.join(",")}&scale=2&format=svg`,
          ).then(({ images = {} }) => images)
        : ({} as GetImagesResponse["images"]);

    const [pngImages, svgImages] = await Promise.all([pngFiles, svgFiles]);
    const promises = nodes.map(async ({ nodeId, fileName, fileType }) => {
      const imageUrl = fileType === "png" ? pngImages[nodeId] : svgImages[nodeId];
      if (!imageUrl) {
        return "";
      }
      return downloadFigmaImage(fileName, localPath, imageUrl);
    });

    return Promise.all(promises);
  }

  /**
   * Get simplified file information
   * @param fileKey The file key from the Figma file URL
   * @param depth Optional depth for node traversal
   * @returns Simplified file information
   */
  async getSimplifiedFile(fileKey: string, depth?: number): Promise<SimplifiedDesign> {
    const response = await this.getFile(fileKey);
    // Convert our FigmaFileResponse to GetFileResponse
    const getFileResponse: GetFileResponse = {
      ...response,
      role: response.role as "owner" | "editor" | "viewer",
      editorType: response.editorType as "figma" | "figjam",
      document: response.document as any, // Type assertion needed due to complex nested structure
      components: Object.fromEntries(response.components),
      componentSets: Object.fromEntries(response.componentSets),
      styles: Object.fromEntries(response.styles),
    };
    return parseFigmaResponse(getFileResponse);
  }

  /**
   * Get simplified node information
   * @param fileKey The file key from the Figma file URL
   * @param nodeId The node ID to get information for
   * @param depth Optional depth for node traversal
   * @returns Simplified node information
   */
  async getSimplifiedNode(fileKey: string, nodeId: string, depth?: number): Promise<SimplifiedDesign> {
    const response = await this.getNode(fileKey, nodeId);
    const fileInfo = await this.getFile(fileKey);
    // Convert our Node to GetFileNodesResponse
    const getFileNodesResponse: GetFileNodesResponse = {
      name: fileInfo.name,
      role: fileInfo.role as "owner" | "editor" | "viewer",
      lastModified: fileInfo.lastModified,
      editorType: fileInfo.editorType as "figma" | "figjam",
      thumbnailUrl: fileInfo.thumbnailUrl,
      version: fileInfo.version,
      nodes: {
        [nodeId]: {
          document: response as any, // Type assertion needed due to complex nested structure
          components: Object.fromEntries(fileInfo.components),
          componentSets: Object.fromEntries(fileInfo.componentSets),
          schemaVersion: 1,
          styles: Object.fromEntries(fileInfo.styles),
        },
      },
    };
    return parseFigmaResponse(getFileNodesResponse);
  }
}

function writeLogs(name: string, value: any) {
  fs.writeFileSync(`./${name}.json`, JSON.stringify(value, null, 2));
}

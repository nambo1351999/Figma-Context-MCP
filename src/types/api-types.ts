import type { Node, Component, ComponentSet, Style, ImageFilters } from './node-types.js';

export interface FigmaFileResponse {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: Node;
  components: Map<string, Component>;
  componentSets: Map<string, ComponentSet>;
  schemaVersion: number;
  styles: Map<string, Style>;
  mainFileKey?: string;
  branches?: Array<{
    key: string;
    name: string;
    thumbnail_url: string;
    last_modified: string;
    link_access: string;
  }>;
}

export interface FigmaImageResponse {
  err: null;
  images: {
    [nodeId: string]: string;
  };
}

export interface FigmaFileImagesResponse {
  err: null;
  meta: {
    images: {
      [nodeId: string]: {
        imageRef: string;
        filters?: ImageFilters;
      };
    };
  };
}

export interface FigmaNodesResponse {
  err: null;
  nodes: {
    [nodeId: string]: Node;
  };
}

export interface FigmaErrorResponse {
  err: string;
  status: number;
} 
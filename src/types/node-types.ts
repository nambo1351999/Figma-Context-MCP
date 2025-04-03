import type {
  GetFileResponse,
  GetFileNodesResponse,
  GetImageFillsResponse,
} from "@figma/rest-api-spec";

export type NodeType =
  | "DOCUMENT"
  | "CANVAS"
  | "FRAME"
  | "GROUP"
  | "SECTION"
  | "VECTOR"
  | "BOOLEAN"
  | "STAR"
  | "LINE"
  | "ELLIPSE"
  | "POLYGON"
  | "RECTANGLE"
  | "TEXT"
  | "SLICE"
  | "COMPONENT"
  | "COMPONENT_SET"
  | "INSTANCE"
  | "STICKY"
  | "SHAPE_WITH_TEXT"
  | "CONNECTOR"
  | "STAMP"
  | "HIGHLIGHT"
  | "MEDIA"
  | "SECTION"
  | "WASHI_TAPE"
  | "CODE";

export type CodeLanguage = 
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "HTML"
  | "CSS"
  | "JSON"
  | "JSX"
  | "TSX"
  | "PYTHON"
  | "JAVA"
  | "C"
  | "CPP"
  | "CSHARP"
  | "GO"
  | "RUBY"
  | "SWIFT"
  | "KOTLIN"
  | "RUST"
  | "PHP"
  | "SCALA"
  | "PERL"
  | "SHELL"
  | "SQL"
  | "GRAPHQL"
  | "MARKDOWN"
  | "YAML"
  | "TOML"
  | "INI"
  | "XML"
  | "PLAINTEXT";

export type CodeTheme = 
  | "LIGHT"
  | "DARK"
  | "SOLARIZED_LIGHT"
  | "SOLARIZED_DARK"
  | "MONOKAI"
  | "GITHUB"
  | "VSCODE"
  | "ATOM"
  | "SUBLIME"
  | "DRACULA"
  | "NORD"
  | "OCEANIC_NEXT"
  | "MATERIAL"
  | "ONE_DARK"
  | "ONE_LIGHT"
  | "GRUVBOX_DARK"
  | "GRUVBOX_LIGHT"
  | "TOKYO_NIGHT"
  | "TOKYO_DAY"
  | "CATPPUCCIN_MOCHA"
  | "CATPPUCCIN_MACCHIATO"
  | "CATPPUCCIN_FRAPPE"
  | "CATPPUCCIN_LATTE";

// Common properties shared by multiple node types
export interface BaseNodeProperties {
  id: string;
  name: string;
  type: NodeType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  size: Size;
  position: Vector;
  transform: Transform;
  absoluteBoundingBox: Size;
  absoluteRenderBounds: Size;
  absoluteClipBounds: Size;
  absoluteTransform: Transform;
  relativeTransform: Transform;
  effects: Effect[];
  styles: Record<string, string>;
  componentProperties: Record<string, ComponentProperty>;
  reactions: Array<{
    action: {
      type: "NODE" | "BACK" | "CLOSE" | "URL" | "BACK" | "CLOSE" | "URL";
      destinationId?: string;
      url?: string;
    };
    trigger: {
      type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_KEY_DOWN";
      delay?: number;
    };
  }>;
  transitionNodeID?: string;
  transitionDuration?: number;
  transitionEasing?: {
    type: string;
    easingFunctionCubicBezier?: number[];
  };
}

// Document specific properties
export interface DocumentNode extends BaseNodeProperties {
  type: "DOCUMENT";
  children: Node[];
}

// Canvas specific properties
export interface CanvasNode extends BaseNodeProperties {
  type: "CANVAS";
  children: Node[];
  backgroundColor?: RGBA;
  prototypeStartNodeID?: string;
  flowStartingPoints?: Array<{
    nodeId: string;
    position: Vector;
  }>;
  prototypeDevice?: {
    type: string;
    rotation: string;
  };
  measurements?: Array<{
    name: string;
    value: number;
    unit: string;
    position: Vector;
  }>;
}

// Frame specific properties
export interface FrameNode extends BaseNodeProperties {
  type: "FRAME";
  children: (FrameNode | GroupNode | VectorNode | BooleanOperationNode | StarNode | LineNode | EllipseNode | PolygonNode | RectangleNode | TextNode | SliceNode | ComponentNode | ComponentSetNode | InstanceNode | StickyNode | ShapeWithTextNode | ConnectorNode | StampNode | HighlightNode | WashiTapeNode | MediaNode | SectionNode)[];
  clipsContent: boolean;
  background: Paint[];
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  layoutGrids: LayoutGrid[];
}

// Group specific properties
export interface GroupNode extends Omit<FrameNode, "type"> {
  type: "GROUP";
}

// Section specific properties
export interface SectionNode extends BaseNodeProperties {
  type: "SECTION";
  children: (FrameNode | GroupNode | VectorNode | BooleanOperationNode | StarNode | LineNode | EllipseNode | PolygonNode | RectangleNode | TextNode | SliceNode | ComponentNode | ComponentSetNode | InstanceNode | StickyNode | ShapeWithTextNode | ConnectorNode | StampNode | HighlightNode | WashiTapeNode | MediaNode | SectionNode)[];
  clipsContent: boolean;
  background: Paint[];
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  layoutGrids: LayoutGrid[];
  sectionContentsHidden: boolean;
}

// Vector specific properties
export interface VectorNode extends BaseNodeProperties {
  type: "VECTOR";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Boolean operation specific properties
export interface BooleanOperationNode extends BaseNodeProperties {
  type: "BOOLEAN";
  children: (FrameNode | GroupNode | VectorNode | BooleanOperationNode | StarNode | LineNode | EllipseNode | PolygonNode | RectangleNode | TextNode | SliceNode | ComponentNode | ComponentSetNode | InstanceNode | StickyNode | ShapeWithTextNode | ConnectorNode | StampNode | HighlightNode | WashiTapeNode | MediaNode | SectionNode)[];
  booleanOperation: "UNION" | "INTERSECT" | "SUBTRACT" | "EXCLUDE";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Star specific properties
export interface StarNode extends BaseNodeProperties {
  type: "STAR";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
  pointCount: number;
  innerRadius: number;
}

// Line specific properties
export interface LineNode extends BaseNodeProperties {
  type: "LINE";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
  startArrowhead: "NONE" | "ARROW_EQUILATERAL" | "ARROW_SQUARE" | "ARROW_CIRCLE" | "ARROW_DIAMOND" | "ARROW_TRIANGLE" | "ARROW_CHEVRON" | "ARROW_CURVED" | "ARROW_CURVED_SQUARE" | "ARROW_CURVED_CIRCLE" | "ARROW_CURVED_DIAMOND" | "ARROW_CURVED_TRIANGLE" | "ARROW_CURVED_CHEVRON";
  endArrowhead: "NONE" | "ARROW_EQUILATERAL" | "ARROW_SQUARE" | "ARROW_CIRCLE" | "ARROW_DIAMOND" | "ARROW_TRIANGLE" | "ARROW_CHEVRON" | "ARROW_CURVED" | "ARROW_CURVED_SQUARE" | "ARROW_CURVED_CIRCLE" | "ARROW_CURVED_DIAMOND" | "ARROW_CURVED_TRIANGLE" | "ARROW_CURVED_CHEVRON";
}

// Ellipse specific properties
export interface EllipseNode extends Omit<VectorNode, "type"> {
  type: "ELLIPSE";
  arcData?: {
    startingAngle: number;
    endingAngle: number;
    innerRadius: number;
  };
}

// Regular polygon specific properties
export interface RegularPolygonNode extends Omit<VectorNode, "type"> {
  type: "REGULAR_POLYGON";
}

// Rectangle specific properties
export interface RectangleNode extends Omit<VectorNode, "type"> {
  type: "RECTANGLE";
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  cornerSmoothing?: number;
}

// Text specific properties
export interface TextNode extends Omit<VectorNode, "type"> {
  type: "TEXT";
  characters: string;
  style: {
    fontFamily: string;
    fontPostScriptName?: string;
    fontWeight: number;
    fontSize: number;
    textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
    textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
    letterSpacing: number;
    lineHeightPx: number;
    lineHeightPercent: number;
    lineHeightUnit: "PIXELS" | "PERCENT";
    textCase: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";
    textDecoration: "NONE" | "STRIKETHROUGH" | "UNDERLINE";
    paragraphSpacing: number;
    paragraphIndent: number;
    listSpacing: number;
    textAutoResize: "NONE" | "HEIGHT" | "WIDTH_AND_HEIGHT" | "TRUNCATE";
  };
  characterStyleOverrides?: number[];
  styleOverrideTable?: Record<number, {
    fontFamily: string;
    fontPostScriptName?: string;
    fontWeight: number;
    fontSize: number;
    textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
    textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
    letterSpacing: number;
    lineHeightPx: number;
    lineHeightPercent: number;
    lineHeightUnit: "PIXELS" | "PERCENT";
    textCase: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE";
    textDecoration: "NONE" | "STRIKETHROUGH" | "UNDERLINE";
    paragraphSpacing: number;
    paragraphIndent: number;
    listSpacing: number;
  }>;
  lineTypes?: Array<"ORDERED" | "UNORDERED" | "NONE">;
  lineIndentations?: number[];
}

// Slice specific properties
export interface SliceNode extends BaseNodeProperties {
  type: "SLICE";
  exportSettings: ExportSetting[];
}

// Component specific properties
export interface ComponentNode extends BaseNodeProperties {
  type: "COMPONENT";
  children: (FrameNode | GroupNode | VectorNode | BooleanOperationNode | StarNode | LineNode | EllipseNode | PolygonNode | RectangleNode | TextNode | SliceNode | ComponentNode | ComponentSetNode | InstanceNode | StickyNode | ShapeWithTextNode | ConnectorNode | StampNode | HighlightNode | WashiTapeNode | MediaNode | SectionNode)[];
  clipsContent: boolean;
  background: Paint[];
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  layoutGrids: LayoutGrid[];
  componentProperties: Record<string, ComponentProperty>;
}

// Component set specific properties
export interface ComponentSetNode extends Omit<FrameNode, "type"> {
  type: "COMPONENT_SET";
  componentPropertyDefinitions: Record<string, {
    type: "BOOLEAN" | "INSTANCE_SWAP" | "TEXT" | "FLOAT" | "COLOR" | "VARIANT";
    defaultValue: boolean | string | number | RGBA | string;
    variantOptions?: string[];
    preferredValues?: string[];
  }>;
}

// Instance specific properties
export interface InstanceNode extends BaseNodeProperties {
  type: "INSTANCE";
  children: (FrameNode | GroupNode | VectorNode | BooleanOperationNode | StarNode | LineNode | EllipseNode | PolygonNode | RectangleNode | TextNode | SliceNode | ComponentNode | ComponentSetNode | InstanceNode | StickyNode | ShapeWithTextNode | ConnectorNode | StampNode | HighlightNode | WashiTapeNode | MediaNode | SectionNode)[];
  clipsContent: boolean;
  background: Paint[];
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  layoutGrids: LayoutGrid[];
  componentId: string;
  componentProperties: Record<string, ComponentProperty>;
}

// Sticky specific properties
export interface StickyNode extends BaseNodeProperties {
  type: "STICKY";
  characters?: string;
  authorVisible?: boolean;
}

// Shape with text specific properties
export interface ShapeWithTextNode extends BaseNodeProperties {
  type: "SHAPE_WITH_TEXT";
  characters: string;
  shapeType: "SQUARE" | "ELLIPSE" | "ROUNDED_RECTANGLE" | "DIAMOND" | "TRIANGLE_UP" | "TRIANGLE_DOWN" | "PARALLELOGRAM_RIGHT" | "PARALLELOGRAM_LEFT";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Connector specific properties
export interface ConnectorNode extends BaseNodeProperties {
  type: "CONNECTOR";
  characters: string;
  connectorStart: {
    nodeId: string;
    position: Vector;
  };
  connectorEnd: {
    nodeId: string;
    position: Vector;
  };
  connectorStartStrokeCap: "NONE" | "LINE_ARROW" | "TRIANGLE_ARROW" | "DIAMOND_FILLED" | "CIRCLE_FILLED" | "TRIANGLE_FILLED";
  connectorEndStrokeCap: "NONE" | "LINE_ARROW" | "TRIANGLE_ARROW" | "DIAMOND_FILLED" | "CIRCLE_FILLED" | "TRIANGLE_FILLED";
  connectorLineType: "ELBOWED" | "STRAIGHT" | "CURVED";
  textBackground: {
    cornerRadius: number;
    padding: number;
    fills: Paint[];
  };
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Washi tape specific properties
export interface WashiTapeNode extends BaseNodeProperties {
  type: "WASHI_TAPE";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Stamp specific properties
export interface StampNode extends BaseNodeProperties {
  type: "STAMP";
  children: Node[];
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Highlight specific properties
export interface HighlightNode extends BaseNodeProperties {
  type: "HIGHLIGHT";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Media specific properties
export interface MediaNode extends BaseNodeProperties {
  type: "MEDIA";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
}

// Polygon specific properties
export interface PolygonNode extends BaseNodeProperties {
  type: "POLYGON";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
  pointCount: number;
}

// Code specific properties
export interface CodeNode extends BaseNodeProperties {
  type: "CODE";
  characters: string;
  language: CodeLanguage;
  theme: CodeTheme;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlignHorizontal: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
  textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
  fills: Paint[];
  strokes: Paint[];
  strokeWeight: number;
  strokeAlign: "INSIDE" | "OUTSIDE" | "CENTER";
  strokeCap: "NONE" | "ROUND" | "SQUARE" | "ARROW_LINES" | "ARROW_EQUILATERAL";
  strokeJoin: "MITER" | "BEVEL" | "ROUND";
  strokeMiterAngle: number;
  strokeDashes: number[];
  strokeGeometry: Vector[];
  effects: Effect[];
}

// Union type of all possible nodes
export type Node =
  | DocumentNode
  | CanvasNode
  | FrameNode
  | GroupNode
  | SectionNode
  | VectorNode
  | BooleanOperationNode
  | StarNode
  | LineNode
  | EllipseNode
  | RegularPolygonNode
  | RectangleNode
  | TextNode
  | SliceNode
  | ComponentNode
  | ComponentSetNode
  | InstanceNode
  | StickyNode
  | ShapeWithTextNode
  | ConnectorNode
  | WashiTapeNode
  | StampNode
  | HighlightNode
  | MediaNode
  | PolygonNode
  | CodeNode;

// Color types
export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Export types
export interface ExportSetting {
  suffix: string;
  format: "PNG" | "JPG" | "SVG" | "PDF";
  constraint: {
    type: "SCALE" | "WIDTH" | "HEIGHT";
    value: number;
  };
}

// Geometry types
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArcData {
  startingAngle: number;
  endingAngle: number;
  innerRadius: number;
}

// Style types
export type BlendMode =
  | "PASS_THROUGH"
  | "NORMAL"
  | "DARKEN"
  | "MULTIPLY"
  | "LINEAR_BURN"
  | "COLOR_BURN"
  | "LIGHTEN"
  | "SCREEN"
  | "LINEAR_DODGE"
  | "COLOR_DODGE"
  | "OVERLAY"
  | "SOFT_LIGHT"
  | "HARD_LIGHT"
  | "DIFFERENCE"
  | "EXCLUSION"
  | "HUE"
  | "SATURATION"
  | "COLOR"
  | "LUMINOSITY";

export type MaskType = "ALPHA" | "VECTOR" | "LUMINANCE";

export type EasingType = "EASE_IN" | "EASE_OUT" | "EASE_IN_AND_OUT" | "LINEAR" | "GENTLE_SPRING";

// Layout types
export interface FlowStartingPoint {
  nodeId: string;
  name: string;
}

export interface LayoutConstraint {
  vertical: "TOP" | "BOTTOM" | "CENTER" | "SCALE" | "STRETCH";
  horizontal: "LEFT" | "RIGHT" | "CENTER" | "SCALE" | "STRETCH";
}

export interface LayoutGrid {
  pattern: "COLUMNS" | "ROWS" | "GRID";
  sectionSize: number;
  visible: boolean;
  color: RGBA;
  alignment: "MIN" | "MAX" | "CENTER" | "STRETCH";
  gutterSize: number;
  offset: number;
  count: number;
}

// Effect types
export interface Effect {
  type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
  visible: boolean;
  color?: RGBA;
  offset?: Vector;
  radius: number;
  spread?: number;
  blendMode?: "PASS_THROUGH" | "NORMAL" | "DARKEN" | "MULTIPLY" | "LINEAR_BURN" | "COLOR_BURN" | "LIGHTEN" | "SCREEN" | "LINEAR_DODGE" | "COLOR_DODGE" | "OVERLAY" | "SOFT_LIGHT" | "HARD_LIGHT" | "DIFFERENCE" | "EXCLUSION" | "HUE" | "SATURATION" | "COLOR" | "LUMINOSITY";
}

// Link types
export interface Hyperlink {
  type: "URL" | "NODE";
  url?: string;
  nodeID?: string;
}

export interface DocumentationLink {
  uri: string;
}

// Paint types
export interface Paint {
  type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_DIAMOND" | "GRADIENT_ANGULAR" | "IMAGE" | "EMOJI";
  visible: boolean;
  opacity: number;
  color?: RGBA;
  gradientTransform?: Transform;
  gradientStops?: Array<{
    position: number;
    color: RGBA;
  }>;
  scaleMode?: "FILL" | "FIT" | "CROP" | "TILE";
  imageTransform?: Transform;
  scalingFactor?: number;
  rotation?: number;
  imageRef?: string;
  blendMode?: "PASS_THROUGH" | "NORMAL" | "DARKEN" | "MULTIPLY" | "LINEAR_BURN" | "COLOR_BURN" | "LIGHTEN" | "SCREEN" | "LINEAR_DODGE" | "COLOR_DODGE" | "OVERLAY" | "SOFT_LIGHT" | "HARD_LIGHT" | "DIFFERENCE" | "EXCLUSION" | "HUE" | "SATURATION" | "COLOR" | "LUMINOSITY";
}

export interface Path {
  path: string;
  windingRule: "NONZERO" | "EVENODD";
  overrideID?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface ImageFilters {
  exposure?: number;
  contrast?: number;
  saturation?: number;
  temperature?: number;
  tint?: number;
  highlights?: number;
  shadows?: number;
}

export interface ColorStop {
  position: number;
  color: RGBA;
}

export interface PaintOverride {
  fills: Paint[];
  inheritFillStyleId?: string;
}

export interface TypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  fontStyle?: string;
  paragraphSpacing?: number;
  paragraphIndent?: number;
  listSpacing?: number;
  italic?: boolean;
  fontWeight: number;
  fontSize: number;
  textCase?: "ORIGINAL" | "UPPER" | "LOWER" | "TITLE" | "SMALL_CAPS" | "SMALL_CAPS_FORCED";
  textDecoration?: "NONE" | "STRIKETHROUGH" | "UNDERLINE";
  textAutoResize?: "NONE" | "HEIGHT" | "WIDTH_AND_HEIGHT" | "TRUNCATE";
  textTruncation?: "DISABLED" | "ENDING";
  maxLines?: number;
  textAlignHorizontal: "LEFT" | "RIGHT" | "CENTER" | "JUSTIFIED";
  textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
  letterSpacing: number;
  fills?: Paint[];
  hyperlink?: Hyperlink;
  opentypeFlags?: Record<string, number>;
  lineHeightPx: number;
  lineHeightPercent?: number;
  lineHeightPercentFontSize?: number;
  lineHeightUnit?: "PIXELS" | "FONT_SIZE_%" | "INTRINSIC_%";
  isOverrideOverTextStyle?: boolean;
  semanticWeight?: "BOLD" | "NORMAL";
  semanticItalic?: "ITALIC" | "NORMAL";
}

// Component types
export interface User {
  id: string;
  handle: string;
  name: string;
  email: string;
  img_url: string;
}

export interface Frame {
  key: string;
  name: string;
  type: "FRAME";
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  size: Size;
  position: Vector;
  transform: Transform;
  children: Node[];
  constraints: LayoutConstraint;
  layoutMode: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisSizingMode: "FIXED" | "AUTO";
  counterAxisSizingMode: "FIXED" | "AUTO";
  primaryAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  counterAxisAlignItems: "MIN" | "MAX" | "CENTER" | "SPACE_BETWEEN";
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  itemSpacing: number;
  layoutGrids: LayoutGrid[];
  clipsContent: boolean;
  background: Paint[];
  effects: Effect[];
  styles: Record<string, string>;
  componentProperties: Record<string, ComponentProperty>;
  reactions: Reaction[];
  transitionNodeID: string | null;
  transitionDuration: number;
  transitionEasing: Easing;
  absoluteBoundingBox: Rect;
  absoluteRenderBounds: Rect;
  absoluteClipBounds: Rect;
  absoluteTransform: Transform;
  relativeTransform: Transform;
}

export interface Component {
  key: string;
  name: string;
  description: string;
  documentationLinks: Array<{
    uri: string;
  }>;
  remote: boolean;
  containing_frame: Frame;
  component_properties: ComponentProperty[];
}

export interface Style {
  key: string;
  name: string;
  description: string;
  remote: boolean;
  styleType: "FILL" | "TEXT" | "EFFECT" | "GRID";
}

export type ShapeType =
  | "SQUARE"
  | "ELLIPSE"
  | "ROUNDED_RECTANGLE"
  | "DIAMOND"
  | "TRIANGLE_DOWN"
  | "PARALLELOGRAM_RIGHT"
  | "PARALLELOGRAM_LEFT"
  | "ENG_DATABASE"
  | "ENG_QUEUE"
  | "ENG_FILE"
  | "ENG_FOLDER"
  | "TRAPEZOID"
  | "PREDEFINED_PROCESS"
  | "SHIELD"
  | "DOCUMENT_SINGLE"
  | "DOCUMENT_MULTIPLE"
  | "MANUAL_INPUT"
  | "HEXAGON"
  | "CHEVRON"
  | "PENTAGON"
  | "OCTAGON"
  | "STAR"
  | "PLUS"
  | "ARROW_LEFT"
  | "ARROW_RIGHT"
  | "SUMMING_JUNCTION"
  | "OR"
  | "SPEECH_BUBBLE"
  | "INTERNAL_STORAGE";

// Connector types
export interface ConnectorEndpoint {
  endpointNodeId: string;
  position?: Vector;
  magnet?: "AUTO" | "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
}

export type ConnectorLineType = "ELBOWED" | "STRAIGHT";

export interface ConnectorTextBackground {
  cornerRadius: number;
  fills: Paint[];
}

// Component property types
export interface ComponentPropertyDefinition {
  type: ComponentPropertyType;
  defaultValue: boolean | string | number | Color | string;
  variantOptions?: string[];
  preferredValues?: InstanceSwapPreferredValue[];
}

export interface ComponentProperty {
  type: "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" | "VARIANT";
  value: boolean | string;
  defaultValue: boolean | string;
  preferredValues?: string[];
}

export type ComponentPropertyType = "BOOLEAN" | "INSTANCE_SWAP" | "TEXT" | "VARIANT";

export interface InstanceSwapPreferredValue {
  type: "COMPONENT" | "COMPONENT_SET";
  key: string;
}

// Prototype types
export interface PrototypeDevice {
  type: "NONE" | "PRESET" | "CUSTOM" | "PRESENTATION";
  size?: Size;
  presetIdentifier?: string;
  rotation?: "NONE" | "CCW_90";
}

// Annotation types
export interface Annotation {
  label: string;
  properties: AnnotationProperty[];
}

export interface AnnotationProperty {
  type: "width" | "height" | "maxWidth" | "minWidth" | "maxHeight" | "minHeight" | "fills" | "strokes" | "effects" | "strokeWeight" | "cornerRadius" | "textStyleId" | "textAlignHorizontal" | "fontFamily" | "fontStyle" | "fontSize" | "fontWeight" | "lineHeight" | "letterSpacing" | "itemSpacing" | "padding" | "layoutMode" | "alignItems" | "opacity" | "mainComponent";
}

// Measurement types
export interface Measurement {
  id: string;
  start: MeasurementStartEnd;
  end: MeasurementStartEnd;
  offset: MeasurementOffsetInner | MeasurementOffsetOuter;
  freeText?: string;
}

export interface MeasurementStartEnd {
  nodeId: string;
  side: "TOP" | "RIGHT" | "BOTTOM" | "LEFT";
}

export interface MeasurementOffsetInner {
  type: "INNER";
  relative: number;
}

export interface MeasurementOffsetOuter {
  type: "OUTER";
  fixed: number;
}

export interface StrokeWeights {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Overrides {
  id: string;
  overriddenFields: string[];
}

export interface VariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

export interface DevStatus {
  type: "READY_FOR_DEV" | "COMPLETED";
  description?: string;
}

// Interaction types
export interface Interaction {
  trigger: Trigger | null;
  actions: Action[];
}

export interface Trigger {
  type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_DRAG" | "AFTER_TIMEOUT" | "MOUSE_ENTER" | "MOUSE_LEAVE" | "MOUSE_DOWN" | "MOUSE_UP";
  delay?: number;
}

export interface Action {
  type: "NODE" | "BACK" | "CLOSE" | "URL" | "SCROLL_TO_NODE" | "NAVIGATE" | "SWAP" | "OVERRIDE" | "INSERT" | "SET_VARIABLE" | "CONDITION" | "INVOKE";
  destinationId?: string;
  url?: string;
  preserveScrollPosition?: boolean;
  navigation?: {
    type: "PUSH" | "POP" | "REPLACE";
    preserveScrollPosition?: boolean;
  };
  swap?: {
    nodeId: string;
    maintainScrollPosition?: boolean;
  };
  override?: {
    nodeId: string;
    properties: Record<string, any>;
  };
  insert?: {
    nodeId: string;
    insertionMode: "INSERT_AFTER" | "INSERT_BEFORE" | "REPLACE";
  };
  setVariable?: {
    variableId: string;
    value: any;
  };
  condition?: {
    variableId: string;
    value: any;
    then: Action[];
    else?: Action[];
  };
  invoke?: {
    functionName: string;
    parameters: Record<string, any>;
  };
}

export interface Reaction {
  action: {
    type: "NODE" | "BACK" | "CLOSE" | "URL" | "BACK" | "CLOSE" | "URL";
    destinationId?: string;
    url?: string;
  };
  trigger: {
    type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_KEY_DOWN";
    delay?: number;
  };
}

export interface Easing {
  type: "EASE_IN" | "EASE_OUT" | "EASE_IN_AND_OUT" | "LINEAR";
  easingFunctionCubicBezier?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface BaseNode {
  id: string;
  name: string;
  type: NodeType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  size: Size;
  position: Vector;
  transform: Transform;
  absoluteBoundingBox: Size;
  absoluteRenderBounds: Size;
  absoluteClipBounds: Size;
  absoluteTransform: Transform;
  relativeTransform: Transform;
  effects: Effect[];
  styles: Record<string, string>;
  componentProperties: Record<string, ComponentProperty>;
  reactions: Array<{
    action: {
      type: "NODE" | "BACK" | "CLOSE" | "URL" | "BACK" | "CLOSE" | "URL";
      destinationId?: string;
      url?: string;
    };
    trigger: {
      type: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_KEY_DOWN";
      delay?: number;
    };
  }>;
  transitionNodeID?: string;
  transitionDuration?: number;
  transitionEasing?: {
    type: string;
    easingFunctionCubicBezier?: number[];
  };
}

export interface ComponentSet {
  key: string;
  name: string;
  description: string;
  documentationLinks: Array<{
    uri: string;
  }>;
  remote: boolean;
  containing_frame: Frame;
  component_properties: ComponentProperty[];
  variantGroupProperties: Record<string, {
    values: string[];
    defaultValue: string;
  }>;
}

export interface Comment {
  id: string;
  file_key: string;
  parent_id: string;
  user: User;
  created_at: string;
  resolved_at: string | null;
  message: string;
  client_meta: Vector | FrameOffset;
  order_id: number;
}

export interface FrameOffset {
  node_id: string;
  node_offset: Vector;
}

export interface Project {
  id: string;
  name: string;
}

export interface TeamFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  team_id: string;
}

export interface TeamComponent {
  key: string;
  name: string;
  description: string;
  team_id: string;
}

export interface TeamStyle {
  key: string;
  name: string;
  description: string;
  team_id: string;
}

export interface TeamComponentSet {
  key: string;
  name: string;
  description: string;
  team_id: string;
}

export interface TeamComponentPropertyValueSet {
  key: string;
  name: string;
  description: string;
  team_id: string;
}

export interface TeamComponentPropertyValueSetValue {
  key: string;
  name: string;
  description: string;
  team_id: string;
} 
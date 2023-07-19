declare interface Window {
  dragId: any,
  dragPId: any,
  dragParentNode: any,
}

declare const window: Window & typeof globalThis

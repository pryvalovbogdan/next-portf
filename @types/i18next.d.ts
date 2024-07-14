import 'i18next';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import { Object3DNode } from '@react-three/fiber';

import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    // defaultNS: 'translation'
    resources: Resources;
  }
}

declare module '*.gltf';
declare module '**/*.gltf';

declare module '@react-three/fiber' {
  interface ThreeElements {
    textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
  }
}

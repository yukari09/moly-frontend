import { createSlateEditor } from 'platejs';
import {
    BlockquotePlugin,
    BoldPlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    ItalicPlugin,
    UnderlinePlugin,
  } from '@platejs/basic-nodes/react';
import { staticComponents } from './static-components';

const plugins = [
    BoldPlugin,
    ItalicPlugin,
    UnderlinePlugin,
    H1Plugin,
    H2Plugin,
    H3Plugin,
    BlockquotePlugin,
];

export const staticEditor = createSlateEditor({
  plugins,
  components: staticComponents,
});

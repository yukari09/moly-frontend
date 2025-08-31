import * as React from 'react';

import { SlateLeaf } from 'platejs';

export function HighlightLeafStatic(props) {
  return (
    <SlateLeaf {...props} as="mark" className="bg-highlight/30 text-inherit">
      {props.children}
    </SlateLeaf>
  );
}

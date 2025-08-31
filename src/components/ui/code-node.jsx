'use client';;
import * as React from 'react';

import { PlateLeaf } from 'platejs/react';

export function CodeLeaf(props) {
  return (
    <PlateLeaf
      {...props}
      as="code"
      className="rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm whitespace-pre-wrap">
      {props.children}
    </PlateLeaf>
  );
}

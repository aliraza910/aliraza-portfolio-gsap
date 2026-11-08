import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang' | 'in';
          delay?: string | number;
          colors?: string;
          stroke?: string | number;
          state?: string;
        },
        HTMLElement
      >;
    }
  }
}


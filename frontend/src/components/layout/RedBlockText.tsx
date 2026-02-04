// components/layout/RedBlockText.tsx
'use client'

import { useRef, useEffect, useState } from 'react';

interface BlockPosition {
  startChar?: number;
  endChar?: number;
  paddingStart?: number;
  paddingEnd?: number;
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;
  color?: string;
}

interface RedBlockTextProps {
  children: string;
  blocks?: BlockPosition[];
  mdBlocks?: BlockPosition[];
  lgBlocks?: BlockPosition[];
  className?: string;
}

// Add debounce helper at top of file
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const RedBlockText: React.FC<RedBlockTextProps> = ({
  children,
  blocks = [],
  mdBlocks,
  lgBlocks,
  className = "",
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [charPositions, setCharPositions] = useState<DOMRect[]>([]);

  useEffect(() => {
    if (!textRef.current) return;

    const measurePositions = () => {
      if (!textRef.current) return;
      
      const range = document.createRange();
      const positions: DOMRect[] = [];
      const textNode = textRef.current.firstChild as Text;

      if (!textNode) return;

      for (let i = 0; i < children.length; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        positions.push(range.getBoundingClientRect());
      }

      setCharPositions(positions);
    };

    // ✅ Debounced version for resize events
    const debouncedMeasure = debounce(measurePositions, 150);

    // Initial measurement
    measurePositions();

    // Fonts loading
    document.fonts.ready.then(measurePositions);

    // Window resize (debounced)
    window.addEventListener('resize', debouncedMeasure);

    // Layout shift detection
    const timer = setTimeout(measurePositions, 200);

    return () => {
      window.removeEventListener('resize', debouncedMeasure);
      clearTimeout(timer);
    };
  }, [children]);

  const formatValue = (value: string | number | undefined) => {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return `${value}px`;
    return value;
  };

  const getBlockStyle = (block: BlockPosition): React.CSSProperties => {
    // Manual positioning
    if (block.left !== undefined || block.right !== undefined || block.width !== undefined) {
      return {
        position: 'absolute',
        insetInlineStart: formatValue(block.left),
        insetInlineEnd: formatValue(block.right),
        top: formatValue(block.top),
        bottom: formatValue(block.bottom),
        width: formatValue(block.width),
        height: formatValue(block.height),
      };
    }

    // Character-based positioning
    if (block.startChar !== undefined && block.endChar !== undefined && charPositions.length > 0) {
      const containerRect = textRef.current?.getBoundingClientRect();
      if (!containerRect) return {};

      const startChar = charPositions[block.startChar];
      const endChar = charPositions[Math.min(block.endChar, charPositions.length - 1)];

      if (!startChar || !endChar) return {};

      const paddingStart = block.paddingStart || 0;
      const paddingEnd = block.paddingEnd || 0;

      return {
        position: 'absolute',
        insetInlineStart: `${(startChar.left - containerRect.left) - paddingStart}px`,
        top: formatValue(block.top) || 0,
        width: `${(endChar.right - startChar.left) + paddingStart + paddingEnd}px`,
        height: formatValue(block.height) || '100%',
      };
    }

    return {};
  };

  // Determine visibility classes based on what blocks are provided
  const getVisibilityClass = () => {
    if (lgBlocks && mdBlocks) {
      // Has all three: mobile, md, lg
      return {
        base: 'md:hidden',
        md: 'hidden md:block lg:hidden',
        lg: 'hidden lg:block'
      };
    } else if (lgBlocks) {
      // Has mobile and lg (no md)
      return {
        base: 'lg:hidden',
        md: '',
        lg: 'hidden lg:block'
      };
    } else if (mdBlocks) {
      // Has mobile and md (no lg)
      return {
        base: 'md:hidden',
        md: 'hidden md:block',
        lg: ''
      };
    }
    // Only mobile blocks
    return {
      base: '',
      md: '',
      lg: ''
    };
  };

  const visibility = getVisibilityClass();

  return (
    <span className={`relative inline-block ${className}`}>
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
      
      {/* Mobile blocks */}
      {blocks.map((block, index) => (
        <span
          key={`base-${index}`}
          className={`absolute ${block.color || "bg-secondary"} ${visibility.base}`}
          style={getBlockStyle(block)}
          aria-hidden="true"
        />
      ))}

      {/* md: blocks */}
      {mdBlocks?.map((block, index) => (
        <span
          key={`md-${index}`}
          className={`absolute ${block.color || "bg-secondary"} ${visibility.md}`}
          style={getBlockStyle(block)}
          aria-hidden="true"
        />
      ))}

      {/* lg: blocks */}
      {lgBlocks?.map((block, index) => (
        <span
          key={`lg-${index}`}
          className={`absolute ${block.color || "bg-secondary"} ${visibility.lg}`}
          style={getBlockStyle(block)}
          aria-hidden="true"
        />
      ))}
    </span>
  );
};
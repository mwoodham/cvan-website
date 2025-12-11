import { cn } from '@/lib/utils';

type ColorOption = 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'beige' | 'white' | 'black';
type BgColorOption = 'yellow' | 'blue' | 'green' | 'purple' | 'orange' | 'cream' | 'black';
type GraphicArrangement = 'corners' | 'diagonal-meeting' | 'bottom-left' | 'top-right' | 'stacked-right' | 'support';

interface PageHeroProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  bgColor?: BgColorOption;
  graphicColor?: ColorOption;
  textColor?: ColorOption;
  graphicArrangement?: GraphicArrangement;
  className?: string;
}

// SVG component for outlined L-shape (uses stroke for true outline effect)
function OutlinedLShape({ color, className, style }: { color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M75 4 L96 4 L96 96 L4 96 L4 75 L75 75 Z"
        stroke={color}
        strokeWidth="8"
        fill="none"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

// SVG component for filled L-shape
function FilledLShape({ color, className, style }: { color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M0 0 L25 0 L25 75 L100 75 L100 100 L0 100 Z"
        fill={color}
      />
    </svg>
  );
}

export function PageHero({
  title,
  description,
  action,
  bgColor = 'yellow',
  graphicColor,
  textColor,
  graphicArrangement = 'corners',
  className,
}: PageHeroProps) {
  const bgClasses: Record<BgColorOption, string> = {
    yellow: 'bg-cvan-yellow',
    blue: 'bg-cvan-blue',
    green: 'bg-cvan-green',
    purple: 'bg-cvan-purple',
    orange: 'bg-cvan-orange',
    cream: 'bg-cvan-cream',
    black: 'bg-black',
  };

  const defaultTextColors: Record<BgColorOption, string> = {
    yellow: 'text-black',
    blue: 'text-white',
    green: 'text-black',
    purple: 'text-white',
    orange: 'text-white',
    cream: 'text-black',
    black: 'text-cvan-yellow',
  };

  const textColorClasses: Record<ColorOption, string> = {
    yellow: 'text-cvan-yellow',
    blue: 'text-cvan-blue',
    green: 'text-cvan-green',
    purple: 'text-cvan-purple',
    orange: 'text-cvan-orange',
    beige: 'text-cvan-beige',
    white: 'text-white',
    black: 'text-black',
  };

  const colorValues: Record<ColorOption, string> = {
    yellow: '#FFED00',
    blue: '#4038FF',
    green: '#75FFCF',
    purple: '#8742FF',
    orange: '#FF6142',
    beige: '#EDDBBD',
    white: '#FFFFFF',
    black: '#000000',
  };

  const resolvedTextColor = textColor ? textColorClasses[textColor] : defaultTextColors[bgColor];
  const showGraphics = !!graphicColor;
  const fillColor = graphicColor ? colorValues[graphicColor] : '#000000';

  // Different arrangements for the graphics
  const renderGraphics = () => {
    if (!showGraphics) return null;

    switch (graphicArrangement) {
      case 'diagonal-meeting':
        // Two filled L-shapes pointing toward each other diagonally
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute w-24 h-24 lg:w-32 lg:h-32 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ bottom: '15%', left: '55%', transform: 'rotate(0deg)' }}
            />
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute w-24 h-24 lg:w-32 lg:h-32 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ top: '15%', right: '55%', transform: 'rotate(180deg)' }}
            />
          </>
        );

      case 'bottom-left':
        // Both shapes in bottom-left area
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
            />
            <OutlinedLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute bottom-12 left-12 lg:bottom-20 lg:left-20 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
            />
          </>
        );

      case 'top-right':
        // Both shapes in top-right area - tips facing outward (for "expanding" effect)
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute top-4 right-4 lg:top-8 lg:right-8 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'rotate(270deg)' }}
            />
            <OutlinedLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute top-12 right-12 lg:top-20 lg:right-20 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'rotate(90deg)' }}
            />
          </>
        );

      case 'stacked-right':
        // Stacked vertically on the right
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute top-8 right-4 lg:top-12 lg:right-8 w-14 h-14 lg:w-20 lg:h-20 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'rotate(180deg)' }}
            />
            <OutlinedLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute bottom-8 right-4 lg:bottom-12 lg:right-8 w-14 h-14 lg:w-20 lg:h-20 pointer-events-none transition-transform duration-700 ease-in-out"
            />
          </>
        );

      case 'support':
        // Support arrangement (Mentoring) - one shape "supporting" another with rotation on hover
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'translate(0, 0)' }}
            />
            <OutlinedLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute bottom-12 left-12 lg:bottom-20 lg:left-20 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'translate(0, 0) rotate(0deg)' }}
            />
          </>
        );

      case 'corners':
      default:
        // Corners layout - filled bottom-left, outlined top-right (rotated 270deg to face as corner)
        return (
          <>
            <FilledLShape
              color={fillColor}
              className="cvan-shape cvan-shape-left absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
            />
            <OutlinedLShape
              color={fillColor}
              className="cvan-shape cvan-shape-right absolute top-4 right-4 lg:top-8 lg:right-8 w-16 h-16 lg:w-24 lg:h-24 pointer-events-none transition-transform duration-700 ease-in-out"
              style={{ transform: 'rotate(270deg)' }}
            />
          </>
        );
    }
  };

  return (
    <section className={cn('hero-section relative py-16 lg:py-24 overflow-hidden', `hero-${graphicArrangement}`, bgClasses[bgColor], resolvedTextColor, className)}>
      {renderGraphics()}

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-4">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl max-w-3xl mb-8 opacity-90">{description}</p>
          )}
          {action && <div>{action}</div>}
        </div>
      </div>
    </section>
  );
}

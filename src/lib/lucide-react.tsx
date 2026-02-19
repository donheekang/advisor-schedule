import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };
type IconPath = { tag: 'path' | 'circle' | 'line' | 'polyline' | 'rect'; attrs: Record<string, string | number> };

function createIcon(paths: IconPath[]) {
  return function Icon({ size = 24, color = 'currentColor', strokeWidth = 2, className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {paths.map((p, i) => {
          const Tag = p.tag;
          return <Tag key={String(i)} {...p.attrs} />;
        })}
      </svg>
    );
  };
}

export const Dog = createIcon([{ tag: 'path', attrs: { d: 'M11 5h2l2 3 2 1v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9l2-1 2-3z' } }, { tag: 'circle', attrs: { cx: '10', cy: '12', r: '1' } }, { tag: 'circle', attrs: { cx: '14', cy: '12', r: '1' } }]);
export const Cat = createIcon([{ tag: 'path', attrs: { d: 'M5 9V5l3 2 4-2 4 2 3-2v4' } }, { tag: 'path', attrs: { d: 'M5 9a7 7 0 0 0 14 0' } }, { tag: 'path', attrs: { d: 'M10 13h4' } }]);
export const PawPrint = createIcon([{ tag: 'circle', attrs: { cx: '7', cy: '8', r: '2' } }, { tag: 'circle', attrs: { cx: '17', cy: '8', r: '2' } }, { tag: 'circle', attrs: { cx: '12', cy: '5', r: '2' } }, { tag: 'path', attrs: { d: 'M6 14c0 3 2.5 5 6 5s6-2 6-5-2.5-4-6-4-6 1-6 4z' } }]);
export const Stethoscope = createIcon([{ tag: 'path', attrs: { d: 'M4 3v5a4 4 0 0 0 8 0V3' } }, { tag: 'circle', attrs: { cx: '18', cy: '14', r: '3' } }, { tag: 'path', attrs: { d: 'M10 8v6a5 5 0 0 0 10 0' } }]);
export const Calendar = createIcon([{ tag: 'rect', attrs: { x: '3', y: '4', width: '18', height: '18', rx: '2' } }, { tag: 'line', attrs: { x1: '16', y1: '2', x2: '16', y2: '6' } }, { tag: 'line', attrs: { x1: '8', y1: '2', x2: '8', y2: '6' } }, { tag: 'line', attrs: { x1: '3', y1: '10', x2: '21', y2: '10' } }]);
export const FileText = createIcon([{ tag: 'path', attrs: { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' } }, { tag: 'polyline', attrs: { points: '14 2 14 8 20 8' } }, { tag: 'line', attrs: { x1: '16', y1: '13', x2: '8', y2: '13' } }]);
export const Camera = createIcon([{ tag: 'path', attrs: { d: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-2h6l2 2h4a2 2 0 0 1 2 2z' } }, { tag: 'circle', attrs: { cx: '12', cy: '13', r: '4' } }]);
export const Bell = createIcon([{ tag: 'path', attrs: { d: 'M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5' } }, { tag: 'path', attrs: { d: 'M9 17a3 3 0 0 0 6 0' } }]);
export const MapPin = createIcon([{ tag: 'path', attrs: { d: 'M12 22s7-4.35 7-11a7 7 0 0 0-14 0c0 6.65 7 11 7 11z' } }, { tag: 'circle', attrs: { cx: '12', cy: '11', r: '2.5' } }]);
export const Smartphone = createIcon([{ tag: 'rect', attrs: { x: '7', y: '2', width: '10', height: '20', rx: '2' } }, { tag: 'line', attrs: { x1: '12', y1: '18', x2: '12.01', y2: '18' } }]);
export const BrainCircuit = createIcon([{ tag: 'path', attrs: { d: 'M8 6a3 3 0 1 1 6 0v1a2 2 0 1 0 4 0 3 3 0 1 1 0 6' } }, { tag: 'path', attrs: { d: 'M6 11a3 3 0 1 0 0 6 2 2 0 1 1 0 4' } }, { tag: 'line', attrs: { x1: '10', y1: '11', x2: '14', y2: '11' } }]);
export const HardDrive = createIcon([{ tag: 'rect', attrs: { x: '2', y: '5', width: '20', height: '14', rx: '2' } }, { tag: 'line', attrs: { x1: '6', y1: '13', x2: '6.01', y2: '13' } }, { tag: 'line', attrs: { x1: '10', y1: '13', x2: '16', y2: '13' } }]);
export const LogOut = createIcon([{ tag: 'path', attrs: { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' } }, { tag: 'polyline', attrs: { points: '16 17 21 12 16 7' } }, { tag: 'line', attrs: { x1: '21', y1: '12', x2: '9', y2: '12' } }]);
export const Sparkles = createIcon([{ tag: 'path', attrs: { d: 'M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5z' } }, { tag: 'path', attrs: { d: 'M5 14l.8 1.8L8 16.6l-1.8.8L5 19l-.8-1.6L2.4 16.6l1.8-.8z' } }]);
export const Activity = createIcon([{ tag: 'polyline', attrs: { points: '22 12 18 12 15 21 9 3 6 12 2 12' } }]);
export const Download = createIcon([{ tag: 'path', attrs: { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' } }, { tag: 'polyline', attrs: { points: '7 10 12 15 17 10' } }, { tag: 'line', attrs: { x1: '12', y1: '15', x2: '12', y2: '3' } }]);

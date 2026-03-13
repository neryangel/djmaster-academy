declare module '@tonaljs/tonal' {
  export const Key: {
    majorKey(tonic: string): { tonic: string; type: string; scale: string[] };
    minorKey(tonic: string): { tonic: string; type: string };
    relative(key: string): string | undefined;
  };

  export const Interval: {
    transpose(note: string, interval: string): string | undefined;
  };

  export function relative(key: string): string | undefined;
}

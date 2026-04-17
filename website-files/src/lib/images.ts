export type DirectusFile = {
  id: string;
  filename_disk: string;
  width?: number | null;
  height?: number | null;
  type?: string | null;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://rcnrmnwmhfqxcovixwms.supabase.co';
const BUCKET = 'media';

export function getImageUrl(file: DirectusFile | null | undefined): string | null {
  if (!file?.filename_disk) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.filename_disk}`;
}

export const FILE_FIELDS = ['id', 'filename_disk', 'width', 'height', 'type'] as const;

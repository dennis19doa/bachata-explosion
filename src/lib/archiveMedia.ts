const configuredOrigin = import.meta.env.PUBLIC_ARCHIVE_MEDIA_ORIGIN?.trim() ?? "";

export const archiveMediaOrigin = configuredOrigin.replace(/\/+$/, "");

export function getArchiveManifestUrl(slug: string) {
  return archiveMediaOrigin ? `${archiveMediaOrigin}/manifests/${slug}.json` : "";
}

import { useEffect, useId, useState } from "react";

interface Track {
  title: string;
  artist: string;
  note: string;
}

interface Props {
  seasonName: string;
  playlistId: string;
  tracks: Track[];
}

/**
 * Now playing (DESIGN.md section 5): one small line in the bottom-right corner.
 * Clicking it opens the season's playlist with a note under each song and the
 * Spotify embed. The embed loads only when first opened and never autoplays;
 * once loaded it stays mounted, so music keeps playing with the list closed
 * and across pages.
 */
export default function NowPlaying({ seasonName, playlistId, tracks }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const listId = useId();
  const lead = tracks[0];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!lead) return null;

  return (
    <div className="now-playing">
      {loaded && (
        <div id={listId} className="now-playing__list" role="region" aria-label={`${seasonName} playlist`} hidden={!open}>
          <ol>
            {tracks.map((track) => (
              <li key={`${track.title}-${track.artist}`}>
                <p className="type-small">
                  {track.title} / {track.artist}
                </p>
                <p className="type-body text-muted">{track.note}</p>
              </li>
            ))}
          </ol>
          <iframe
            title={`${seasonName} playlist on Spotify`}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?theme=0`}
            height="152"
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
      )}
      <button
        type="button"
        className="link now-playing__line"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          setLoaded(true);
          setOpen((value) => !value);
        }}
      >
        <i className="now-playing__dot" aria-hidden="true" />
        <span>
          {lead.title} / {lead.artist}
        </span>
      </button>
    </div>
  );
}

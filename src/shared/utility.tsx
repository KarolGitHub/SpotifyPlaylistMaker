export type SpotifyTrack = {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
  };
  year?: string;
  length?: string;
  uri?: string;
  preview_url?: string;
};

export type Track = {
  id: string;
  key?: number;
  name: string;
  artist: string;
  album: string;
  uri: string;
  preview_url: string;
};
export type Tracklist = Array<Track>;

// export type playStatus = 'PLAYING' | 'STOPPED' | 'PAUSED';

export type Tuple = [number, boolean, boolean];

export const updateObject = (oldObject: any, updatedProps?: any) => {
  return {
    ...oldObject,
    ...updatedProps,
  };
};

export const arrayDiff = (search: Tracklist, playlist: Tracklist) => [
  ...search.filter((searchItem) =>
    playlist.every((playlistItem) => searchItem.id !== playlistItem.id)
  ),
];

type Rules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isNumeric?: boolean;
};

export const isValid = (value = "", rules: Rules) => {
  let isValid = true;

  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid =
      value.trim() !== "" &&
      (rules.minLength ? value.length >= rules.minLength : true) &&
      (rules.maxLength ? value.length <= rules.maxLength : true);
  }
  return isValid;
};

export const authPopup = (url: string) => {
  const width = 500;
  const height = 500;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;

  const windowFeatures = `toolbar=0,scrollbars=1,status=1,resizable=0,location=1,menuBar=0,width=${width},height=${height},top=${top},left=${left}`;

  const newWindow = window.open(url, "Spotify Playlist Maker", windowFeatures);
  newWindow?.focus();
  return newWindow;
};

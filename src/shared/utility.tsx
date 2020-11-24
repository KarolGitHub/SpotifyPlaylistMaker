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
  artist?: string;
  album?: string;
  uri: string;
  preview_url: string;
};
export type Tracklist = Array<Track>;

export type SpotifyPlaylist = {
  id: string;
  name: string;
  owner: { id: string };
  public: boolean;
  collaborative: boolean;
  description: string;
  tracks: {
    uri: string;
    total: number;
  };
};

export type PlaylistPayload = {
  name: string;
  public: boolean;
  collaborative: boolean;
  description: string;
};

export type Playlist = {
  id: string;
  isEditable: boolean;
  payload: PlaylistPayload;
  tracks: { total: number; href: string };
};

export type PlaylistInfo = {
  id: string;
  isEditable: boolean;
  payload: PlaylistPayload;
  uri: string;
};

export type Tuple = [number, boolean, string];

export const updateObject = (oldObject: Object, updatedState?: any) => {
  return {
    ...oldObject,
    ...updatedState,
  };
};
export const updateArray = (oldArray: Array<any>, updatedState?: any) => {
  if (updatedState) {
    return [...oldArray, updatedState];
  } else {
    return [...oldArray];
  }
};
export const spreadNestedObject = (oldObject: Object) => {
  const updatedState: any = {};
  for (const [key, value] of Object.entries(oldObject)) {
    updatedState[key] = value;
  }
  return { ...updatedState };
};

export const tracksDiff = (search: Tracklist, playlist: Tracklist) => [
  ...search.filter((searchItem) =>
    playlist.every((playlistItem) => searchItem.id !== playlistItem.id)
  ),
];

export const reorderItems = (
  source: Tracklist,
  endIndex: number,
  droppableSource: any
) => {
  const sourceClone = Array.from(source);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  sourceClone.splice(endIndex, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;

  return result;
};

export const moveItems = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export const updatePlayTrackIndex = (
  playerState: Tuple,
  source: { index: number; droppableId: string },
  destination: { index: number; droppableId: string },
  dragActionType: 'reorder' | 'move'
): Tuple | null => {
  if (dragActionType === 'reorder') {
    if (source.index === playerState[0]) {
      return [destination.index, playerState[1], destination.droppableId];
    } else if (
      destination.index <= playerState[0] &&
      source.index > playerState[0]
    ) {
      return [playerState[0] + 1, playerState[1], destination.droppableId];
    } else if (
      destination.index >= playerState[0] &&
      source.index < playerState[0]
    ) {
      return [playerState[0] - 1, playerState[1], destination.droppableId];
    } else return null;
  } else {
    if (
      destination.index <= playerState[0] &&
      destination.droppableId === playerState[2]
    ) {
      return [playerState[0] + 1, playerState[1], destination.droppableId];
    } else if (
      source.index < playerState[0] &&
      destination.droppableId !== playerState[2]
    ) {
      return [playerState[0] - 1, playerState[1], playerState[2]];
    }
    if (
      source.index === playerState[0] &&
      source.droppableId === playerState[2]
    ) {
      return [destination.index, playerState[1], destination.droppableId];
    } else return null;
  }
};

type Rules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isNumeric?: boolean;
} | null;

export const isValid = (value = '', rules: Rules) => {
  let isValid = true;

  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid =
      value.trim() !== '' &&
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

  const newWindow = window.open(url, 'Spotify Playlist Maker', windowFeatures);
  newWindow?.focus();
};

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

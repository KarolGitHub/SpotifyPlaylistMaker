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
};

export type Track = {
  id: string;
  name: string;
  artist: string;
  album: string;
  uri: string;
};
export type Tracklist = Array<Track>;

export const updateObject = (oldObject: any, updatedProps?: any) => {
  return {
    ...oldObject,
    ...updatedProps,
  };
};

type Rules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isNumeric?: boolean;
};

export const isValid = (value = "", rules: Rules, isSignup = true) => {
  let isValid = true;

  if (!rules) {
    return true;
  }

  if (rules.required) {
    isValid = isSignup
      ? value.trim() !== "" &&
        (rules.minLength ? value.length >= rules.minLength : true) &&
        (rules.maxLength ? value.length <= rules.maxLength : true)
      : true;

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  }
};

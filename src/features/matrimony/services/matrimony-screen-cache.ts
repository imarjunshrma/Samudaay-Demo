import type {
  MatrimonyAccessRecord,
  MatrimonyProfileRecord,
  MatrimonyRequestRecord,
} from './matrimony-feed-service';

export type MatrimonyDiscoveryCacheRecord = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  ageHeight: string;
  education: string;
  profession: string;
  location: string;
  showOnlineStatus?: boolean;
  locked?: boolean;
  connection?: {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    chatId?: string | null;
    direction?: string;
  } | null;
};

type MatrimonyScreenCacheState = {
  discoveryProfiles: MatrimonyDiscoveryCacheRecord[];
  discoveryLoaded: boolean;
  discoveryError: string | null;
  discoveryQueryKey: string | null;
  discoveryPage: number;
  discoveryHasNextPage: boolean;
  requests: MatrimonyRequestRecord[];
  requestsLoaded: boolean;
  requestsError: string | null;
  access: MatrimonyAccessRecord | null;
  myProfile: MatrimonyProfileRecord | null;
  profileLoaded: boolean;
};

export const matrimonyScreenCache: MatrimonyScreenCacheState = {
  discoveryProfiles: [],
  discoveryLoaded: false,
  discoveryError: null,
  discoveryQueryKey: null,
  discoveryPage: 1,
  discoveryHasNextPage: false,
  requests: [],
  requestsLoaded: false,
  requestsError: null,
  access: null,
  myProfile: null,
  profileLoaded: false,
};

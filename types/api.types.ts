// types/api.types.ts
export type ISODateString = string;

/* ===== Shared Enums ===== */
export type OSType = "android" | "ios";
export type ServerMode = "test" | "live";
export type ServerCategory = "gaming" | "streaming";

export type AdType = "banner" | "interstitial" | "reward";
export type AdPosition = "home" | "splash" | "server" | "report";

/* ===== API Wrappers ===== */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * IMPORTANT: T is the ITEM type, not an array.
 * data will be T[]
 */
export interface ApiSuccessList<T> {
  success: true;
  pagination: Pagination;
  data: T[];
}

export interface ApiSuccessItem<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}

/* ===== Server configs ===== */
export interface OpenVPNConfig {
  username?: string;
  password?: string;
  config?: string;
}

export interface WireguardConfig {
  address?: string;
  config?: string;
}

/* ===== Server (flattened for list & by-id) ===== */
export interface ServerFlat {
  _id: string; // responses always have id
  name: string;
  categories: ServerCategory[];
  country: string;
  country_code: string;
  city: string;
  flag?: string; // list may include; by-id may omit
  is_pro: boolean;
  mode: ServerMode;
  ip: string;
  latitude: number;
  longitude: number;
  os_type: OSType;
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** By-id adds optional VPN configs */
export interface ServerDetail extends ServerFlat {
  openvpn_config?: OpenVPNConfig | null;
  wireguard_config?: WireguardConfig | null;
}

/** Grouped list item */
export interface GroupedServer {
  country: string;
  country_code: string;
  flag: string;
  servers: ServerFlat[];
}

/* ===== Server create/update request & mutation response ===== */
/** Matches Fastify JSON schema for create/update */
export type CreateServerRequest = {
  general: {
    name: string;
    categories: ServerCategory[];
    country: string;
    city: string;
    country_code: string;
    ip: string;
    latitude: number;
    longitude: number;
    os_type: OSType;
    is_pro?: boolean;
    mode?: ServerMode;
  };
  openvpn_config?: OpenVPNConfig | null;
  wireguard_config?: WireguardConfig | null;
};

export type UpdateServerRequest = Partial<CreateServerRequest>;

/** Server document shape returned by mutations (nested general) */
export type ServerDoc = {
  _id: string;
  general: {
    name: string;
    categories: ServerCategory[];
    country: string;
    city: string;
    country_code: string;
    ip: string;
    latitude: number;
    longitude: number;
    os_type: OSType;
    is_pro: boolean;
    mode: ServerMode;
  };
  openvpn_config?: OpenVPNConfig | null;
  wireguard_config?: WireguardConfig | null;
  created_at: ISODateString;
  updated_at: ISODateString;
};

/* ===== List / Item DTOs ===== */
export interface ListServersQuery {
  os_type?: OSType;
  mode?: ServerMode;
  search?: string;
  page?: number;
  limit?: number;
}

export type ListServerResponse = ApiSuccessList<ServerFlat>;
export type ListGroupedServersResponse = ApiSuccessList<GroupedServer>;
export type ServerByIdResponse = ApiSuccessItem<ServerDetail>;
export type MutateServerResponse = ApiSuccessItem<ServerDoc>;

/* ===== Ads ===== */

export interface Ad {
  _id: string;
  type: AdType;
  position: AdPosition;
  status: boolean;
  os_type: OSType;
  ad_id?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ListAdsQuery {
  os_type?: OSType;
  type?: AdType;
  position?: AdPosition;
  status?: boolean;
  page?: number;
  limit?: number;
}
export type ListAdsResponse = ApiSuccessList<Ad>;
export type GetAdByIdResponse = ApiSuccessItem<Ad>;

export interface Feedback {
  _id: string;
  server_id: string;
  reason: string;
  requested_server: string;
  rating: number; // 1-5
  review: string;
  os_type: OSType;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ListFeedbackQuery {
  page?: number;
  limit?: number;
  os_type?: OSType;
  rating?: number;
  reason?: string;
}
export type ListFeedbackResponse = ApiSuccessList<Feedback>;
export type GetFeedbackByIdResponse = ApiSuccessItem<Feedback>;

/* ===== Connectivity ===== */
export interface Connectivity {
  _id: string;
  user_id: string;
  server_id: string;
  connected_at: ISODateString;
  disconnected_at: ISODateString | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ListConnectivityQuery {
  user_id?: string;
  server_id?: string;
  from?: ISODateString;
  to?: ISODateString;
  page?: number;
  limit?: number;
}
export type ListConnectivityResponse = ApiSuccessList<Connectivity>;
export type GetConnectivityByIdResponse =
  | ApiSuccessItem<Connectivity>
  | ApiError;

/* ===== Pages ===== */
export interface Page {
  _id: string;
  type: string; // acts like a slug: "about", "contact", "terms-conditions"
  title: string;
  description: string; // HTML/text content
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ListPagesQuery {
  type?: string;
  title?: string;
  q?: string;
  page?: number;
  limit?: number;
}
export type ListPagesResponse = ApiSuccessList<Page>;
export type GetPageByIdResponse = ApiSuccessItem<Page>;
export type GetPageByTypeResponse = ApiSuccessItem<Page> | ApiError;

/* ===== Dropdowns ===== */
export interface DropdownValue {
  name: string;
  value: string;
}

export interface Dropdown {
  _id: string;
  name: string;
  values: DropdownValue[];
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ListDropdownsQuery {
  name?: string;
  page?: number;
  limit?: number;
}
export type ListDropdownsResponse = ApiSuccessList<Dropdown>;
export type GetDropdownByIdResponse = ApiSuccessItem<Dropdown>;
export type GetDropdownByNameResponse = ApiSuccessItem<Dropdown>;

/* ===== Summaries & Mappers ===== */
export interface ServerSummary {
  _id: string;
  name: string;
  os_type: OSType;
  mode: ServerMode;
  is_pro: boolean;
}

export interface AdSummary {
  _id: string;
  type: AdType;
  position: AdPosition;
  status: boolean;
  os_type: OSType;
}

export interface FeedbackSummary {
  _id: string;
  server_id: string;
  reason: string;
  rating: number;
  network_type: string;
}

export interface ConnectivitySummary {
  _id: string;
  user_id: string;
  server_id: string;
  connected_at: ISODateString;
}

export interface PageSummary {
  _id: string;
  title: string;
  slug: string; // maps to Page.type
  content: string; // maps to Page.description
}

export interface DropdownEntry {
  _id: string; // dropdown _id
  key: string; // dropdown name
  value: string;
}

export function toPageSummary(p: Page): PageSummary {
  return { _id: p._id, title: p.title, slug: p.type, content: p.description };
}

export function toDropdownEntries(d: Dropdown): DropdownEntry[] {
  return d.values.map((v) => ({ _id: d._id, key: d.name, value: v.value }));
}

export function toServerSummary(s: ServerFlat): ServerSummary {
  return {
    _id: s._id,
    name: s.name,
    os_type: s.os_type,
    mode: s.mode,
    is_pro: s.is_pro,
  };
}

/* ===== Dashboard Stats (NEW) ===== */

export type RecentActivityType = "server" | "ad" | "feedback" | "connection";

export interface RecentActivity {
  type: RecentActivityType;
  title: string;
  when: ISODateString;
  ref_id: string;
}

export interface DashboardServersBlock {
  total: number;
  by_os: Record<OSType, number>; // e.g., { android: 5, ios: 1 }
  by_mode: Record<ServerMode, number>; // e.g., { live: 5, test: 1 }
  pro: number; // count of pro servers
}

export interface DashboardConnectionsBlock {
  active: number;
  last_24h: number;
}

export interface DashboardFeedbackBlock {
  last_7d: number;
  avg_rating_30d: number;
  top_reasons_7d: string[];
}

export interface DashboardAdsBlock {
  active: number;
  total: number;
}

export interface DashboardStats {
  servers: DashboardServersBlock;
  connections: DashboardConnectionsBlock;
  feedback: DashboardFeedbackBlock;
  ads: DashboardAdsBlock;
  recent_activity: RecentActivity[];
}

export type GetDashboardStatsResponse =
  | ApiSuccessItem<DashboardStats>
  | ApiError;

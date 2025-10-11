// VynoxVPN API Types based on OpenAPI specification

import { OSType } from "@/types/api.types"

export interface Server {
  _id: string
  general: {
    name: string
    categories: ("gaming" | "streaming")[]
    country: string
    city: string
    country_code: string
    is_pro: boolean
    mode: "test" | "live" | "off"
    ip: string
    latitude: number
    longitude: number
    os_type: "android" | "ios"
  }
  openvpn_config?: {
    username: string
    password: string
    config: string
  }
  wireguard_config?: {
    address: string
    config: string
  }
  created_at: string
  updated_at: string
}

export interface Ad {
  _id: string
  type: "banner" | "interstitial" | "reward"
  position: "home" | "splash" | "server" | "report"
  status: boolean
  ad_id?: string
  os_type: OSType
  created_at: string
  updated_at: string
}

export interface Feedback {
  _id: string
  reason: string
  network_type: string
  requested_server: string
  server_id: string
  rating: number
  review: string
  additional_data?: Record<string, any>
  datetime: string
  created_at: string
  updated_at: string
}

export interface Connectivity {
  _id: string
  user_id: string
  server_id: string
  connected_at: string
  disconnected_at: string | null
  created_at: string
  updated_at: string
}

export interface Dropdown {
  _id: string
  name: string
  values: Array<{
    name: string
    value: string
  }>
  created_at: string
  updated_at: string
}

export interface Page {
  _id: string
  type: string
  title: string
  description: string
  created_at: string
  updated_at: string
}


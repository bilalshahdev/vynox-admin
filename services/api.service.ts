class ApiService {
  private baseURL = "http://localhost:3333/api/v1"

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Servers
  async getServers(page = 1, limit = 20) {
    return this.request(`/servers?page=${page}&limit=${limit}`)
  }

  async createServer(data: any) {
    return this.request("/servers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateServer(id: string, data: any) {
    return this.request(`/servers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteServer(id: string) {
    return this.request(`/servers/${id}`, {
      method: "DELETE",
    })
  }

  // Ads
  async getAds(page = 1, limit = 20) {
    return this.request(`/ads?page=${page}&limit=${limit}`)
  }

  async createAd(data: any) {
    return this.request("/ads", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateAd(id: string, data: any) {
    return this.request(`/ads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteAd(id: string) {
    return this.request(`/ads/${id}`, {
      method: "DELETE",
    })
  }

  // Feedback
  async getFeedback(page = 1, limit = 20) {
    return this.request(`/feedback?page=${page}&limit=${limit}`)
  }

  // Connectivity
  async getConnectivity(page = 1, limit = 20) {
    return this.request(`/connectivity?page=${page}&limit=${limit}`)
  }

  // Pages
  async getPages(page = 1, limit = 20) {
    return this.request(`/pages?page=${page}&limit=${limit}`)
  }

  async createPage(data: any) {
    return this.request("/pages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updatePage(id: string, data: any) {
    return this.request(`/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, {
      method: "DELETE",
    })
  }

  // Dropdowns
  async getDropdowns(page = 1, limit = 20) {
    return this.request(`/dropdowns?page=${page}&limit=${limit}`)
  }

  async createDropdown(data: any) {
    return this.request("/dropdowns", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateDropdown(id: string, data: any) {
    return this.request(`/dropdowns/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteDropdown(id: string) {
    return this.request(`/dropdowns/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiService = new ApiService()

export type Profile = {
  id: string
  email: string | null
  phone: string | null
  nickname: string | null
  avatar_url: string | null
  role: 'admin' | 'user' | 'guide'
  created_at: string
  updated_at: string
}

export type Guide = {
  id: string
  user_id: string | null
  name: string
  phone: string | null
  avatar_url: string | null
  title: string | null
  rating: number | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export type Demand = {
  id: string
  user_id: string | null
  city: string | null
  attractions: string[] | null
  budget: number | null
  plan_time: string | null
  description: string | null
  status: 'pending' | 'matched' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  demand_id: string | null
  user_id: string | null
  guide_id: string | null
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  amount: number | null
  created_at: string
  updated_at: string
}

export type Complaint = {
  id: string
  order_id: string | null
  type: 'order' | 'chat'
  content: string
  status: 'pending' | 'resolved'
  created_at: string
}

export type GuideTitle = {
  id: string
  name: string
  level: number
  requirements: string | null
  created_at: string
  updated_at: string
}

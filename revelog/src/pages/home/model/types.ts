export interface CareerProject {
  id: string
  period: string
  title: string
  summary: string
  details: string[]
  skills: string[]
  url?: string
  links?: { label: string; url: string }[]
  outcome?: { value: string; label: string }
}

export interface Experience {
  id: string
  name: string
  url: string
  team: string
  period: string
  projects: CareerProject[]
}

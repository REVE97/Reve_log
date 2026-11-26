export interface SideProject {
  id: string
  name: string
  subtitle: string
  period: string
  github: string
  skills: string[]
  overview: string[]
  overviewHighlight?: string
  demo?: { url: string; qrCode: string; username: string; password: string }
  screens?: { src: string; label: string }[]
  showcase?: { src: string; label: string }
  features: { icon: string; title: string; description: string }[]
  implementation: { icon: string; title: string; details: string[] }[]
}

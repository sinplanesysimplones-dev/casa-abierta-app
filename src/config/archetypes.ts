export interface Archetype {
  name: string
  emoji: string
  color: string
  description: string
}

export const ARCHETYPES: Record<string, Archetype> = {
  'Búho': {
    name: 'Búho',
    emoji: '🦉',
    color: '#1B3A4B',
    description: 'Estratega'
  },
  'Zorro': {
    name: 'Zorro',
    emoji: '🦊',
    color: '#E8743B',
    description: 'Conector'
  },
  'Guepardo': {
    name: 'Guepardo',
    emoji: '🐆',
    color: '#F4B942',
    description: 'Ejecutor'
  },
  'Abeja': {
    name: 'Abeja',
    emoji: '🐝',
    color: '#D6336C',
    description: 'Creativa'
  },
  'Tortuga': {
    name: 'Tortuga',
    emoji: '🐢',
    color: '#5B8C5A',
    description: 'Cuidadosa'
  }
}

export function getArchetype(name: string): Archetype | undefined {
  return ARCHETYPES[name]
}

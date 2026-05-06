import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  firstName:  string
  lastName:   string
  email:      string
  avatar:     string | null
  coverColor: string
  coverImage: string | null
}

const DEFAULT_USER: User = {
  firstName:  'Nghia',
  lastName:   '',
  email:      'btn2812@gmail.com',
  avatar:     null,
  coverColor: 'linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)',
  coverImage: null,
}

interface UserContextValue {
  user:           User
  initials:       string
  setFirstName:   (v: string) => void
  setLastName:    (v: string) => void
  setEmail:       (v: string) => void
  setAvatar:      (v: string | null) => void
  setCoverColor:  (v: string) => void
  setCoverImage:  (v: string | null) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem('todo:user')
      return raw ? { ...DEFAULT_USER, ...JSON.parse(raw) } : DEFAULT_USER
    } catch {
      return DEFAULT_USER
    }
  })

  useEffect(() => {
    localStorage.setItem('todo:user', JSON.stringify(user))
  }, [user])

  const initials = [user.firstName, user.lastName]
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2) || 'U'

  return (
    <UserContext.Provider value={{
      user,
      initials,
      setFirstName:  (v) => setUser(u => ({ ...u, firstName: v })),
      setLastName:   (v) => setUser(u => ({ ...u, lastName: v })),
      setEmail:      (v) => setUser(u => ({ ...u, email: v })),
      setAvatar:     (v) => setUser(u => ({ ...u, avatar: v })),
      setCoverColor: (v) => setUser(u => ({ ...u, coverColor: v })),
      setCoverImage: (v) => setUser(u => ({ ...u, coverImage: v })),
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserContext must be used inside UserProvider')
  return ctx
}

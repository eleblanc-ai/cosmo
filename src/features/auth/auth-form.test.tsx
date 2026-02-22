import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AuthForm } from './auth-form'

const mockSignIn = vi.hoisted(() => vi.fn().mockResolvedValue({ error: null }))
const mockSignUp = vi.hoisted(() => vi.fn().mockResolvedValue({ user: { id: 'test-user' }, error: null }))

vi.mock('./auth-provider', () => ({
  useAuth: () => ({
    session: null,
    loading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: vi.fn(),
  }),
}))

describe('AuthForm', () => {
  it('renders email and password fields', () => {
    render(<AuthForm />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('calls signIn with email and password on submit', async () => {
    render(<AuthForm />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('toggles to sign-up mode', async () => {
    render(<AuthForm />)
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows confirmation message and switches to sign-in after successful sign-up', async () => {
    render(<AuthForm />)
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await userEvent.type(screen.getByPlaceholderText('Email'), 'new@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))
    expect(screen.getByText(/account created/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })
})

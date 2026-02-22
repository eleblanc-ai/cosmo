import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './theme-provider'

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('applies theme class to document root', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    const theme = screen.getByTestId('theme').textContent!
    expect(document.documentElement.classList.contains(theme)).toBe(true)
  })

  it('toggles theme on click', async () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    const initial = screen.getByTestId('theme').textContent
    await userEvent.click(screen.getByText('toggle'))
    const toggled = screen.getByTestId('theme').textContent
    expect(toggled).not.toBe(initial)
    expect(document.documentElement.classList.contains(toggled!)).toBe(true)
  })

  it('persists theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('toggle'))
    const theme = screen.getByTestId('theme').textContent
    expect(localStorage.getItem('theme')).toBe(theme)
  })
})

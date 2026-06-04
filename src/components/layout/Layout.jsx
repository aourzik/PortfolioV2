import { useLenis } from '../../hooks/useLenis'
import CustomCursor from '../cursor/CustomCursor'

export default function Layout({ children }) {
  useLenis()

  return (
    <>
      <CustomCursor />
      {children}
    </>
  )
}

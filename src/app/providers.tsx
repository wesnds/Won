import { PropsWithChildren } from 'react'

import GlobaStyles from '@/styles/global'

export function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <GlobaStyles />
      {children}
    </>
  )
}

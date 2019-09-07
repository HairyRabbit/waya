import Root from '@/App.tsx'
import store from '@/store.ts'
import { Provider } from 'react-redux'
import { createElement as h, StrictMode } from 'react'

export default h(StrictMode, null, h(Provider, { store }, h(Root, null)))
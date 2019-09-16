import Root from '@/App.tsx'
// import store from '@/store'
// import { Provider } from 'react-redux'
// import { hot } from 'react-hot-loader'
import { createElement as h, StrictMode } from 'react'
export default h(StrictMode, null, h(Root, null))
// export default hot(module)(() => h(StrictMode, null, h(Root, null)))

// export default h(StrictMode, null, h(Provider, { store }, h(Root, null)))

// let isStore: boolean = false
// try {
//   require.resolve('@/store')
//   isStore = true
// } catch(_e) { isStore = false }

// let root

// if(isStore) {
//   const store = require('@/store').default
//   root = h(StrictMode, null, h(Provider, { store }, h(Root, null)))
// } else {
//   root = h(StrictMode, null, h(Root, null))
// }

// export default root
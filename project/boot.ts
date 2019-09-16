import { render } from 'react-dom'
// import { createElement } from 'react'
// import app from '@/index'
// import { hot } from 'react-hot-ts'


const update = () => {
const app = require('@/index').default
const node = document.getElementById('app')
render(app, node)
}

if(module.hot) {
  module.hot.accept(['@/index'], update)
  module.hot.dispose()
}

update()
// render(createElement(app), node)
// hot(module)(
//   // render(createElement(app), node)
//   render(app, node)
// )
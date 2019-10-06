import * as postcss from 'postcss'

function transformInjectRootCssVariable(json: { [key: string]: string } = {}) {
  return (root: postcss.Root) => {
    let rootRule: postcss.Rule | undefined
    root.each(node => {
      if(!isRootRule(node)) return
      rootRule = node
    })

    if(rootRule) {
      transformJson(rootRule, json)
    } else {
      root.prepend({ selector: ':root' })
      transformJson(root.nodes![0] as postcss.Rule, json)
    }
  }
}

function isRootRule(node: postcss.Node): node is postcss.Rule {
  return node.type === `rule` && /:root/i.test(node.selector)
}


function transformJson(rule: postcss.Rule , json: { [key: string]: string }) {
  Object.keys(json).reverse().forEach(key => {
    const value = json[key]
    const prop = key.startsWith(`--`) ? key : `--` + key
    rule.prepend({ prop, value })
  })
}

export default postcss.plugin(`postcss-inject-root-css-variable-transformer`, transformInjectRootCssVariable)

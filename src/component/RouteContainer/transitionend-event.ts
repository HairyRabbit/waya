export default function handleTransitionEnd(node: HTMLElement, done:() => void) {
  return node.addEventListener("transitionend", done, false)
}
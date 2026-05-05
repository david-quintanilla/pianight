export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  const remove = () => {
    document.querySelectorAll('dev-toolkit, nuxt-devtools-inspect-panel').forEach(el => el.remove())
  }

  remove()

  const observer = new MutationObserver(remove)
  observer.observe(document.body, { childList: true })
})

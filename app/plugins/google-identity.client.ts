export default defineNuxtPlugin(() => {
  if (document.getElementById('google-identity-services')) return
  const script = document.createElement('script')
  script.id = 'google-identity-services'
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})

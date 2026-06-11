import { ref, computed } from 'vue'

const permission = ref<NotificationPermission>(
  'Notification' in window ? Notification.permission : 'denied'
)

export function usePushNotifications() {
  const isSupported = computed(() => 'Notification' in window)

  async function requestPermission(): Promise<NotificationPermission> {
    if (!isSupported.value) return 'denied'
    const result = await Notification.requestPermission()
    permission.value = result
    return result
  }

  function notify(title: string, options?: NotificationOptions) {
    if (!isSupported.value || permission.value !== 'granted') return
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })
  }

  return { isSupported, permission, requestPermission, notify }
}

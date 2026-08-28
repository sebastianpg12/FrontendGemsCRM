// Estado compartido para la intro cinemática (experimento).
// Vive fuera de cualquier página para sobrevivir la navegación entre rutas
// (Login/OrgSelector → dashboard) — así el video no se corta al cambiar de página.
import { ref } from 'vue'

export const introTrigger = ref(0)

export function triggerIntroVideo() {
  introTrigger.value++
}

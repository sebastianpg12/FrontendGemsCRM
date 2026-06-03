import Swal from 'sweetalert2'

/**
 * GEMS CRM — Ultra-Premium Notification System (v3)
 * Enfoque: Minimalismo extremo, tipografía refinada y cero elementos distractores.
 */

const base = {
  background: 'transparent',
  showConfirmButton: false,
  backdrop: false,
  allowOutsideClick: true,
  position: 'top' as const,
  timerProgressBar: false, // ELIMINADA LA BARRA DE PROGRESO POR PETICIÓN
  customClass: {
    popup:          'crm-premium-pill',
    title:          'crm-premium-title',
    htmlContainer:  'crm-premium-body',
  },
  showClass: { popup: 'crm-ani-in' },
  hideClass: { popup: 'crm-ani-out' },
  buttonsStyling: false,
}

export const useNotifications = () => {

  const showSuccess = (title: string, _message?: string) => toast(title, 'success')
  const showError = (title: string, message?: string) => toast(title || message || 'Error', 'error')
  const showWarning = (title: string, message?: string) => toast(title || message || 'Advertencia', 'warning')
  const showInfo = (title: string, _message?: string) => toast(title, 'info')

  const toast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const config = {
      success: { icon: 'fa-check', color: '#10b981' },
      error:   { icon: 'fa-times', color: '#f43f5e' },
      warning: { icon: 'fa-exclamation', color: '#f59e0b' },
      info:    { icon: 'fa-info', color: '#3b82f6' },
    }

    return Swal.fire({
      ...base,
      timer: 2500,
      toast: true,
      customClass: {
        popup: `crm-pill-toast crm-pill-${type}`,
      },
      html: `
        <div class="crm-pill-wrapper">
          <div class="crm-pill-icon-box" style="background: ${config[type].color}">
            <i class="fas ${config[type].icon}"></i>
          </div>
          <span class="crm-pill-message">${message}</span>
        </div>
      `,
    })
  }

  /** Modal de límite de plan — invita al upgrade */
  const showPlanLimitModal = (opts: {
    message: string
    limit: number
    current: number
    type?: 'users' | 'tasks' | string
  }) => {
    const labels: Record<string, string> = {
      users: 'usuarios',
      tasks: 'tareas',
    }
    const label = labels[opts.type ?? ''] ?? 'registros'
    return Swal.fire({
      ...base,
      position: 'center',
      backdrop: 'rgba(15,23,42,0.55)',
      allowOutsideClick: true,
      timer: undefined,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Mejorar plan',
      cancelButtonText: 'Cerrar',
      customClass: {
        popup: 'crm-plan-limit-modal',
        confirmButton: 'crm-btn-upgrade',
        cancelButton: 'crm-btn-keep',
      },
      html: `
        <div class="crm-plan-limit-body">
          <div class="crm-plan-limit-icon">
            <i class="fas fa-rocket"></i>
          </div>
          <h3 class="crm-plan-limit-title">Límite del plan alcanzado</h3>
          <p class="crm-plan-limit-msg">${opts.message}</p>
          <div class="crm-plan-limit-meter">
            <div class="crm-plan-limit-meter-bar">
              <div class="crm-plan-limit-meter-fill" style="width:100%"></div>
            </div>
            <span class="crm-plan-limit-meter-label">${opts.current} / ${opts.limit} ${label}</span>
          </div>
          <p class="crm-plan-limit-cta">Actualiza tu plan para seguir creciendo con GEMS.</p>
        </div>
      `,
    })
  }

  /** Confirmación de eliminación — Manteniendo minimalismo */
  const confirmDelete = (itemName: string) =>
    Swal.fire({
      ...base,
      icon: 'warning',
      title: '¿Eliminar?',
      text: itemName,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText:  'No',
      position: 'center',
      customClass: {
        popup: 'crm-confirm-modal',
        confirmButton: 'crm-btn-del',
        cancelButton: 'crm-btn-keep',
      },
    })

  const showLoading = (title = 'Sincronizando...') =>
    Swal.fire({
      ...base,
      toast: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        popup: 'crm-pill-toast crm-pill-loading',
      },
      html: `
        <div class="crm-pill-wrapper">
          <div class="crm-pill-icon-box crm-pill-spinner-box">
            <i class="fas fa-circle-notch fa-spin"></i>
          </div>
          <span class="crm-pill-message">${title}</span>
        </div>
      `,
    })

  const closeLoading = () => Swal.close()

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPlanLimitModal,
    confirmDelete,
    showLoading,
    closeLoading,
    toast,
  }
}

export const injectSwalStyles = () => {
  if (typeof document === 'undefined') return
  const style = document.createElement('style')
  style.id = 'crm-swal-styles'
  style.textContent = `
/* ── Estética Premium Pill ── */
.crm-pill-toast {
  background: #ffffff !important;
  border-radius: 100px !important;
  padding: 0.4rem 0.8rem !important;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.15) !important;
  border: 1px solid rgba(0,0,0,0.03) !important;
  margin-top: 1.2rem !important;
  width: auto !important;
  min-width: 220px !important;
  max-width: 400px !important;
}

.crm-pill-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.crm-pill-icon-box {
  width: 24px !important;
  height: 24px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: white !important;
  font-size: 0.7rem !important;
  flex-shrink: 0 !important;
}

.crm-pill-spinner-box {
  background: #64748b !important;
}

.crm-pill-message {
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
  color: #334155 !important;
  font-size: 0.75rem !important; /* TEXTO MÁS PEQUEÑO Y REFINADO */
  letter-spacing: -0.01em !important;
  white-space: nowrap !important;
}

/* ── Confirmación ── */
.crm-confirm-modal {
  background: white !important;
  border-radius: 1.5rem !important;
  padding: 2rem !important;
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1) !important;
}
.crm-btn-del { background: #f43f5e !important; color: white !important; padding: 0.6rem 1.5rem !important; border-radius: 0.75rem !important; font-weight: 800 !important; font-size: 0.75rem !important; margin: 0 5px !important; }
.crm-btn-keep { background: #f1f5f9 !important; color: #64748b !important; padding: 0.6rem 1.5rem !important; border-radius: 0.75rem !important; font-weight: 800 !important; font-size: 0.75rem !important; margin: 0 5px !important; }

/* ── Animaciones ── */
@keyframes crm-ani-in {
  from { transform: translate3d(0, -30px, 0) scale(0.95); opacity: 0; }
  to { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
}
@keyframes crm-ani-out {
  to { transform: translate3d(0, -20px, 0) scale(0.95); opacity: 0; }
}
.crm-ani-in { animation: crm-ani-in 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards !important; }
.crm-ani-out { animation: crm-ani-out 0.3s ease-in forwards !important; }

/* ── Ocultar Progress Bar ── */
.swal2-timer-progress-bar { display: none !important; }
.swal2-timer-progress-bar-container { display: none !important; }

/* ── Plan Limit Modal ── */
.crm-plan-limit-modal {
  background: white !important;
  border-radius: 1.75rem !important;
  padding: 2rem !important;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15) !important;
  max-width: 420px !important;
}
.crm-plan-limit-body {
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center;
}
.crm-plan-limit-icon {
  width: 56px; height: 56px; border-radius: 1rem;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1.5rem;
  box-shadow: 0 8px 20px -6px rgba(124,58,237,0.5);
  margin-bottom: 0.25rem;
}
.crm-plan-limit-title {
  font-family: 'Inter', sans-serif !important;
  font-size: 1rem !important; font-weight: 800 !important;
  color: #0f172a !important; margin: 0 !important;
}
.crm-plan-limit-msg {
  font-family: 'Inter', sans-serif !important;
  font-size: 0.8125rem !important; font-weight: 500 !important;
  color: #64748b !important; margin: 0 !important; line-height: 1.5 !important;
}
.crm-plan-limit-meter {
  width: 100%; display: flex; flex-direction: column; gap: 0.375rem; margin: 0.25rem 0;
}
.crm-plan-limit-meter-bar {
  width: 100%; height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
}
.crm-plan-limit-meter-fill {
  height: 100%; background: linear-gradient(90deg, #f43f5e, #fb923c);
  border-radius: 99px; transition: width 0.6s ease;
}
.crm-plan-limit-meter-label {
  font-family: 'Inter', sans-serif !important;
  font-size: 0.7rem !important; font-weight: 700 !important;
  color: #f43f5e !important; text-align: right !important;
}
.crm-plan-limit-cta {
  font-family: 'Inter', sans-serif !important;
  font-size: 0.75rem !important; color: #94a3b8 !important;
  margin: 0 !important;
}
.crm-btn-upgrade {
  background: linear-gradient(135deg, #7c3aed, #a855f7) !important;
  color: white !important; padding: 0.65rem 1.75rem !important;
  border-radius: 0.875rem !important; font-weight: 800 !important;
  font-size: 0.75rem !important; margin: 0 5px !important;
  box-shadow: 0 4px 12px -4px rgba(124,58,237,0.4) !important;
  border: none !important; cursor: pointer !important;
}
.crm-btn-upgrade:hover { opacity: 0.9 !important; }

/* ── Limpieza global ── */
.swal2-backdrop-show { background: transparent !important; backdrop-filter: none !important; }
.swal2-container { pointer-events: none !important; }
.swal2-popup { pointer-events: auto !important; }
/* Plan limit modal necesita backdrop interactivo */
.swal2-container:has(.crm-plan-limit-modal) { pointer-events: auto !important; }
`
  const existing = document.getElementById('crm-swal-styles')
  if (existing) existing.remove()
  document.head.appendChild(style)
}

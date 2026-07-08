import { Alert, Platform } from 'react-native';

// Confirmación cross-platform (ej. Logout / cancelar pedido). En web Alert.alert con
// botones es no-op, así que usamos window.confirm (síncrono y bloqueante).
export function confirmAction({
  title,
  message,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === 'web') {
    if (window.confirm(message ? `${title}\n\n${message}` : title)) onConfirm?.();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

// Aviso simple cross-platform CON callback opcional (ej. éxitos/errores que navegan o limpian).
// El callback corre SIEMPRE dentro del flujo del aviso → paridad web/nativo.
export function notify(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    onConfirm?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'Aceptar', onPress: onConfirm }]);
}

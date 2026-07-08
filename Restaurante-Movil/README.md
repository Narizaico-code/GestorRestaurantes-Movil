# Restaurante-Movil — App de cliente (React Native + Expo)

App móvil para clientes del **Gestor de Restaurantes**. Replica la arquitectura de
`Bancario-Movil` descrita en [`../ARCHITECTURE.md`](../ARCHITECTURE.md) y la adapta al
dominio de restaurantes: explorar restaurantes, ver su carta, reservar mesa, hacer
pedidos (para llevar / a domicilio), consultar promociones y dejar reseñas.

## Stack

| Categoría | Tecnología |
|---|---|
| Framework | Expo SDK 56 + React Native 0.85 |
| Lenguaje | JavaScript (JSX, sin TypeScript) |
| Navegación | React Navigation 7 (native-stack + bottom-tabs) |
| Estado global | Zustand 5 (con `persist`) |
| Formularios | react-hook-form 7 (patrón `Controller`) |
| HTTP | Axios (instancias separadas: `authClient` + `apiClient`) |
| Almacenamiento | AsyncStorage (sesión) + expo-secure-store (token) |
| Iconos / Fuentes | `@expo/vector-icons` (MaterialIcons) · Space Grotesk + Literata |

**Arquitectura:** *feature-based* — el código se organiza por funcionalidad de
negocio, no por tipo de archivo. Todo lo transversal vive en `src/shared/`.

## Estructura

```
Restaurante-Movil/
├── App.jsx                 # Raíz: fuentes + SafeAreaProvider + AppNavigator + StatusBar
├── index.js                # registerRootComponent(App)
├── app.json · .env         # Config Expo + URLs de API (EXPO_PUBLIC_*)
├── assets/images/          # Iconos / splash / favicon
└── src/
    ├── navigation/         # AppNavigator (Auth vs Main) · AuthStack · MainTabs
    ├── features/           # Un directorio por dominio (hooks + screens)
    │   ├── auth/           # Welcome, Login, Register, VerifyEmail, ForgotPassword
    │   ├── home/           # Dashboard: destacados, promos, accesos rápidos
    │   ├── restaurants/    # Lista + Detalle (carta con carrito + reseñas)
    │   ├── menus/          # Hook de la carta agrupada por categoría
    │   ├── reviews/        # Hook de reseñas (leer + crear)
    │   ├── reservations/   # Mis reservaciones, Nueva reservación, Detalle, mesas
    │   ├── orders/         # Mis pedidos, Carrito/checkout, Detalle
    │   ├── promotions/     # Promociones activas
    │   └── profile/        # Perfil, Editar perfil, header
    └── shared/
        ├── api/            # authClient · apiClient · buildFormData · getApiError
        ├── store/          # authStore (sesión) · cartStore (carrito)
        ├── hooks/          # useThemeStore (light/dark)
        ├── constants/      # theme.js (design tokens) · endpoints.js · dominio
        ├── components/     # Button, Input, Selector, Common (Card/Badge/Rating/Stepper), Gradient, ErrorBoundary
        └── utils/          # confirm (Alert cross-platform) · format · imagePicker
```

## Patrones clave (heredados de la arquitectura)

- **Screens "tontas", hooks "inteligentes":** cada feature separa `hooks/`
  (estado + llamadas a API + `mapXToViewModel`) de `screens/` (presentación +
  wiring con react-hook-form).
- **Navegación condicional por sesión:** `AppNavigator` intercambia el árbol
  completo (`AuthStack` ↔ `MainTabs`) según `isAuthenticated`, con guarda
  anti-parpadeo mientras Zustand rehidrata (`_hasHydrated`).
- **Tabs con stacks anidados:** Inicio · Restaurantes · Reservas · Pedidos · Perfil.
- **Dos clientes Axios** con interceptores (inyección de token + manejo de 401):
  `authClient` → AuthService (`:3005`), `apiClient` → Gestor de Restaurantes (`:3006`).
- **Design tokens únicos** en `theme.js` (paleta cálida terracota + ámbar, light/dark).
- **`buildFormData`** para multipart en RN (registro con foto, reserva con foto).

## Configuración

1. Instala dependencias:
   ```bash
   npm install       # o: pnpm install
   ```
2. Ajusta `.env` con la **IP LAN** de tu backend (no `localhost` en dispositivo físico):
   ```env
   EXPO_PUBLIC_AUTH_URL=http://TU_IP:3005/api/v1
   EXPO_PUBLIC_API_URL=http://TU_IP:3006/gestorRestaurantes/api/v1
   ```
3. Arranca los backends `AuthService-GestorRestaurantes` (3005) y
   `GestorRestaurantesBackend` (3006).
4. Levanta la app:
   ```bash
   npm start         # Expo — escanea el QR con Expo Go
   ```

## Notas de dominio

- **Registro:** el AuthService no devuelve token al registrar; la cuenta requiere
  **verificar el correo** antes de iniciar sesión (pantalla `VerifyEmail`).
- **Pedidos desde el móvil:** se ofrecen `PARA_LLEVAR` y `A_DOMICILIO` (comer en el
  restaurante lo gestiona el mesero con una mesa asignada). A domicilio suma un
  costo fijo de envío (Q20, igual que el backend).
- **Reservaciones:** se seleccionan mesas activas del restaurante; el backend valida
  capacidad combinada y conflictos de horario.
- **Carrito:** pertenece a un solo restaurante; agregar un platillo de otro lo
  reemplaza (el backend crea un pedido por restaurante).
```

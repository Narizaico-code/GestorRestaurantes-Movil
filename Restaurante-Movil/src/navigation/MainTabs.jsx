import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { FONTS, FONT_SIZE } from '../shared/constants/theme';
import { useThemeStore } from '../shared/hooks/useThemeStore';
import { withErrorBoundary } from '../shared/components';

import { HomeScreen } from '../features/home/screens/HomeScreen';
import { RestaurantsScreen } from '../features/restaurants/screens/RestaurantsScreen';
import { RestaurantDetailScreen } from '../features/restaurants/screens/RestaurantDetailScreen';
import { ReservationsScreen } from '../features/reservations/screens/ReservationsScreen';
import { NewReservationScreen } from '../features/reservations/screens/NewReservationScreen';
import { EditReservationScreen } from '../features/reservations/screens/EditReservationScreen';
import { ReservationDetailScreen } from '../features/reservations/screens/ReservationDetailScreen';
import { OrdersScreen } from '../features/orders/screens/OrdersScreen';
import { CartScreen } from '../features/orders/screens/CartScreen';
import { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
import { ChangePasswordScreen } from '../features/profile/screens/ChangePasswordScreen';
import { DeleteAccountScreen } from '../features/profile/screens/DeleteAccountScreen';
import { PromotionsScreen } from '../features/promotions/screens/PromotionsScreen';

const Tab = createBottomTabNavigator();

// Cada pantalla envuelta en ErrorBoundary: un error de render muestra un fallback
// con "Reintentar" en lugar de dejar la página totalmente en blanco.
const S = {
  Home: withErrorBoundary(HomeScreen),
  RestaurantsList: withErrorBoundary(RestaurantsScreen),
  RestaurantDetail: withErrorBoundary(RestaurantDetailScreen),
  MyReservations: withErrorBoundary(ReservationsScreen),
  NewReservation: withErrorBoundary(NewReservationScreen),
  EditReservation: withErrorBoundary(EditReservationScreen),
  ReservationDetail: withErrorBoundary(ReservationDetailScreen),
  MyOrders: withErrorBoundary(OrdersScreen),
  Cart: withErrorBoundary(CartScreen),
  OrderDetail: withErrorBoundary(OrderDetailScreen),
  Profile: withErrorBoundary(ProfileScreen),
  EditProfile: withErrorBoundary(EditProfileScreen),
  ChangePassword: withErrorBoundary(ChangePasswordScreen),
  DeleteAccount: withErrorBoundary(DeleteAccountScreen),
  Promotions: withErrorBoundary(PromotionsScreen),
};

// Opciones de header devueltas dinámicamente según el tema.
const getStackScreenOptions = (colors) => ({
  headerStyle: { backgroundColor: colors.brand },
  headerTintColor: colors.white,
  headerTitleStyle: { fontFamily: FONTS.displayBold, fontWeight: '700', fontSize: FONT_SIZE.lg },
  headerShadowVisible: true,
  contentStyle: { backgroundColor: colors.background },
});

// --- Stack: Inicio ---
const HomeStackNav = createNativeStackNavigator();
function HomeStack() {
  const { colors } = useThemeStore();
  return (
    <HomeStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <HomeStackNav.Screen name="Home" component={S.Home} options={{ title: 'Sabor a la Carta' }} />
    </HomeStackNav.Navigator>
  );
}

// --- Stack: Restaurantes ---
const RestaurantsStackNav = createNativeStackNavigator();
function RestaurantsStack() {
  const { colors } = useThemeStore();
  return (
    <RestaurantsStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <RestaurantsStackNav.Screen name="RestaurantsList" component={S.RestaurantsList} options={{ title: 'Restaurantes' }} />
      <RestaurantsStackNav.Screen name="RestaurantDetail" component={S.RestaurantDetail} options={{ title: 'Restaurante' }} />
    </RestaurantsStackNav.Navigator>
  );
}

// --- Stack: Reservas ---
const ReservationsStackNav = createNativeStackNavigator();
function ReservationsStack() {
  const { colors } = useThemeStore();
  return (
    <ReservationsStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <ReservationsStackNav.Screen name="MyReservations" component={S.MyReservations} options={{ title: 'Mis Reservaciones' }} />
      <ReservationsStackNav.Screen name="NewReservation" component={S.NewReservation} options={{ title: 'Nueva Reservación' }} />
      <ReservationsStackNav.Screen name="EditReservation" component={S.EditReservation} options={{ title: 'Editar Reservación' }} />
      <ReservationsStackNav.Screen name="ReservationDetail" component={S.ReservationDetail} options={{ title: 'Detalle de Reservación' }} />
    </ReservationsStackNav.Navigator>
  );
}

// --- Stack: Pedidos (+ Carrito) ---
const OrdersStackNav = createNativeStackNavigator();
function OrdersStack() {
  const { colors } = useThemeStore();
  return (
    <OrdersStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <OrdersStackNav.Screen name="MyOrders" component={S.MyOrders} options={{ title: 'Mis Pedidos' }} />
      <OrdersStackNav.Screen name="Cart" component={S.Cart} options={{ title: 'Mi Carrito' }} />
      <OrdersStackNav.Screen name="OrderDetail" component={S.OrderDetail} options={{ title: 'Detalle del Pedido' }} />
    </OrdersStackNav.Navigator>
  );
}

// --- Stack: Perfil (+ Promociones) ---
const ProfileStackNav = createNativeStackNavigator();
function ProfileStack() {
  const { colors } = useThemeStore();
  return (
    <ProfileStackNav.Navigator screenOptions={getStackScreenOptions(colors)}>
      <ProfileStackNav.Screen name="Profile" component={S.Profile} options={{ title: 'Mi Perfil' }} />
      <ProfileStackNav.Screen name="EditProfile" component={S.EditProfile} options={{ title: 'Editar Perfil' }} />
      <ProfileStackNav.Screen name="ChangePassword" component={S.ChangePassword} options={{ title: 'Cambiar Contraseña' }} />
      <ProfileStackNav.Screen name="DeleteAccount" component={S.DeleteAccount} options={{ title: 'Eliminar Cuenta' }} />
      <ProfileStackNav.Screen name="Promotions" component={S.Promotions} options={{ title: 'Promociones' }} />
    </ProfileStackNav.Navigator>
  );
}

const TAB_ICONS = {
  Inicio: 'home',
  Restaurantes: 'restaurant',
  Reservas: 'event-seat',
  Pedidos: 'receipt-long',
  Perfil: 'person',
};

// Pantalla raíz de cada tab. Al tocar el tab volvemos aquí (evita quedar en un detalle).
const TAB_ROOT = {
  Inicio: 'Home',
  Restaurantes: 'RestaurantsList',
  Reservas: 'MyReservations',
  Pedidos: 'MyOrders',
  Perfil: 'Profile',
};

const resetTabOnPress = ({ navigation, route }) => ({
  tabPress: (e) => {
    e.preventDefault();
    navigation.navigate(route.name, { screen: TAB_ROOT[route.name] });
  },
});

export function MainTabs() {
  const { colors } = useThemeStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 66,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontFamily: FONTS.semibold, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => (
          <MaterialIcons name={TAB_ICONS[route.name] || 'circle'} size={focused ? size + 1 : size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Restaurantes" component={RestaurantsStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Reservas" component={ReservationsStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Pedidos" component={OrdersStack} listeners={resetTabOnPress} />
      <Tab.Screen name="Perfil" component={ProfileStack} listeners={resetTabOnPress} />
    </Tab.Navigator>
  );
}

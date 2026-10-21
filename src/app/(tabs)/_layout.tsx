// ============================================================================
// (tabs)/_layout.tsx — Navegación principal (barra de pestañas inferior)
// ----------------------------------------------------------------------------
// Máximo 5 pestañas (regla de UX): Home, Services, Watchlist, Plan, Settings.
// Cada pestaña lleva icono + texto (nunca solo icono) y se resalta la activa.
// ============================================================================
import { Tabs } from 'expo-router';
import {
  Bookmark,
  CalendarRange,
  LayoutDashboard,
  ListVideo,
  Settings,
} from 'lucide-react-native';

import { colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <ListVideo color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <CalendarRange color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

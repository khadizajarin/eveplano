import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';  
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

   const [loaded, error] = useFonts({
    'BJCree-Regular': require('../../assets/fonts/BJCree-Regular.ttf'),
    'BJCree-Medium': require('../../assets/fonts/BJCree-Medium.ttf'),
    'BJCree-Bold': require('../../assets/fonts/BJCree-Bold.ttf'),
    'BJCree-SemiBold': require('../../assets/fonts/BJCree-SemiBold.ttf'),
  });

 useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="bag" color={color} />,
        }}
      />

       <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="star" color={color} />,
        }}
      />
    </Tabs>
  );
}

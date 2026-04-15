import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import useAuthentication from '../hooks/useAuthentication';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const { user } = useAuthentication(); 

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

  if (!loaded && !error) return null;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => (
            <Ionicons name="star" size={24} color={color} />
          ),
        }}
      />

      {/* ✅ Always declare screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: user ? undefined : null, // hide if not logged in
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
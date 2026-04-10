
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, ToastAndroid } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import useAuthentication from '../hooks/useAuthentication';
import { auth } from '../hooks/firebase.config';

export default function HomeScreen() {
  const { user } = useAuthentication();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      ToastAndroid.show('Logged out', ToastAndroid.SHORT);
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F1F2F6', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={{fontFamily: 'BJCree-Bold', fontSize: 30}}>
          EvePlano
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.description}>
          EvePlano is your one-stop platform for planning and managing social events with ease.
          From birthdays to weddings — everything stays organized in one place.
        </ThemedText>
      </ThemedView>

      {user && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.userText}>
            Logged in as: {user.email}
          </ThemedText>
        </ThemedView>
      )}

      <View style={styles.buttonContainer}>
        {user ? (
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogOut}>
            <ThemedText style={styles.buttonText}>Logout</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 180,
    width: 260,
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 16,
    paddingTop: 16,
  },
  description: {
    fontFamily: 'BJCree-Regular',
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.9,
  },
  userText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 14,
    opacity: 0.7,
  },
  buttonContainer: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#041e4b',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'BJCree-SemiBold',
    color: '#fffefd',
    // fontWeight: 'bold',
    fontSize: 16,
  },
});
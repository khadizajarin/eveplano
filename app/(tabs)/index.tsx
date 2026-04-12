import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, ToastAndroid, Text } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import useAuthentication from '../hooks/useAuthentication';
import { auth } from '../hooks/firebase.config';
import Upcoming from '../../components/Upcoming';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

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
      headerBackgroundColor={{ light: NAV, dark: NAV }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      {/* ── Brand Block ── */}
      <ThemedView style={styles.brandBlock}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.eyebrow}>EVENT PLANNING PLATFORM</Text>
        </View>
        <Text style={styles.brandTitle}>EvePlano</Text>
      </ThemedView>

      <View style={styles.divider} />

      {/* ── Description ── */}
      <ThemedView style={styles.descCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.accentLine} />
          <Text style={styles.cardLabel}>About</Text>
        </View>
        <Text style={styles.description}>
          EvePlano is your one-stop platform for planning and managing social events with ease.
          From birthdays to weddings — everything stays organized in one place.
        </Text>
      </ThemedView>

      {/* ── Logged-in user pill ── */}
      {user && (
        <View style={styles.userPill}>
          <View style={styles.userDot} />
          <Text style={styles.userText}>
            {user.email}
          </Text>
        </View>
      )}

      {/* ── CTA Button ── */}
      <View style={styles.buttonContainer}>
        {user ? (
          <TouchableOpacity style={styles.outlineButton} onPress={handleLogOut} activeOpacity={0.75}>
            <Text style={styles.outlineButtonText}>Log Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Upcoming Events ── */}
      <View style={styles.upcomingWrapper}>
        <Upcoming />
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
    opacity: 0.85,
  },

  /* ── Brand Block ── */
  brandBlock: {
    marginTop: 8,
    marginBottom: 4,
    // paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: NAV,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: CREAM,
  },
  eyebrow: {
    fontFamily: 'BJCree-Bold',
    fontSize: 9,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
  },
  brandTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 48,
    color: NAV,
    letterSpacing: -2,
    lineHeight: 52,
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    // marginHorizontal: 20,
    marginVertical: 20,
  },

  /* ── Description Card ── */
  descCard: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    // marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  accentLine: {
    width: 4,
    height: 20,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  cardLabel: {
    fontFamily: 'BJCree-Bold',
    fontSize: 12,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 1.5,
  },
  description: {
    fontFamily: 'BJCree-Regular',
    fontSize: 15,
    color: 'rgba(4,30,75,0.70)',
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  /* ── User Pill ── */
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(4,30,75,0.06)',
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
  },
  userDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3d9970',
  },
  userText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    color: 'rgba(4,30,75,0.60)',
    letterSpacing: 0.2,
  },

  /* ── Buttons ── */
  buttonContainer: {
    // paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: NAV,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryButtonText: {
    fontFamily: 'BJCree-Bold',
    color: CREAM,
    fontSize: 15,
    letterSpacing: 0.8,
  },
  buttonArrow: {
    color: CREAM,
    fontSize: 17,
    fontWeight: '700',
    opacity: 0.65,
  },
  outlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(4,30,75,0.25)',
  },
  outlineButtonText: {
    fontFamily: 'BJCree-Bold',
    color: NAV,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  /* ── Upcoming wrapper ── */
  upcomingWrapper: {
    marginTop: 4,
  },
});
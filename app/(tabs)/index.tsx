// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome To Eveplano!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         {/* <ThemedText type="subtitle">Step 1: Try it</ThemedText> */}
//         <ThemedText>
//           EvePlano is your one-stop platform for planning and managing social events with ease. Whether you are organizing a birthday party, wedding, corporate gathering, or any other social occasion, EvePlano simplifies the entire process.
//         </ThemedText>
//         {/* <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText> */}
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });





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
        <ThemedText type="title">Welcome to EvePlano</ThemedText>
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
            // onPress={() => router.push('/login')}
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
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  userText: {
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
    color: '#fffefd',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
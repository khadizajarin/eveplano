import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { db } from '../hooks/firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 👇 password show/hide state
  const [showPassword, setShowPassword] = useState(false);

  // 👇 email already registered check
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // ── Email exists check in Firestore ──
  useEffect(() => {
    if (!email || !email.includes('@')) {
      setEmailError(null);
      return;
    }

    const id = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setEmailError('This email is already registered');
        } else {
          setEmailError(null);
        }
      } catch (err) {
        console.error(err);
        setEmailError('Error checking email');
      } finally {
        setCheckingEmail(false);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [email]);

  // 🔥 এই অংশটা তোমার মতোই রাখা হয়েছে (শুধু error guard যোগ)
  const handleRegister = async () => {
    if (!email || !password) {
      alert('Please fill both email and password');
      return;
    }
    if (emailError) {
      alert('Please fix the email error first');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Save to Firestore (তোমার মতোই)
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          role: 'user',
          displayName: '',
          phonenumber: '',
          photoURL: '',
          City: '',
          Country: '',
          Devision: '',
          createdAt: new Date(),
        },
        { merge: true }
      );

      router.replace('/(tabs)');
    } catch (e: any) {
      console.log(e);

      let msg = 'Registration failed.';
      if (e.code === 'auth/email-already-in-use') {
        msg = 'Email is already registered.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Email format is invalid.';
      }
      alert(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Branding Block ── */}
        <View style={styles.brandBlock}>
          <View style={styles.logoBox}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.eyebrow}>GET STARTED</Text>
          <Text style={styles.brandTitle}>Create Your{'\n'}Account</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          {/* Header accent */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.accentLine} />
            <Text style={styles.cardTitle}>Register</Text>
          </View>

          {/* Email (with real‑time check) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.emailInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="rgba(4,30,75,0.30)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {checkingEmail && (
                <ActivityIndicator
                  size="small"
                  color="rgba(4,30,75,0.45)"
                  style={styles.spinner}
                />
              )}
            </View>
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Password (with show/hide) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Create a password"
                placeholderTextColor="rgba(4,30,75,0.30)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword} // 👈 show/hide
              />
              {/* Eye icon */}
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.75}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="rgba(4,30,75,0.45)"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, (emailError || checkingEmail) && { opacity: 0.6 }]}
            onPress={handleRegister}
            activeOpacity={0.82}
            disabled={!!emailError || checkingEmail}
          >
            {checkingEmail ? (
              <ActivityIndicator size="small" color={CREAM} />
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.75}
          >
            <Text style={styles.outlineButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 👇 তোমার মতোই styles থাকবে, শুধু নিচের কয়েকটা অতিরিক্ত স্টাইল যোগ করো:
// (তোমার আগের StyleSheet তে না থাকলে copy করো সেগুলো)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },

  /* ── Branding ── */
  brandBlock: {
    marginBottom: 32,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: NAV,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CREAM,
    opacity: 0.9,
  },
  eyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 10,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 6,
  },
  brandTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 32,
    color: NAV,
    letterSpacing: -0.8,
    lineHeight: 38,
  },

  /* ── Card ── */
  card: {
    backgroundColor: CREAM,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  accentLine: {
    width: 4,
    height: 28,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  cardTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 20,
    color: NAV,
    letterSpacing: -0.4,
  },

  /* ── Fields ── */
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'BJCree-Regular',
    fontSize: 11,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'BJCree-Regular',
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: NAV,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginLeft: 10,
  },

  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 6,
  },

  errorText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 6,
  },

  /* ── Primary Button ── */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    backgroundColor: NAV,
    paddingVertical: 15,
    borderRadius: 50,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'BJCree-Bold',
    color: CREAM,
    fontSize: 14,
    letterSpacing: 0.8,
  },
  buttonArrow: {
    color: CREAM,
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.65,
  },

  /* ── Divider ── */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
  },
  dividerText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 11,
    color: 'rgba(4,30,75,0.35)',
    letterSpacing: 1.5,
  },

  /* ── Outline Button ── */
  outlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(4,30,75,0.25)',
  },
  outlineButtonText: {
    fontFamily: 'BJCree-Bold',
    color: NAV,
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
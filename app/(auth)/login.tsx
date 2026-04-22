import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useAuth from '../hooks/useAuthentication';

const NAV = '#041e4b';
const CREAM = '#fffefd';

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: '', password: '' });

  const [authError, setAuthError] = useState('');

  const validate = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email is not valid.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    setAuthError(''); 

    if (!validate()) return;

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      console.log(e);

    
      let message = 'Login failed. Please try again.';

      const error = e as { code: string };

      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Try again later.';
      }

      setAuthError(message);
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
        <View style={styles.brandBlock}>
          <View style={styles.logoBox}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.eyebrow}>WELCOME BACK</Text>
          <Text style={styles.brandTitle}>Sign In to{'\n'}Your Account</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.accentLine} />
            <Text style={styles.cardTitle}>Login</Text>
          </View>

          {/* 🔴 GLOBAL ERROR (backend) */}
          {authError ? (
            <Text style={styles.authError}>{authError}</Text>
          ) : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="rgba(4,30,75,0.30)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? (
              <Text style={styles.errorMessage}>{errors.email}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="rgba(4,30,75,0.30)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
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
            {errors.password ? (
              <Text style={styles.errorMessage}>{errors.password}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.82}
          >
            <Text style={styles.buttonText}>Login</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.75}
          >
            <Text style={styles.outlineButtonText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


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

  errorMessage: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4,
    marginLeft: 4,
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
   authError: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: '#e74c3c',
    marginBottom: 12,
    textAlign: 'center',
  },
});
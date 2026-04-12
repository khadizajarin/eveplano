import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthentication from '../hooks/useAuthentication';
import { db } from '../hooks/firebase.config';
import Bookings from '../../components/Bookings';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

type UserType = {
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
};

// ---------- STORAGE ----------
const getUserDataFromStorage = async () => {
  const data = await AsyncStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

const saveUserDataToStorage = async (data: UserType) => {
  await AsyncStorage.setItem('userData', JSON.stringify(data));
};

// ---------- COMPONENT ----------
export default function Profile() {
  const { user, auth } = useAuthentication();

  const [userData, setUserData]             = useState<UserType | null>(null);
  const [isLoading, setIsLoading]           = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [displayName, setDisplayName]       = useState('');
  const [phoneNumber, setPhoneNumber]       = useState('');
  const [photoURL, setPhotoURL]             = useState('');

  // ---------- FETCH ----------
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return;

      const cached = await getUserDataFromStorage();
      if (cached) {
        setUserData(cached);
        setIsLoading(false);
        return;
      }

      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data = snap.docs[0].data() as UserType;
        setUserData(data);
        saveUserDataToStorage(data);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [user]);

  // ---------- LOGOUT ----------
  const handleLogOut = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    router.replace('/login');
    ToastAndroid.show('Logged out', ToastAndroid.SHORT);
  };

  // ---------- IMAGE ----------
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) setPhotoURL(res.assets[0].uri);
  };

  // ---------- UPDATE ----------
  const handleUpdateProfile = async () => {
    if (!user || !userData) return;

    const updated: UserType = {
      email: user.email!,
      displayName: displayName || userData.displayName,
      phoneNumber: phoneNumber || userData.phoneNumber,
      photoURL: photoURL || userData.photoURL,
    };

    const ref  = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    await updateDoc(ref, updated);
    await saveUserDataToStorage(updated);

    setUserData(updated);
    setShowUpdateForm(false);
    ToastAndroid.show('Profile updated', ToastAndroid.SHORT);
  };

  // ---------- LOADER ----------
  if (isLoading) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderText}>Loading profile…</Text>
      </View>
    );
  }

  // ---------- UI ----------
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View>
          <Text style={styles.eyebrow}>ACCOUNT</Text>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* ── Avatar Block ── */}
      <View style={styles.avatarBlock}>
        <View style={styles.avatarRing}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={68} color="rgba(4,30,75,0.28)" />
            </View>
          )}
        </View>
        <Text style={styles.avatarName}>{userData?.displayName || 'No Name Set'}</Text>
        <Text style={styles.avatarEmail}>{userData?.email || ''}</Text>
      </View>

      {/* ── Info Card ── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.accentLine} />
          <Text style={styles.cardLabel}>Profile Info</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NAME</Text>
          <Text style={styles.infoValue}>{userData?.displayName || '—'}</Text>
        </View>
        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>EMAIL</Text>
          <Text style={styles.infoValue}>{userData?.email || '—'}</Text>
        </View>
        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PHONE</Text>
          <Text style={styles.infoValue}>{userData?.phoneNumber || '—'}</Text>
        </View>
      </View>

      {/* ── Buttons ── */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setShowUpdateForm(true)}
        activeOpacity={0.82}
      >
        <Text style={styles.primaryButtonText}>Edit Profile</Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={handleLogOut}
        activeOpacity={0.75}
      >
        <Text style={styles.outlineButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* ── UPDATE MODAL ── */}
      <Modal visible={showUpdateForm} animationType="slide">
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerAccent} />
            <View>
              <Text style={styles.eyebrow}>ACCOUNT</Text>
              <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Fields Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.accentLine} />
              <Text style={styles.cardLabel}>Update Details</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Photo URL</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste image URL"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.photoURL}
                onChangeText={setPhotoURL}
              />
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={pickImage}
                  activeOpacity={0.75}
                >
                  <Text style={styles.outlineButtonText}>Pick from Gallery</Text>
                </TouchableOpacity>

            </View>
          </View>

          {/* Pick Image */}
        
          {/* Save */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleUpdateProfile}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryButtonText}>Save Changes</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => setShowUpdateForm(false)}
            activeOpacity={0.75}
          >
            <Text style={styles.ghostButtonText}>Cancel</Text>
          </TouchableOpacity>

        

        </ScrollView>
      </Modal>

        <View>
            <Bookings/>
          </View>
    </ScrollView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 48,
  },

  /* ── Loader ── */
  loaderScreen: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.50)',
    letterSpacing: 0.3,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  headerAccent: {
    width: 4,
    height: 52,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 30,
    color: NAV,
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 28,
  },

  /* ── Avatar ── */
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: NAV,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(4,30,75,0.05)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarName: {
    fontFamily: 'BJCree-Bold',
    fontSize: 20,
    color: NAV,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  avatarEmail: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.50)',
    letterSpacing: 0.2,
  },

  /* ── Info Card ── */
  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
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
    marginBottom: 16,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.07)',
  },
  infoLabel: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    color: 'rgba(4,30,75,0.40)',
    letterSpacing: 2,
  },
  infoValue: {
    fontFamily: 'BJCree-Regular',
    fontSize: 14,
    color: NAV,
    letterSpacing: 0.1,
    maxWidth: '65%',
    textAlign: 'right',
  },

  /* ── Buttons ── */
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: NAV,
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButtonText: {
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
  outlineButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(4,30,75,0.25)',
    marginBottom: 12,
    marginTop: 10,
  },
  outlineButtonText: {
    fontFamily: 'BJCree-Bold',
    color: NAV,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  ghostButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  ghostButtonText: {
    fontFamily: 'BJCree-Regular',
    color: 'rgba(4,30,75,0.40)',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  /* ── Modal Fields ── */
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: 'BJCree-Bold',
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
});
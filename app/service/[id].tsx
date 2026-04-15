import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { db } from '../hooks/firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import Video from '../../components/Video';
import useAuthentication from '../hooks/useAuthentication';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const ServiceDetails = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuthentication();

  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── Booking modal state ──
  const [showBooking, setShowBooking]           = useState(false);
  const [showSuccess, setShowSuccess]           = useState(false);
  const [submitting, setSubmitting]             = useState(false);
  const [numberOfGuests, setNumberOfGuests]     = useState('');
  const [location, setLocation]                 = useState('');
  const [phoneNumber, setPhoneNumber]           = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [eventDate, setEventDate]               = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker]     = useState(false);

  // ── Date picker handler ──
  const onChangeDatePicker = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: eventDate || new Date(),
      mode: 'date',
      display: 'default',
      onChange: onChangeDatePicker,
    });
  };

  // ── Fetch service ──
  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, 'services'), where('id', '==', id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0];
        setData({ id: docData.id, ...docData.data() });
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  // ── Submit booking ──
  const handleBooking = async () => {
    if (!numberOfGuests || !location || !phoneNumber || !eventDate) {
      ToastAndroid.show(
        'Please fill all required fields including date',
        ToastAndroid.SHORT
      );
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, 'bookings'), {
        serviceId:      data.id,
        serviceName:    data.name,
        user:           user?.email || 'guest',
        numberOfGuests,
        venue:          location,
        phoneNumber,
        specialRequirements,
        eventDate,                           // 👈 date to Firestore
        progress:       'pending',
        createdAt:      serverTimestamp(),
      });

      setShowBooking(false);
      setShowSuccess(true);

      // reset form
      setNumberOfGuests('');
      setLocation('');
      setPhoneNumber('');
      setSpecialRequirements('');
      setEventDate(null);

    } catch (err) {
      console.error(err);
      ToastAndroid.show('Booking failed. Try again.', ToastAndroid.SHORT);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loader ──
  if (loading)
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderText}>Loading service…</Text>
      </View>
    );

  if (!data)
    return (
      <View style={styles.loaderScreen}>
        <Text style={styles.emptyText}>No service found.</Text>
      </View>
    );

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Image ── */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: data.image }} style={styles.image} />
          <View style={styles.imageOverlay} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SERVICE</Text>
          </View>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerAccent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrow}>SERVICE DETAILS</Text>
              <Text style={styles.name}>{data.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.accentLine} />
              <Text style={styles.cardLabel}>About this Service</Text>
            </View>
            <Text style={styles.description}>{data.description}</Text>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <View style={styles.priceLeft}>
              <Text style={styles.priceEyebrow}>STARTING FROM</Text>
              <Text style={styles.priceValue}>{data.price}</Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>✦</Text>
            </View>
          </View>

          {/* ── Book Button ── */}
          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.82}
            onPress={() => {
              if (!user) {
                router.push('/login');
              } else {
                setShowBooking(true);
              }
            }}
          >
            <Text style={styles.bookButtonText}>Book this Service</Text>
            <Text style={styles.bookButtonArrow}>→</Text>
          </TouchableOpacity>

          {/* Video */}
          <View style={{ marginTop: 8 }}>
            <Video />
          </View>
        </View>
      </ScrollView>

      {/* ══════════════════════════════
          BOOKING MODAL
      ══════════════════════════════ */}
      <Modal visible={showBooking} animationType="slide">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerAccent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>NEW BOOKING</Text>
                <Text style={styles.name}>Book this Service</Text>
              </View>
            </View>
            <View style={styles.divider} />

            {/* Service Info (auto-loaded) */}
            <View style={styles.serviceInfoCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.accentLine} />
                <Text style={styles.cardLabel}>Service Details</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SERVICE</Text>
                <Text style={styles.infoValue}>{data.name}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>PRICE</Text>
                <Text style={styles.infoValue}>{data.price}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>BOOKED BY</Text>
                <Text style={styles.infoValue}>{user?.email || 'Guest'}</Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.accentLine} />
                <Text style={styles.cardLabel}>Your Details</Text>
              </View>

              {/* Guests */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Number of Guests <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 50"
                  placeholderTextColor="rgba(4,30,75,0.30)"
                  value={numberOfGuests}
                  onChangeText={setNumberOfGuests}
                  keyboardType="numeric"
                />
              </View>

              {/* Location */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Event Location <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Dhaka, Gulshan"
                  placeholderTextColor="rgba(4,30,75,0.30)"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              {/* Event Date */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Event Date <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.input}
                  activeOpacity={0.8}
                  onPress={showDatepicker}
                >
                  <Text
                    style={{
                      fontFamily: 'BJCree-Regular',
                      fontSize: 14,
                      color: NAV,
                      opacity: eventDate ? 1 : 0.5,
                    }}
                  >
                    {eventDate
                      ? eventDate.toLocaleDateString()
                      : 'Tap to select date'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Phone */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 01XXXXXXXXX"
                  placeholderTextColor="rgba(4,30,75,0.30)"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Special Requirements */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Special Requirements</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  placeholder="Any specific requests or notes…"
                  placeholderTextColor="rgba(4,30,75,0.30)"
                  value={specialRequirements}
                  onChangeText={setSpecialRequirements}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Progress indicator info */}
            <View style={styles.progressInfoCard}>
              <Text style={styles.progressInfoIcon}>📋</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressInfoTitle}>Booking Progress</Text>
                <Text style={styles.progressInfoText}>
                  Your booking will start as <Text style={styles.progressBadge}>Pending</Text> — our representative will contact you to confirm and discuss the details.
                </Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.bookButton, submitting && { opacity: 0.6 }]}
              activeOpacity={0.82}
              onPress={handleBooking}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={CREAM} />
              ) : (
                <>
                  <Text style={styles.bookButtonText}>Confirm Booking</Text>
                  <Text style={styles.bookButtonArrow}>→</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.ghostButton}
              onPress={() => setShowBooking(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.ghostButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══════════════════════════════
          SUCCESS POPUP
      ══════════════════════════════ */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconWrapper}>
              <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Booking Received!</Text>
            <Text style={styles.successMessage}>
              Our representative will contact you shortly to discuss the details and confirm your booking.
            </Text>

            <View style={styles.successDivider} />

            <TouchableOpacity
              style={styles.bookButton}
              activeOpacity={0.82}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.bookButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: CREAM },
  scrollContent: { paddingBottom: 48 },

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
  emptyText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 15,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 0.2,
  },

  /* ── Hero Image ── */
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,30,75,0.22)',
  },
  badge: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: 'rgba(4,30,75,0.60)',
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CREAM,
  },
  badgeText: {
    fontFamily: 'BJCree-Regular',
    color: CREAM,
    fontSize: 9,
    letterSpacing: 2.8,
  },

  /* ── Content ── */
  content: { paddingHorizontal: 20, paddingTop: 28 },

  /* ── Header ── */
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  headerAccent: { width: 4, height: 56, backgroundColor: NAV, borderRadius: 2 },
  eyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 10,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  name: {
    fontFamily: 'BJCree-Bold',
    fontSize: 28,
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: { height: 1, backgroundColor: 'rgba(4,30,75,0.10)', marginBottom: 24 },

  /* ── Cards ── */
  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  accentLine: { width: 4, height: 20, backgroundColor: NAV, borderRadius: 2 },
  cardLabel: {
    fontFamily: 'BJCree-Bold',
    fontSize: 12,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 1.5,
  },
  description: {
    fontFamily: 'BJCree-Regular',
    fontSize: 15,
    color: 'rgba(4,30,75,0.72)',
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  /* ── Price Card ── */
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NAV,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 20,
    marginBottom: 16,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  priceLeft: { gap: 4 },
  priceEyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 9,
    color:'rgba(255,254,253,0.65)', letterSpacing: 2.5,
  },
  priceValue: {
    fontFamily: 'BJCree-Bold', fontSize: 26, color: CREAM, letterSpacing: -0.4,
  },
  priceBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,254,253,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,254,253,0.20)',
  },
  priceBadgeText: { fontFamily: 'BJCree-Regular', color: CREAM, fontSize: 18 },

  /* ── Book Button ── */
  bookButton: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: NAV, paddingVertical: 15,
    borderRadius: 50, marginBottom: 12,
    shadowColor: NAV, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 14, elevation: 8,
  },
  bookButtonText: {
    fontFamily: 'BJCree-Bold', color: CREAM, fontSize: 14, letterSpacing: 0.8,
  },
  bookButtonArrow: { color: CREAM, fontSize: 16, fontWeight: '700', opacity: 0.65 },

  /* ── Modal ── */
  modalScroll: { flex: 1, backgroundColor: CREAM },
  modalContent: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 48 },

  /* ── Service Info Card (auto-filled) ── */
  serviceInfoCard: {
    backgroundColor: 'rgba(4,30,75,0.04)',
    borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.10)',
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  infoDivider: { height: 1, backgroundColor: 'rgba(4,30,75,0.07)' },
  infoLabel: {
    fontFamily: 'BJCree-Bold', fontSize: 10,
    color: 'rgba(4,30,75,0.40)', letterSpacing: 2,
  },
  infoValue: {
    fontFamily: 'BJCree-Regular', fontSize: 14,
    color: NAV, letterSpacing: 0.1,
    maxWidth: '60%', textAlign: 'right',
  },

  /* ── Form Fields ── */
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    fontFamily: 'BJCree-Bold', fontSize: 11,
    color: 'rgba(4,30,75,0.55)', letterSpacing: 1.5, marginBottom: 8,
  },
  required: { color: '#e74c3c' },
  input: {
    fontFamily: 'BJCree-Regular',
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.12)',
    borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 14, color: NAV,
  },
  inputMultiline: { minHeight: 90 },

  /* ── Progress Info Card ── */
  progressInfoCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.10)',
  },
  progressInfoIcon: { fontSize: 22, marginTop: 2 },
  progressInfoTitle: {
    fontFamily: 'BJCree-Bold', fontSize: 13,
    color: NAV, letterSpacing: 0.2, marginBottom: 4,
  },
  progressInfoText: {
    fontFamily: 'BJCree-Regular', fontSize: 13,
    color: 'rgba(4,30,75,0.60)', lineHeight: 20,
  },
  progressBadge: {
    fontFamily: 'BJCree-Bold', color: NAV,
  },

  /* ── Ghost Button ── */
  ghostButton: { alignItems: 'center', paddingVertical: 12 },
  ghostButtonText: {
    fontFamily: 'BJCree-Regular', color: 'rgba(4,30,75,0.40)',
    fontSize: 13, letterSpacing: 0.3,
  },

  /* ── Success Popup ── */
  successOverlay: {
    flex: 1, backgroundColor: 'rgba(4,30,75,0.55)',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 28,
  },
  successCard: {
    backgroundColor: CREAM, borderRadius: 24,
    padding: 28, width: '100%', alignItems: 'center',
    shadowColor: NAV, shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25, shadowRadius: 28, elevation: 16,
  },
  successIconWrapper: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: NAV, justifyContent: 'center',
    alignItems: 'center', marginBottom: 20,
    shadowColor: NAV, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30, shadowRadius: 12, elevation: 8,
  },
  successIcon: { color: CREAM, fontSize: 28, fontWeight: '700' },
  successTitle: {
    fontFamily: 'BJCree-Bold', fontSize: 22,
    color: NAV, letterSpacing: -0.4, marginBottom: 12,
  },
  successMessage: {
    fontFamily: 'BJCree-Regular', fontSize: 14,
    color: 'rgba(4,30,75,0.62)', lineHeight: 22,
    textAlign: 'center', letterSpacing: 0.1,
  },
  successDivider: {
    width: '100%', height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginVertical: 20,
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Redirect } from 'expo-router';
import useAuthentication from '../app/hooks/useAuthentication';
import app, { db } from '../app/hooks/firebase.config';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const AddReview = () => {
  const { user, loading } = useAuthentication(app);

  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ✅ PRIVATE ROUTE GUARD
  if (loading)
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="small" color={NAV} />
      </View>
    );
  if (!user) return <Redirect href="/login" />;

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      ToastAndroid.show('Write something first', ToastAndroid.SHORT);
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, 'reviews'), {
        reviewtext: reviewText,
        email: user.email,
        comments: [],
        likedEmail: [],
        createdAt: serverTimestamp(),
      });

      setReviewText('');
      ToastAndroid.show('Review posted!', ToastAndroid.SHORT);
    } catch (err) {
      console.error(err);
      ToastAndroid.show('Failed to post review', ToastAndroid.SHORT);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.accentLine} />
        <View>
          <Text style={styles.eyebrow}>YOUR EXPERIENCE</Text>
          <Text style={styles.title}>Share Your Feedback</Text>
        </View>
      </View>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Write your review…"
        placeholderTextColor="rgba(4,30,75,0.35)"
        value={reviewText}
        multiline
        onChangeText={setReviewText}
        textAlignVertical="top"
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleAddReview}
        activeOpacity={0.82}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={CREAM} />
        ) : (
          <>
            <Text style={styles.buttonText}>Post Review</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default AddReview;

const styles = StyleSheet.create({
  loaderScreen: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREAM,
  },

  /* ── Card ── */
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: CREAM,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 6,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  accentLine: {
    width: 4,
    height: 44,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: NAV,
    letterSpacing: -0.4,
    lineHeight: 22,
  },

  /* ── Input ── */
  input: {
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 100,
    fontSize: 14,
    color: NAV,
    lineHeight: 22,
  },

  /* ── Button ── */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: NAV,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: CREAM,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  buttonArrow: {
    color: CREAM,
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.65,
  },
});
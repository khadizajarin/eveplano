import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import useAuthentication from '../app/hooks/useAuthentication';
import app, { db } from '../app/hooks/firebase.config';
import { router } from 'expo-router';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

type RatingProps = {
  navigation: any; // <-- navigation prop for redirect
};

const Rating: React.FC<RatingProps> = ({ navigation }) => {
  const [rating, setRating] = useState<number>(0); // 0.5, 1.5, 2.5, ..., 5.0
  const [submitting, setSubmitting] = useState(false);
  const [userRatingDocId, setUserRatingDocId] = useState<string | null>(null);

  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  const { user } = useAuthentication(app);

  const handleSetRating = (value: number) => {
    setRating(value);
  };

  const fetchStats = async () => {
    try {
      const q = collection(db, 'rating');
      const snap = await getDocs(q);

      if (snap.empty) {
        setAvgRating(null);
        setTotalRatings(0);
        return;
      }

      let sum = 0;
      let count = 0;

      snap.forEach((doc) => {
        const data = doc.data() as any;
        if (typeof data.rating === 'number') {
          sum += data.rating;
          count += 1;
        }
      });

      setTotalRatings(count);
      setAvgRating(count ? sum / count : null);
    } catch (err) {
      console.error('fetch rating stats error:', err);
    }
  };

  const fetchUserRating = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'rating'),
        where('email', '==', user.email)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const userDoc = snap.docs[0];
        setUserRatingDocId(userDoc.id);
        setRating(userDoc.data().rating || 0);
      } else {
        setUserRatingDocId(null);
        setRating(0);
      }
    } catch (err) {
      console.error('fetch user rating error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    if (user) fetchUserRating();
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      navigation.navigate('Login'); // <-- login route name
      return;
    }

    if (!rating) {
      ToastAndroid.show('Please select a rating', ToastAndroid.SHORT);
      return;
    }

    try {
      setSubmitting(true);

      if (userRatingDocId) {
        const ref = doc(db, 'rating', userRatingDocId);
        await updateDoc(ref, {
          rating,
          createdAt: serverTimestamp(),
        });
      } else {
        const docRef = await addDoc(collection(db, 'rating'), {
          email: user.email,
          rating,
          createdAt: serverTimestamp(),
        });
        setUserRatingDocId(docRef.id);
      }

      ToastAndroid.show('Thanks for your rating!', ToastAndroid.SHORT);
      fetchStats();
    } catch (err) {
      console.error('rating submit error:', err);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginPress = () => {
    router.push('/login') // change to your actual login route
  };

  const renderStars = () => {
    const max = 5;
    const stars = [];

    for (let i = 1; i <= max; i++) {
      const diff = rating - i;

      let name: 'star' | 'star-half' | 'star-outline';
      if (diff >= 0) {
        name = 'star';
      } else if (diff > -0.5) {
        name = 'star-half';
      } else {
        name = 'star-outline';
      }

      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleSetRating(i)}
          activeOpacity={0.8}
          style={styles.starBtn}
        >
          <MaterialCommunityIcons
            name={name}
            size={40}
            color={name !== 'star-outline' ? NAV : 'rgba(4,30,75,0.35)'}
          />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.starsOuterRow}>
        <View style={styles.starsRow}>{stars}</View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <View>
            <Text style={styles.eyebrow}>RATE YOUR EXPERIENCE</Text>
            <Text style={styles.headerTitle}>Rating</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Stats (always visible) */}
        <View style={styles.statsBox}>
          <Text style={styles.statsText}>
            Total ratings: {totalRatings}
          </Text>
          <Text style={styles.statsText}>
            Average rating:{' '}
            {avgRating ? avgRating.toFixed(1) : 'N/A'}
          </Text>
        </View>

        {/* Rating Card */}
        <View style={styles.card}>
          <Text style={styles.quoteMark}>&quot;</Text>

          <Text style={styles.titleInside}>How was your experience?</Text>

          {/* Partial stars (0.0 to 5.0) */}
          {renderStars()}

          {/* Submit / Login button */}
          <TouchableOpacity
            style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
            activeOpacity={0.82}
            onPress={user ? handleSubmit : handleLoginPress}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {!user
                ? 'Login to rate'
                : userRatingDocId
                ? 'Update Rating'
                : 'Submit Rating'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Rating;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  container: {
    paddingTop: 56,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  headerAccent: {
    width: 4,
    height: 62,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 10,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'BJCree-Bold',
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  statsBox: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(4,30,75,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
  },
  statsText: {
    fontSize: 13,
    fontFamily: 'BJCree-Regular',
    color: NAV,
    marginBottom: 2,
  },

  loginHint: {
    marginBottom: 20,
  },

  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  quoteMark: {
    fontSize: 52,
    lineHeight: 44,
    color: 'rgba(4,30,75,0.08)',
    fontWeight: '900',
    marginBottom: 8,
  },
  titleInside: {
    fontFamily: 'BJCree-SemiBold',
    fontSize: 16,
    color: NAV,
    marginBottom: 16,
    letterSpacing: 0.1,
  },

  starsOuterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  starBtn: {
    paddingHorizontal: 6,
  },

  submitBtn: {
    backgroundColor: NAV,
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  submitText: {
    fontFamily: 'BJCree-Bold',
    color: CREAM,
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
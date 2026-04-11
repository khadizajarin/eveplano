import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../hooks/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Video from '../../components/Video';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const ServiceDetails = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(db, 'services'),
        where('id', '==', id)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const docData = snap.docs[0];
        setData({ id: docData.id, ...docData.data() });
      }

      setLoading(false);
    };

    fetch();
  }, [id]);

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
            <Text style={[styles.name, { fontFamily: 'BJCree-Bold' }]}>
              {data.name}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Description Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.accentLine} />
            <Text style={styles.cardLabel}>About this Service</Text>
          </View>
          <Text style={[styles.description, { fontFamily: 'BJCree-Regular' }]}>
            {data.description}
          </Text>
        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceLeft}>
            <Text style={styles.priceEyebrow}>STARTING FROM</Text>
            <Text style={[styles.priceValue, { fontFamily: 'BJCree-Regular' }]}>
              {data.price}
            </Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>✦</Text>
          </View>
        </View>

        <View>
          <Video />
        </View>

      </View>
    </ScrollView>
  );
};

export default ServiceDetails;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  /* ── Loader / Empty ── */
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
    // fontWeight: '500',
    letterSpacing: 0.3,
  },
  emptyText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 15,
    // fontWeight: '600',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 0.2,
  },

  /* ── Hero Image ── */
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
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
    // fontWeight: '700',
    letterSpacing: 2.8,
  },

  /* ── Content ── */
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
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
    height: 56,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 10,
    // fontWeight: '700',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  name: {
    fontFamily: 'BJCree-Bold',
    fontSize: 28,
    // fontWeight: '800',
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  /* ── Description Card ── */
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
    marginBottom: 12,
  },
  accentLine: {
    width: 4,
    height: 20,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  cardLabel: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    // fontWeight: '700',
    color: 'rgb(4, 30, 75)',
    letterSpacing: 1.5,
  },
  description: {
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
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 10,
  },
  priceLeft: {
    gap: 4,
  },
  priceEyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 9,
    // fontWeight: '700',
    color: 'rgba(255, 254, 253, 0.65)',
    letterSpacing: 2.5,
  },
  priceValue: {
    fontFamily: 'BJCree-Bold',
    fontSize: 26,
    // fontWeight: '800',
    color: CREAM,
    letterSpacing: -0.4,
  },
  priceBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,254,253,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,254,253,0.20)',
  },
  priceBadgeText: {
    fontFamily: 'BJCree-Regular',
    color: CREAM,
    fontSize: 18,
  },
});
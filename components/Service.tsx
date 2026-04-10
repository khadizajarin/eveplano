import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';

type Props = {
  service: {
    id: string;
    name: string;
    image: string;
    description: string;
  };
};

const Service: React.FC<Props> = ({ service }) => {
  return (
    <View style={styles.card}>
      {/* Image Block */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: service.image }} style={styles.image} />
        <View style={styles.imageOverlay} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SERVICE</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.accentLine} />
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.desc}>{service.description}</Text>

        <View style={styles.footer}>
          <View style={styles.dotRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.82}
            onPress={() => router.push(`/service/${service.id}` as any)}
          >
            <Text style={styles.buttonText}>Explore</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Service;

const NAV   = '#041e4b';        // deep navy
const CREAM = '#fffefd';        // off-white
const NAV60 = 'rgba(4,30,75,0.60)';
const NAV12 = 'rgba(4,30,75,0.08)';

const styles = StyleSheet.create({
  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 2,
    overflow: 'hidden',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
    borderWidth: 1,
    borderColor: NAV12,
  },

  /* ── Image ── */
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 30, 75, 0.22)',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: NAV60,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CREAM,
  },
  badgeText: {
    color: CREAM,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.8,
  },

  /* ── Content ── */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    backgroundColor: CREAM,
  },
  accentLine: {
    width: 36,
    height: 3,
    backgroundColor: NAV,
    borderRadius: 2,
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: NAV,
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 28,
  },
  desc: {
    fontSize: 14,
    color: 'rgba(4,30,75,0.58)',
    lineHeight: 22,
    letterSpacing: 0.1,
    marginBottom: 22,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(4,30,75,0.18)',
  },
  dotActive: {
    backgroundColor: NAV,
    width: 20,
    borderRadius: 3,
  },

  /* ── Button ── */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: NAV,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 50,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonText: {
    color: CREAM,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  buttonArrow: {
    color: CREAM,
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.7,
  },
});
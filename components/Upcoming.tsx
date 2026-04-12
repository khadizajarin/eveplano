import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

type EventType = {
  title: string;
  date: string;
  time: string;
  description: string;
};

const events: EventType[] = [
  {
    title: 'Autumn Music Festival',
    date: 'March 15, 2024',
    time: '2:00 PM - 5:00 PM',
    description: 'Join us for a day of music, fun, and good vibes!',
  },
  {
    title: 'Art Exhibition Opening',
    date: 'February 10, 2024',
    time: '4:00 PM - 7:00 PM',
    description: 'Discover the world of contemporary art.',
  },
  {
    title: 'Culinary Workshop',
    date: 'March 20, 2024',
    time: '10:00 AM - 2:00 PM',
    description: 'Learn cooking from expert chefs.',
  },
];

const Upcoming: React.FC = () => {
  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View>
          <Text style={styles.eyebrow}>WHAT'S NEXT</Text>
          <Text style={styles.heading}>Upcoming{'\n'}Social Events</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Event Cards ── */}
      {events.map((event, index) => (
        <View key={index} style={styles.eventCard}>

          {/* Index number */}
          <Text style={styles.eventIndex}>
            {String(index + 1).padStart(2, '0')}
          </Text>

          {/* Title */}
          <View style={styles.titleRow}>
            <View style={styles.accentLine} />
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>

          {/* Meta pills */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>📅  {event.date}</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>🕐  {event.time}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.eventDescription}>{event.description}</Text>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerLine} />
            <Text style={styles.learnMore}>Learn more →</Text>
          </View>

        </View>
      ))}
    </View>
  );
};

export default Upcoming;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    backgroundColor: CREAM,
    // paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
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
    height: 58,
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
  heading: {
    fontFamily: 'BJCree-Bold',
    fontSize: 28,
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  /* ── Event Card ── */
  eventCard: {
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
  eventIndex: {
    fontFamily: 'BJCree-Bold',
    fontSize: 36,
    color: 'rgba(4,30,75,0.07)',
    lineHeight: 36,
    marginBottom: 8,
    letterSpacing: -1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  accentLine: {
    width: 4,
    height: 22,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eventTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 17,
    color: NAV,
    letterSpacing: -0.3,
    flex: 1,
    lineHeight: 22,
  },

  /* ── Meta Pills ── */
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metaPill: {
    backgroundColor: 'rgba(4,30,75,0.06)',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
  },
  metaText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    color: 'rgba(4,30,75,0.65)',
    letterSpacing: 0.2,
  },

  /* ── Description ── */
  eventDescription: {
    fontFamily: 'BJCree-Regular',
    fontSize: 14,
    color: 'rgba(4,30,75,0.62)',
    lineHeight: 22,
    letterSpacing: 0.1,
    marginBottom: 16,
  },

  /* ── Card Footer ── */
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.08)',
  },
  learnMore: {
    fontFamily: 'BJCree-Bold',
    fontSize: 12,
    color: NAV,
    letterSpacing: 0.5,
    opacity: 0.60,
  },
});
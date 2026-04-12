import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import useAuthentication from '../app/hooks/useAuthentication';
import { db } from '../app/hooks/firebase.config';


const NAV   = '#041e4b';
const CREAM = '#fffefd';

type BookingType = {
  id: string;
  serviceId: string;
  serviceName: string;
  user: string;
  numberOfGuests: string;
  venue: string;
  phoneNumber: string;
  specialRequirements?: string;
  progress: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: any;
};

const PROGRESS_CONFIG: Record<
  BookingType['progress'],
  { label: string; color: string; bg: string }
> = {
  pending:   { label: 'Pending',   color: '#b8860b', bg: 'rgba(184,134,11,0.12)'  },
  confirmed: { label: 'Confirmed', color: '#1a6e3c', bg: 'rgba(26,110,60,0.12)'   },
  completed: { label: 'Completed', color: '#041e4b', bg: 'rgba(4,30,75,0.10)'     },
  cancelled: { label: 'Cancelled', color: '#c0392b', bg: 'rgba(192,57,43,0.10)'   },
};

// ── Single booking card ──
const BookingCard: React.FC<{ booking: BookingType; isAdmin: boolean }> = ({
  booking,
  isAdmin,
}) => {
  const [expanded, setExpanded] = useState(false);
  const prog = PROGRESS_CONFIG[booking.progress] ?? PROGRESS_CONFIG.pending;

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try {
      return ts.toDate().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <View style={styles.bookingCard}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(p => !p)}>

        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <View style={styles.accentLine} />
              <Text style={styles.serviceName}>{booking.serviceName}</Text>
            </View>
            {isAdmin && (
              <Text style={styles.userEmail}>{booking.user}</Text>
            )}
          </View>

          <View style={{ alignItems: 'flex-end', gap: 8 }}>
            <View style={[styles.progressBadge, { backgroundColor: prog.bg }]}>
              <Text style={[styles.progressText, { color: prog.color }]}>
                {prog.label}
              </Text>
            </View>
            <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>📅  {formatDate(booking.createdAt)}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>👥  {booking.numberOfGuests} guests</Text>
          </View>
        </View>

      </TouchableOpacity>

      {expanded && (
        <View style={styles.detailsBlock}>
          <View style={styles.detailsDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>VENUE</Text>
            <Text style={styles.infoValue}>{booking.venue}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{booking.phoneNumber}</Text>
          </View>

          {booking.specialRequirements ? (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NOTES</Text>
                <Text style={[styles.infoValue, { maxWidth: '60%' }]}>
                  {booking.specialRequirements}
                </Text>
              </View>
            </>
          ) : null}

          {isAdmin && (
            <>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SERVICE ID</Text>
                <Text style={styles.infoValue}>{booking.serviceId}</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

// ════════════════════════════════
const Bookings: React.FC = () => {
  const { user } = useAuthentication();

  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!user?.email) return;

      try {
        // ── Step 1: check role from Firestore users collection ──
        const userSnap = await getDocs(
          query(
            collection(db, 'users'),
            where('email', '==', user.email)
          )
        );

        let admin = false;
        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          admin = userData.role === 'admin';
        }
        setIsAdmin(admin);

        // ── Step 2: fetch bookings based on role ──
        const bookingsQuery = admin
          ? query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
          : query(
              collection(db, 'bookings'),
              where('user', '==', user.email),
              orderBy('createdAt', 'desc')
            );

        const bookingsSnap = await getDocs(bookingsQuery);
        const data: BookingType[] = bookingsSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<BookingType, 'id'>),
        }));

        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [user]);

  if (loading)
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderText}>Loading bookings…</Text>
      </View>
    );

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
          <Text style={styles.eyebrow}>
            {isAdmin ? 'ALL BOOKINGS' : 'MY BOOKINGS'}
          </Text>
          <Text style={styles.headerTitle}>
            {isAdmin ? 'Manage Bookings' : 'Your Bookings'}
          </Text>
        </View>
      </View>

      {/* Admin pill */}
      {isAdmin && (
        <View style={styles.adminBadge}>
          <View style={styles.adminDot} />
          <Text style={styles.adminBadgeText}>Admin View — All bookings visible</Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* ── Stats row (admin only) ── */}
      {isAdmin && bookings.length > 0 && (
        <View style={styles.statsRow}>
          {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => {
            const count = bookings.filter(b => b.progress === status).length;
            const cfg   = PROGRESS_CONFIG[status];
            return (
              <View key={status} style={[styles.statCard, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statCount, { color: cfg.color }]}>{count}</Text>
                <Text style={[styles.statLabel, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* ── Cards ── */}
      {bookings.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            {isAdmin
              ? 'No bookings have been made yet.'
              : 'You have not made any bookings yet.'}
          </Text>
        </View>
      ) : (
        bookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} isAdmin={isAdmin} />
        ))
      )}

    </ScrollView>
  );
};

export default Bookings;


const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: CREAM },
  scrollContent: { paddingTop: 56, paddingBottom: 48 },

  loaderScreen: {
    flex: 1, backgroundColor: CREAM,
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  loaderText: {
    fontFamily: 'BJCree-Regular', fontSize: 13,
    color: 'rgba(4,30,75,0.50)', letterSpacing: 0.3,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  headerAccent: { width: 4, height: 52, backgroundColor: NAV, borderRadius: 2 },
  eyebrow: {
    fontFamily: 'BJCree-Bold', fontSize: 10,
    color: 'rgba(4,30,75,0.45)', letterSpacing: 3, marginBottom: 5,
  },
  headerTitle: {
    fontFamily: 'BJCree-Bold', fontSize: 30,
    color: NAV, letterSpacing: -0.7, lineHeight: 36,
  },

  adminBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'flex-start', marginBottom: 12,
    backgroundColor: 'rgba(4,30,75,0.06)',
    borderRadius: 50, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.12)',
  },
  adminDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#3d9970' },
  adminBadgeText: {
    fontFamily: 'BJCree-Regular', fontSize: 12,
    color: 'rgba(4,30,75,0.60)', letterSpacing: 0.2,
  },

  divider: { height: 1, backgroundColor: 'rgba(4,30,75,0.10)', marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  statCard: {
    flex: 1, minWidth: 72, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 10,
    alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.08)',
  },
  statCount: { fontFamily: 'BJCree-Bold', fontSize: 22, letterSpacing: -0.5 },
  statLabel: { fontFamily: 'BJCree-Regular', fontSize: 10, letterSpacing: 0.5 },

  bookingCard: {
    backgroundColor: CREAM, borderRadius: 20, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10, shadowRadius: 18, elevation: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  accentLine: { width: 4, height: 20, backgroundColor: NAV, borderRadius: 2 },
  serviceName: {
    fontFamily: 'BJCree-Bold', fontSize: 16,
    color: NAV, letterSpacing: -0.2, flex: 1,
  },
  userEmail: {
    fontFamily: 'BJCree-Regular', fontSize: 12,
    color: 'rgba(4,30,75,0.50)', marginTop: 2, marginLeft: 14,
  },
  expandIcon: { fontSize: 10, color: 'rgba(4,30,75,0.35)', fontWeight: '700' },

  progressBadge: { borderRadius: 50, paddingHorizontal: 12, paddingVertical: 5 },
  progressText: { fontFamily: 'BJCree-Bold', fontSize: 11, letterSpacing: 0.5 },

  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  metaPill: {
    backgroundColor: 'rgba(4,30,75,0.06)', borderRadius: 50,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.10)',
  },
  metaText: {
    fontFamily: 'BJCree-Regular', fontSize: 12,
    color: 'rgba(4,30,75,0.65)', letterSpacing: 0.2,
  },

  detailsBlock: { marginTop: 4 },
  detailsDivider: { height: 1, backgroundColor: 'rgba(4,30,75,0.08)', marginVertical: 14 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 8,
  },
  infoDivider: { height: 1, backgroundColor: 'rgba(4,30,75,0.06)' },
  infoLabel: {
    fontFamily: 'BJCree-Bold', fontSize: 10,
    color: 'rgba(4,30,75,0.40)', letterSpacing: 2,
  },
  infoValue: {
    fontFamily: 'BJCree-Regular', fontSize: 14,
    color: NAV, letterSpacing: 0.1, textAlign: 'right',
  },

  emptyBlock: { alignItems: 'center', paddingTop: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: {
    fontFamily: 'BJCree-Bold', fontSize: 18,
    color: NAV, letterSpacing: -0.3,
  },
  emptyText: {
    fontFamily: 'BJCree-Regular', fontSize: 14,
    color: 'rgba(4,30,75,0.50)', textAlign: 'center', lineHeight: 22,
  },
});
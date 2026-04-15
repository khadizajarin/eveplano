import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import useAuthentication from '../app/hooks/useAuthentication';
import { db } from '../app/hooks/firebase.config';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

type ProgressType = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type FilterType   = 'all' | ProgressType;

type BookingType = {
  id: string;
  serviceId: string;
  serviceName: string;
  user: string;
  numberOfGuests: string;
  venue: string;
  phoneNumber: string;
  specialRequirements?: string;
  progress: ProgressType;
  createdAt?: any;
};

const PROGRESS_CONFIG: Record<
  ProgressType,
  { label: string; color: string; bg: string; icon: string }
> = {
  pending:   { label: 'Pending',   color: '#b8860b', bg: 'rgba(184,134,11,0.12)', icon: '🕐' },
  confirmed: { label: 'Confirmed', color: '#1a6e3c', bg: 'rgba(26,110,60,0.12)',  icon: '✅' },
  completed: { label: 'Completed', color: '#041e4b', bg: 'rgba(4,30,75,0.10)',    icon: '🎉' },
  cancelled: { label: 'Cancelled', color: '#c0392b', bg: 'rgba(192,57,43,0.10)',  icon: '❌' },
};

const ALL_STATUSES: ProgressType[] = ['pending', 'confirmed', 'completed', 'cancelled'];

// ════════════════════════════════
// Booking Card
// ════════════════════════════════
const BookingCard: React.FC<{
  booking: BookingType;
  isAdmin: boolean;
  onProgressUpdate: (id: string, progress: ProgressType) => void;
}> = ({ booking, isAdmin, onProgressUpdate }) => {
  const [expanded, setExpanded]               = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [updating, setUpdating]               = useState(false);

  const prog = PROGRESS_CONFIG[booking.progress] ?? PROGRESS_CONFIG.pending;

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try {
      return ts.toDate().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch { return '—'; }
  };

  const handleStatusChange = async (newStatus: ProgressType) => {
    if (newStatus === booking.progress) { setShowStatusPicker(false); return; }
    try {
      setUpdating(true);
      await updateDoc(doc(db, 'bookings', booking.id), { progress: newStatus });
      onProgressUpdate(booking.id, newStatus);
      ToastAndroid.show(`Status updated to ${PROGRESS_CONFIG[newStatus].label}`, ToastAndroid.SHORT);
    } catch (err) {
      console.error(err);
      ToastAndroid.show('Update failed', ToastAndroid.SHORT);
    } finally {
      setUpdating(false);
      setShowStatusPicker(false);
    }
  };

  return (
    <>
      <View style={styles.bookingCard}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(p => !p)}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <View style={styles.accentLine} />
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
              </View>
              {isAdmin && <Text style={styles.userEmail}>{booking.user}</Text>}
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <View style={[styles.progressBadge, { backgroundColor: prog.bg }]}>
                <Text style={[styles.progressText, { color: prog.color }]}>
                  {prog.icon}  {prog.label}
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

            {isAdmin && (
              <TouchableOpacity
                style={styles.updateStatusBtn}
                activeOpacity={0.82}
                onPress={() => setShowStatusPicker(true)}
                disabled={updating}
              >
                {updating
                  ? <ActivityIndicator size="small" color={CREAM} />
                  : <>
                      <Text style={styles.updateStatusText}>Update Status</Text>
                      <Text style={styles.updateStatusArrow}>↕</Text>
                    </>
                }
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* ── Status Picker Modal ── */}
      <Modal visible={showStatusPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.pickerOverlay}
          activeOpacity={1}
          onPress={() => setShowStatusPicker(false)}
        >
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <View style={styles.accentLine} />
              <View>
                <Text style={styles.pickerEyebrow}>BOOKING STATUS</Text>
                <Text style={styles.pickerTitle}>Update Progress</Text>
              </View>
            </View>
            <View style={styles.pickerDivider} />

            {ALL_STATUSES.map(status => {
              const cfg       = PROGRESS_CONFIG[status];
              const isCurrent = status === booking.progress;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusOption, isCurrent && styles.statusOptionActive]}
                  activeOpacity={0.75}
                  onPress={() => handleStatusChange(status)}
                >
                  <View style={[styles.statusOptionBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.statusOptionText, { color: cfg.color }]}>
                      {cfg.icon}  {cfg.label}
                    </Text>
                  </View>
                  {isCurrent && <Text style={styles.currentTick}>✓ Current</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.pickerCancel} onPress={() => setShowStatusPicker(false)}>
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const Bookings: React.FC = () => {
  const { user } = useAuthentication();

  const [bookings, setBookings]     = useState<BookingType[]>([]);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const init = async () => {
      if (!user?.email) return;
      try {
        const userSnap = await getDocs(
          query(collection(db, 'users'), where('email', '==', user.email))
        );
        let admin = false;
        if (!userSnap.empty) admin = userSnap.docs[0].data().role === 'admin';
        setIsAdmin(admin);

        const q = admin
          ? query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
          : query(
              collection(db, 'bookings'),
              where('user', '==', user.email),
              orderBy('createdAt', 'desc')
            );

        const snap = await getDocs(q);
        setBookings(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<BookingType, 'id'>) })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  const handleProgressUpdate = (id: string, progress: ProgressType) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, progress } : b));
  };

  // ── Filtered list ──
  const filtered = activeFilter === 'all'
    ? bookings
    : bookings.filter(b => b.progress === activeFilter);

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
          <Text style={styles.eyebrow}>{isAdmin ? 'ALL BOOKINGS' : 'MY BOOKINGS'}</Text>
          <Text style={styles.headerTitle}>{isAdmin ? 'Manage Bookings' : 'Your Bookings'}</Text>
        </View>
      </View>

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
          {ALL_STATUSES.map(status => {
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

      {/* ── Filter Tabs ── */}
      {bookings.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {/* All tab */}
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'all' && styles.filterTabActive,
            ]}
            activeOpacity={0.75}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[
              styles.filterTabText,
              activeFilter === 'all' && styles.filterTabTextActive,
            ]}>
              All  {bookings.length}
            </Text>
          </TouchableOpacity>

          {/* Status tabs — only show if count > 0 */}
          {ALL_STATUSES.map(status => {
            const count = bookings.filter(b => b.progress === status).length;
            if (count === 0) return null;
            const cfg     = PROGRESS_CONFIG[status];
            const isActive = activeFilter === status;
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterTab,
                  isActive && { backgroundColor: cfg.bg, borderColor: cfg.color },
                ]}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(status)}
              >
                <Text style={[
                  styles.filterTabText,
                  isActive && { color: cfg.color },
                ]}>
                  {cfg.icon} {cfg.label}  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ── Cards ── */}
      {filtered.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyIcon}>
            {activeFilter === 'all' ? '📭' : PROGRESS_CONFIG[activeFilter as ProgressType]?.icon ?? '📭'}
          </Text>
          <Text style={styles.emptyTitle}>No bookings here</Text>
          <Text style={styles.emptyText}>
            {activeFilter === 'all'
              ? (isAdmin ? 'No bookings have been made yet.' : 'You have not made any bookings yet.')
              : `No ${PROGRESS_CONFIG[activeFilter as ProgressType]?.label.toLowerCase()} bookings found.`
            }
          </Text>
        </View>
      ) : (
        filtered.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isAdmin={isAdmin}
            onProgressUpdate={handleProgressUpdate}
          />
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
    backgroundColor: 'rgba(4,30,75,0.06)', borderRadius: 50,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.12)',
  },
  adminDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#3d9970' },
  adminBadgeText: {
    fontFamily: 'BJCree-Regular', fontSize: 12,
    color: 'rgba(4,30,75,0.60)', letterSpacing: 0.2,
  },

  divider: { height: 1, backgroundColor: 'rgba(4,30,75,0.10)', marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  statCard: {
    flex: 1, minWidth: 72, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 10,
    alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: 'rgba(4,30,75,0.08)',
  },
  statCount: { fontFamily: 'BJCree-Bold', fontSize: 22, letterSpacing: -0.5 },
  statLabel: { fontFamily: 'BJCree-Regular', fontSize: 10, letterSpacing: 0.5 },

  /* ── Filter Tabs ── */
  filterRow: {
    flexDirection: 'row', gap: 8,
    paddingBottom: 18, paddingRight: 4,
  },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 50, borderWidth: 1.5,
    borderColor: 'rgba(4,30,75,0.15)',
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: NAV,
    borderColor: NAV,
  },
  filterTabText: {
    fontFamily: 'BJCree-Bold', fontSize: 12,
    color: 'rgba(4,30,75,0.55)', letterSpacing: 0.3,
  },
  filterTabTextActive: {
    color: CREAM,
  },

  /* ── Booking Card ── */
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

  updateStatusBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: NAV, paddingVertical: 12,
    borderRadius: 50, marginTop: 16,
    shadowColor: NAV, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  updateStatusText: {
    fontFamily: 'BJCree-Bold', color: CREAM, fontSize: 13, letterSpacing: 0.8,
  },
  updateStatusArrow: { color: CREAM, fontSize: 15, opacity: 0.65 },

  pickerOverlay: {
    flex: 1, backgroundColor: 'rgba(4,30,75,0.55)', justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: CREAM, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 36,
    shadowColor: NAV, shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 12,
  },
  pickerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  pickerEyebrow: {
    fontFamily: 'BJCree-Bold', fontSize: 9,
    color: 'rgba(4,30,75,0.45)', letterSpacing: 3, marginBottom: 4,
  },
  pickerTitle: { fontFamily: 'BJCree-Bold', fontSize: 20, color: NAV, letterSpacing: -0.4 },
  pickerDivider: { height: 1, backgroundColor: 'rgba(4,30,75,0.10)', marginBottom: 16 },

  statusOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 4, borderRadius: 14, marginBottom: 8,
  },
  statusOptionActive: { backgroundColor: 'rgba(4,30,75,0.04)', paddingHorizontal: 12 },
  statusOptionBadge: { borderRadius: 50, paddingHorizontal: 16, paddingVertical: 10 },
  statusOptionText: { fontFamily: 'BJCree-Bold', fontSize: 13, letterSpacing: 0.3 },
  currentTick: {
    fontFamily: 'BJCree-Regular', fontSize: 11,
    color: 'rgba(4,30,75,0.40)', letterSpacing: 0.5,
  },
  pickerCancel: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  pickerCancelText: {
    fontFamily: 'BJCree-Regular', fontSize: 13,
    color: 'rgba(4,30,75,0.40)', letterSpacing: 0.3,
  },

  emptyBlock: { alignItems: 'center', paddingTop: 48, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontFamily: 'BJCree-Bold', fontSize: 18, color: NAV, letterSpacing: -0.3 },
  emptyText: {
    fontFamily: 'BJCree-Regular', fontSize: 14,
    color: 'rgba(4,30,75,0.50)', textAlign: 'center', lineHeight: 22,
  },
});
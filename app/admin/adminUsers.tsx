

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../hooks/firebase.config';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import useAuthentication from '../hooks/useAuthentication';

const NAV = '#041e4b';
const CREAM = '#fffefd';

type UserType = {
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: string;
  country?: any;
  division?: any;
  city?: any;
};

type User = {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  blocked?: boolean;
};

const exportUsersCsv = async (users: User[]) => {
  try {
    // header লাইন
    const header = 'email,displayName,role,blocked\n';

    // প্রতিটি user এর row
    const rows = users
      .map((u) => {
        const cols = [
          u.email,
          u.displayName || '',
          u.role || '',
          u.blocked ? 'true' : 'false',
        ];
        return (
          cols
            .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
            .join(',')
        );
      })
      .join('\n');

    const csvContent = header + rows;

    const fileUri = FileSystem.cacheDirectory + 'users-report.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('CSV Export', `CSV saved at: ${fileUri}`);
      return;
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Share users CSV',
    });
  } catch (err) {
    console.log(err);
    Alert.alert('CSV Export', 'Failed to export CSV.');
  }
};

export default function AdminUsers() {
  const { user, auth } = useAuthentication();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list: User[] = [];
        snap.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            email: data.email || '',
            displayName: data.displayName,
            role: data.role,
            blocked: !!data.blocked,
          });
        });
        setUsers(list);
      } catch (err) {
        console.error('fetchAllUsers error:', err);
        Alert.alert('Error', 'Failed to load users.');
      }
      setLoading(false);
    };

    fetchAllUsers();
  }, []);

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    try {
      await updateDoc(doc(db, 'users', id), { role: newRole });
      setUsers((u) =>
        u.map((user) => (user.id === id ? { ...user, role: newRole } : user)),
      );
      Alert.alert('Success', `Role changed to ${newRole}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update role.');
    }
  };

  const handleToggleBlocked = async (id: string, current: boolean) => {
    const newBlocked = !current;

    try {
      await updateDoc(doc(db, 'users', id), { blocked: newBlocked });
      setUsers((u) =>
        u.map((user) => (user.id === id ? { ...user, blocked: newBlocked } : user)),
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to toggle block status.');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete user',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'users', id), { role: 'deleted' });
              setUsers((u) => u.filter((user) => user.id !== id));
              Alert.alert('Success', 'User marked as deleted');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete user.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderText}>Loading users…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View>
          <Text style={styles.eyebrow}>ADMIN</Text>
          <Text style={styles.headerTitle}>Manage Users</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* CSV Export */}
      {user && user.email && (
        <View style={styles.adminCSVSection}>
          <Text style={styles.adminCSVLabel}>Admin: CSV Export</Text>
          <Text style={styles.adminCSVText}>
            Download or share the user data CSV file for reporting.
          </Text>
          <TouchableOpacity
            style={styles.adminCSVButton}
            onPress={() => exportUsersCsv(users)}
            activeOpacity={0.8}
          >
            <Text style={styles.adminCSVButtonText}>Download Users CSV</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <View style={styles.userMain}>
              <Text style={styles.userName}>
                {item.displayName || item.email}
              </Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text
                style={[
                  styles.userBadge,
                  item.role === 'admin'
                    ? styles.adminBadge
                    : item.role === 'deleted'
                    ? styles.deletedBadge
                    : styles.userBadge,
                ]}
              >
                {item.role?.toUpperCase()}
              </Text>
              {item.blocked && (
                <Text style={styles.blockedBadge}>BLOCKED</Text>
              )}
            </View>

            <View style={styles.userActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  item.role === 'admin' ? styles.deactivateButton : styles.primaryButton,
                ]}
                onPress={() => handleRoleToggle(item.id, item.role || 'user')}
              >
                <Text style={styles.actionButtonText}>
                  {item.role === 'admin' ? 'Demote' : 'Make Admin'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.blockButton]}
                onPress={() => handleToggleBlocked(item.id, !!item.blocked)}
              >
                <Text style={styles.actionButtonText}>
                  {item.blocked ? 'Unblock' : 'Block'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.82}
      >
        <Text style={styles.backButtonText}>Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: CREAM,
  },
  loaderText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.50)',
    letterSpacing: 0.3,
  },

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

  listContainer: {
    gap: 12,
  },
  userRow: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
  },
  userMain: {
    marginBottom: 8,
  },
  userName: {
    fontFamily: 'BJCree-Bold',
    fontSize: 14,
    color: NAV,
  },
  userEmail: {
    fontFamily: 'BJCree-Regular',
    fontSize: 12,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 0.2,
  },
  userBadge: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    marginRight: 6,
  },
  adminBadge: {
    color: '#ff6b35',
  },
  deletedBadge: {
    color: '#e74c3c',
  },
  blockedBadge: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    color: '#e74c3c',
    letterSpacing: 1.5,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.05)',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  primaryButton: {
    borderColor: 'rgba(4,30,75,0.25)',
    backgroundColor: 'rgba(4,30,75,0.05)',
  },
  deactivateButton: {
    borderColor: 'rgba(255, 87, 51, 0.3)',
    backgroundColor: 'rgba(255, 87, 51, 0.08)',
  },
  blockButton: {
    borderColor: 'rgba(231, 76, 60, 0.3)',
    backgroundColor: 'rgba(231, 76, 60, 0.08)',
  },
  deleteButton: {
    borderColor: 'rgba(192, 57, 43, 0.4)',
    backgroundColor: 'rgba(192, 57, 43, 0.08)',
  },
  actionButtonText: {
    fontFamily: 'BJCree-Bold',
    fontSize: 11,
    letterSpacing: 0.8,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(4,30,75,0.10)',
    borderRadius: 50,
    marginVertical: 18,
  },
  backButtonText: {
    fontFamily: 'BJCree-Bold',
    fontSize: 14,
    color: NAV,
    letterSpacing: 0.8,
  },

  adminCSVSection: {
    backgroundColor: CREAM,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  adminCSVLabel: {
    fontFamily: 'BJCree-Bold',
    fontSize: 18,
    color: NAV,
    marginBottom: 8,
  },
  adminCSVText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.62)',
    marginBottom: 16,
  },
  adminCSVButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NAV,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  adminCSVButtonText: {
    fontFamily: 'BJCree-Bold',
    fontSize: 15,
    color: CREAM,
    letterSpacing: 0.8,
  },
});
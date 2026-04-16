// app/components/AdminCSVDownload.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import useAuthentication from '../hooks/useAuthentication';


const NAV = '#041e4b';
const CREAM = '#fffefd';

export default function AdminCSVDownload() {
  const { user, userData } = useAuthentication();

  // শুধু admin role দেখাবে
  if (!user || userData?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Only admin users can download CSV.</Text>
      </View>
    );
  }

  const handleDownloadCSV = () => {
    Alert.alert('CSV Export', 'In implementation: this will open the exported users CSV file.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin: User CSV Export</Text>
      <Text style={styles.text}>
        Download or share the user data CSV file for reporting.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleDownloadCSV}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Download User CSV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  heading: {
    fontFamily: 'BJCree-Bold',
    fontSize: 18,
    color: NAV,
    marginBottom: 8,
  },
  text: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.62)',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NAV,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  buttonText: {
    fontFamily: 'BJCree-Bold',
    fontSize: 15,
    color: CREAM,
    letterSpacing: 0.8,
  },
});
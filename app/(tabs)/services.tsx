// import React, { useEffect, useState } from 'react';
// import { ScrollView, Text, View, ActivityIndicator,TouchableOpacity, StyleSheet } from 'react-native';
// import {
//   collection,
//   query,
//   orderBy,
//   limit,
//   getDocs,
//   startAfter,
// } from 'firebase/firestore';
// import Service from '../../components/Service';
// import { db } from '../hooks/firebase.config';

// type ServiceType = {
//   id: string;
//   name: string;
//   image: string;
//   description: string;
// };

// const PAGE_SIZE = 5;

// const Services = () => {
//   const [data, setData] = useState<ServiceType[]>([]);
//   const [lastDoc, setLastDoc] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchData = async () => {
//     setLoading(true);

//     let q = query(
//       collection(db, 'services'),
//       orderBy('name'),
//       limit(PAGE_SIZE)
//     );

//     if (lastDoc) {
//       q = query(
//         collection(db, 'services'),
//         orderBy('name'),
//         startAfter(lastDoc),
//         limit(PAGE_SIZE)
//       );
//     }

//     const snap = await getDocs(q);

//     const newData = snap.docs.map((doc) => ({
//       id: doc.id,
//       ...(doc.data() as Omit<ServiceType, 'id'>),
//     }));

//     setData((prev) => [...prev, ...newData]);
//     setLastDoc(snap.docs[snap.docs.length - 1]);

//     if (snap.docs.length < PAGE_SIZE) {
//       setHasMore(false);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Text style={styles.title}>Services</Text>

//         {data.map((item) => (
//           <Service key={item.id} service={item} />
//         ))}

//         {loading && <ActivityIndicator />}

//         {hasMore && (
//           <TouchableOpacity style={styles.button} onPress={fetchData}>
//             <Text style={styles.buttonText}>Load More</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default Services;

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10 },
//   button: {
//     backgroundColor: '#3A3D42',
//     padding: 12,
//     marginTop: 10,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#AB8C56',
//     fontWeight: 'bold',
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from 'firebase/firestore';
import Service from '../../components/Service';
import { db } from '../hooks/firebase.config';

type ServiceType = {
  id: string;
  name: string;
  image: string;
  description: string;
};

const PAGE_SIZE = 5;

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const Services = () => {
  const [data, setData] = useState<ServiceType[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    let q = query(
      collection(db, 'services'),
      orderBy('name'),
      limit(PAGE_SIZE)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'services'),
        orderBy('name'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    const snap = await getDocs(q);

    const newData = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ServiceType, 'id'>),
    }));

    setData((prev) => [...prev, ...newData]);
    setLastDoc(snap.docs[snap.docs.length - 1]);

    if (snap.docs.length < PAGE_SIZE) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      style={styles.scroll } 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <View>
            <Text style={styles.headerEyebrow}>WHAT WE OFFER</Text>
            <Text style={styles.title}>Services</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Service Cards */}
        {data.map((item) => (
          <Service key={item.id} service={item} />
        ))}

        {/* Loader */}
        {loading && (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="small" color={NAV} />
            <Text style={styles.loaderText}>Loading services…</Text>
          </View>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.82}
            onPress={fetchData}
          >
            <Text style={styles.buttonText}>Load More</Text>
            <Text style={styles.buttonArrow}>↓</Text>
          </TouchableOpacity>
        )}

        {/* End-of-list indicator */}
        {!hasMore && !loading && data.length > 0 && (
          <View style={styles.endRow}>
            <View style={styles.endLine} />
            <Text style={styles.endText}>All services loaded</Text>
            <View style={styles.endLine} />
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default Services;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    fontFamily: 'BJCree-Regular',
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  /* ── Header ── */
  header: {
    fontFamily: 'BJCree-Regular',
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
  headerEyebrow: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    // fontWeight: '700',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'BJCree-Bold',
    fontSize: 32,
    // fontWeight: '800',
    color: NAV,
    letterSpacing: -0.8,
    lineHeight: 36,
  },

  /* ── Divider ── */
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  /* ── Loader ── */
  loaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  loaderText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.50)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  /* ── Load More Button ── */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: NAV,
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 6,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
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
    opacity: 0.65,
  },

  /* ── End of list ── */
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
    marginBottom: 8,
  },
  endLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.12)',
  },
  endText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(4,30,75,0.38)',
    letterSpacing: 1.5,
  },
});
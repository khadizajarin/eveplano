import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator,TouchableOpacity, StyleSheet } from 'react-native';
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Services</Text>

        {data.map((item) => (
          <Service key={item.id} service={item} />
        ))}

        {loading && <ActivityIndicator />}

        {hasMore && (
          <TouchableOpacity style={styles.button} onPress={fetchData}>
            <Text style={styles.buttonText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Services;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 10 },
  button: {
    backgroundColor: '#3A3D42',
    padding: 12,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontWeight: 'bold',
  },
});
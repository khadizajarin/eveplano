import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../hooks/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';


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
        // console.log(docData.data());
      }

      setLoading(false);
    };

    fetch();
  }, [id]);

  if (loading) return <ActivityIndicator />;

  if (!data) return <Text>No Data nai kno</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Image source={{ uri: data.image }} style={{ height: 200 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {data.name}
      </Text>
      <Text>{data.description}</Text>
      <Text>{data.price}</Text>
    </View>
  );
};

export default ServiceDetails;
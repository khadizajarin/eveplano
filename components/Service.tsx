import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Image source={{ uri: service.image }} style={styles.image} />

      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.desc}>{service.description}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
            router.push(`/service/${service.id}` as any)
        }
      >
        <Text style={styles.buttonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Service;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
    borderRadius: 10,
  },
  image: {
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  desc: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3A3D42',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#AB8C56',
    fontWeight: 'bold',
  },
});
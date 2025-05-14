import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Photo} from '../../types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Disabled'>;

const DisabledScreen: React.FC<Props> = ({navigation}) => {
  const [disabledPhotos, setDisabledPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    loadDisabledPhotos();
  }, []);

  const loadDisabledPhotos = async () => {
    const json = await AsyncStorage.getItem('disabledPhotos');
    const keys: string[] = json ? JSON.parse(json) : [];
    const data = await fetch(
      'https://jsonplaceholder.typicode.com/photos',
    ).then(res => res.json());
    const filtered = data.filter((item: Photo) =>
      keys.includes(`${item.albumId}-${item.id}`),
    );

    setDisabledPhotos(filtered.slice(0, 100));
  };

  const enableCard = async (photo: Photo) => {
    const key = `${photo.albumId}-${photo.id}`;
    const json = await AsyncStorage.getItem('disabledPhotos');
    const keys: string[] = json ? JSON.parse(json) : [];

    const updatedKeys = keys.filter(item => item !== key);

    await AsyncStorage.setItem('disabledPhotos', JSON.stringify(updatedKeys));

    await loadDisabledPhotos();

    navigation.reset({
      index: 0,
      routes: [{name: 'Home', params: {isLoad: true}}],
    });
  };

  const renderItem = ({item}: {item: Photo}) => (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.subText}>ID: {item.id}</Text>
      <Text style={styles.subText}>Album ID: {item.albumId}</Text>

      <TouchableOpacity
        style={styles.reenableButton}
        onPress={() => enableCard(item)}>
        <Text style={styles.reenableButtonText}>Re-enable</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disabled Photos</Text>
      <FlatList
        data={disabledPhotos}
        renderItem={renderItem}
        keyExtractor={item => `${item.albumId}-${item.id}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    color: '#c0392b',
  },
  card: {
    backgroundColor: '#ffeaea',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c0392b',
  },
  subText: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  reenableButton: {
    backgroundColor: '#4e7dff',
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  reenableButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DisabledScreen;

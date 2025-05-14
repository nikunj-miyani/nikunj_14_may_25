import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {Photo} from '../../types';
import CustomToggle from '../../components/CustomToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({navigation, route}) => {
  const isLoad = route?.params?.isLoad;

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [search, setSearch] = useState('');
  const [disabledList, setDisabledList] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPhotos();
      await loadDisabledList();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    isLoad && (fetchPhotos(), loadDisabledList());
  }, [isLoad]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/photos');
      const json = await res.json();
      setPhotos(json.slice(0, 100));
    } catch (e) {
      console.error('Failed to fetch photos:', e);
    }
  };

  const loadDisabledList = async () => {
    try {
      const json = await AsyncStorage.getItem('disabledPhotos');
      if (json) {
        setDisabledList(new Set(JSON.parse(json)));
      }
    } catch (e) {
      console.error('Failed to load disabled list:', e);
    } finally {
      setLoading(false);
    }
  };

  const disableCard = useCallback(
    async (photo: Photo) => {
      const key = `${photo.albumId}-${photo.id}`;
      const updated = new Set(disabledList);
      updated.add(key);
      setDisabledList(updated);
      await AsyncStorage.setItem(
        'disabledPhotos',
        JSON.stringify([...updated]),
      );
    },
    [disabledList],
  );

  const renderItem = useCallback(
    ({item}: {item: Photo}) => {
      const key = `${item.albumId}-${item.id}`;
      if (disabledList.has(key)) {
        return null;
      }

      return (
        <View style={styles.card}>
          <Image source={{uri: item.thumbnailUrl}} style={styles.image} />
          <View style={{flex: 1, paddingLeft: 12}}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.subText}>ID: {item.id}</Text>
            <Text style={styles.subText}>Album ID: {item.albumId}</Text>
          </View>
          <CustomToggle isEnabled={true} onToggle={() => disableCard(item)} />
        </View>
      );
    },
    [disableCard, disabledList],
  );

  const filteredPhotos = photos.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      !disabledList.has(`${p.albumId}-${p.id}`),
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{marginBottom: 10, fontSize: 16, color: '#666'}}>
          Loading...
        </Text>
        <ActivityIndicator size="large" color="#4e7dff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Photo Gallery</Text>

      <TextInput
        placeholder="🔍 Search by title"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
        style={styles.searchInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Disabled')}>
        <Text style={styles.buttonText}>View Disabled Photos</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPhotos}
        renderItem={renderItem}
        keyExtractor={item => `${item.albumId}-${item.id}`}
        contentContainerStyle={{paddingBottom: 20}}
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: '#4e7dff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
});

export default HomeScreen;

import React, {useState, useEffect, useContext, useReducer} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {getCustomers} from '../api/mock';
import { AuthContext } from '../utils/authContext';
import {reducer} from '../../reducer';
import AsyncStorage from '@react-native-community/async-storage';
import { get } from '../api/fetch';

const HomeScreen = ({navigation}) =>  {
  const [userRequest, setUserRequest] = useState({
    loading: false,
    data: [],
    error: null,

  });
  const [value, setValue] = useState('');
  const [customerList, setCustomerList] = useState([]);

  const { signOut } = useContext(AuthContext);


  useEffect(() => {
    const getCustomersAsync = async () => {
      try {
        getCustomersData();
      } catch (e) {
      }
    };
    getCustomersAsync();
  }, []);

  const getCustomersData = () => {
    setUserRequest({loading: true});
    get('/customers')
      .then(res => {
        setUserRequest({
          data: res.customers,
          error: res.error || null,
          loading: false,
        });
        setCustomerList(res.customers);
      })
      .catch(error => {
        setUserRequest({ error, loading: false });
      });
  };

  const handleSearch = text => {
    const query = text.toUpperCase();
    const newData = customerList.filter((item) => {
      const itemData = `${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}`;
      return itemData.indexOf(query) > -1;
    });
    setUserRequest({data: newData})
    setValue(text);
  };

  if (userRequest.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={true} size="large" color="#0000ff"/>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={userRequest.data}
        renderItem={({ item }) => (
          <ListItem     
            onPress={async () => {
              await AsyncStorage.setItem('@customer_id', item.id.toString());
              navigation.navigate('Customer Details')
              // viewCustomer(item);
          }}
          bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{`${item.first_name} ${item.last_name}`}</ListItem.Title>
              <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={    
        <SearchBar
          placeholder="Search for Customer..."
          lightTheme
          round
          onChangeText={queryText => handleSearch(queryText)}
          autoCorrect={false}
          value={value}
        />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default HomeScreen;
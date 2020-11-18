import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import CustomerDetailsScreen from './src/screens/CustomerDetailsScreen';
import React, {useEffect, useContext, useMemo, useReducer} from 'react';
import {reducer, initialState} from './reducer';
import {AuthContext} from './src/utils/authContext';
import {stateConditionString} from './src/utils/helpers';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Button,
} from 'react-native';

const Stack = createStackNavigator();

const createHomeStack = () => {
  const {signOut} = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Customers"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <Button
              onPress={() => signOut()}
              title="Log Out"
              color="#349985"
            />
          ),
        }}
      />
      <Stack.Screen name="Customer Details" 
        component={CustomerDetailsScreen} 
        options={{
          headerRight: () => (
            <Button
              onPress={() => signOut()}
              title="Log Out"
              color="#349985"
            />
          ),
        }}
        />
    </Stack.Navigator>
  );
};

export default App = ({navigation}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };
    bootstrapAsync();
  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (data) => {
        console.log("sign in");
        if (
          data &&
          data.email !== undefined &&
          data.password !== undefined
        ) {
          dispatch({type: 'SIGN_IN', token: 'Token-For-Now'});
        } else {
          dispatch({type: 'TO_SIGNIN_PAGE'});
        }
      },
      signOut: async (data) => {
        dispatch({type: 'SIGN_OUT'});
      },
      viewCustomer: async (data) => {
        await AsyncStorage.setItem('@customer_id', data.id.toString());
        dispatch({type: 'VIEW_CUSTOMER', customer_id: data.id})
      },
    }),
    [],
  );

  const chooseScreen = (state) => {
    let navigateTo = stateConditionString(state);
    let arr = [];

    switch (navigateTo) {
      case 'LOAD_CUSTOMER':
        arr.push(<Stack.Screen name="Customer Details" component={CustomerDetailsScreen} />);
        break;

      case 'LOAD_SIGNIN':
        arr.push(<Stack.Screen name="Sign In" component={LoginScreen} />);
        break;

      case 'LOAD_HOME':
        arr.push(
          <Stack.Screen
            name="Home"
            component={createHomeStack}
            options={{
              title: 'LoanInc Mobile',
              headerStyle: {backgroundColor: '#349985'},
              headerTintColor: 'white',
            }}
          />,
        );
        break;
      default:
        arr.push(<Stack.Screen name="Sign In" component={LoginScreen} />);
        break;
    }
    return arr[0];
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer>
        <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}


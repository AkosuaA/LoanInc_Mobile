import React, {useState, useEffect, useContext} from 'react';
import { validateAll } from 'indicative/validator';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Input,
  FormValidationMessage,
} from 'react-native-elements';
import { AuthContext } from '../utils/authContext';
import { post } from '../api/fetch';

const LoginScreen = ({navigation}) => {
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [SignInErrors, setSignInErrors] = useState({});

  const { signIn } = useContext(AuthContext);

  const handleSignIn = () => {
    const rules = {
        email: 'required|email',
        password: 'required|string|min:6|max:40'
    };

    const data = {
        email: email,
        password: password
    };

    const messages = {
        required: field => `${field} is required`,
        'email.email': 'Please enter a valid email address',
        'password.min': 'Password must be between 6 - 40 characters'
    };

    validateAll(data, rules, messages)
        .then(() => {
            post('/login', data)
            .then(res => {
              if (res.status == "invalid"){
                const authenticationError = {}
                authenticationError[res.field] = res.message
                setSignInErrors(authenticationError);
              }
              else {
                signIn({ email, password });
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
            const formatError = {};
            err.forEach(err => {
                formatError[err.field] = err.message;
            });
            setSignInErrors(formatError);
        });
};

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>LOAN INC</Text>
      <View style={styles.inputView}>
        <Input
          style={styles.inputText}
          errorStyle={{ color: 'red'}}
          value={email}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={onChangeEmail}
          keyboardType="email-address"
          errorMessage={SignInErrors ? SignInErrors.email : null}
          inputContainerStyle={{borderBottomWidth:0}}
        />
      </View>
      <View style={styles.inputView}>
        <Input
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          value={password}
          placeholderTextColor="#003f5c"
          errorStyle={{ color: 'red'}}
          onChangeText={onChangePassword}
          errorMessage={SignInErrors ? SignInErrors.password : null}
          inputContainerStyle={{borderBottomWidth:0}}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => handleSignIn()}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#349985',
    marginBottom: 30,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 40,
    justifyContent: 'center',
    paddingTop: 30,
  },
  forgotPassword: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#349985',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
});

export default LoginScreen;

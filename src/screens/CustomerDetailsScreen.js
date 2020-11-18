import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Animated,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
  ImageBackground,
  LogBox,
} from 'react-native';
import {getCustomer} from '../api/mock';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Icon, Card } from 'react-native-elements';
import { get } from '../api/fetch';
import PureChart from 'react-native-pure-chart';
import moment from 'moment';
import {ProgressBar} from '@react-native-community/progress-bar-android';

const CustomerDetailsScreen = ({navigation}) => {
  const [customer, setCustomerDetails] = useState({
    loading: false,
    details: {},
    error: null,
  });
  const [paymentData, setPaymentData] = useState({
    amount_loaned: 0,
    amount_paid: 0,
    percent_paid: 0,
    expected_payment: 0,
    percent_expected: 0,
    amount_remaining: 0,
    percent_remaining: 0,
  })
  
  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <TouchableHighlight>
  //         <Icon name="queue" size={16} color="#000" onPress={console.log("pressed!")}/>
  //       </TouchableHighlight>
  //     ),
  //   });
  // }, [navigation]);

  useEffect(() => {
    const getCustomerAsync = async () => {
      try {
        getCustomerDetails();
      } catch (e) {
      }
    };
    getCustomerAsync();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const getCustomerDetails = async () => {
    setCustomerDetails({loading: true});
    try {
      const customer_id = await AsyncStorage.getItem('@customer_id');
      if (customer_id !== null) {
        get('/customer/' + customer_id)
          .then(res => {
            setCustomerDetails({
              details: res.customer,
              error: res.error || null,
              loading: false,
            });


            const amount_loaned = res.customer.loans[0].amount;
            const expected_monthly_payment = (amount_loaned/12);
            const loan_date = moment(res.customer.loans[0].loan_date);
            const now = moment();
            const start = moment(loan_date);
            const duration = moment.duration(now.diff(start));
            const months_passed = duration.asMonths();
            const expected_payment = expected_monthly_payment * months_passed;
            const amount_paid = res.customer.payments.reduce(function(result, obj) {
              result += Number(obj.amount)
              return result;
            }, 0);
            setPaymentData({
              amount_loaned: amount_loaned,
              amount_paid: amount_paid,
              percent_paid: (amount_loaned > 0) ? Number((amount_paid/amount_loaned).toFixed(2)) : 0,
              expected_payment: Number(expected_payment.toFixed(2)),
              percent_expected: (amount_loaned > 0) ? Number((expected_payment/amount_loaned).toFixed(2)) : 0,
              amount_remaining: amount_loaned - amount_paid,
              percent_remaining: (amount_loaned > 0) ? Number(((amount_loaned - amount_paid)/amount_loaned).toFixed(2)) : 0,
            });
          })
          .catch(error => {
            setCustomerDetails({ error, loading: false });
          });
      }
    } catch (e) {
      return null;
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={10}
          source={{uri: "https://reactjs.org/logo-og.png"}}
        >
          <View style={styles.headerColumn}>
            <Image
              style={styles.userImage}
              source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}
            />
            <Text style={styles.userNameText}>ID {`${customer.details.id}`}</Text>
            <Text style={styles.userNameText}>{`${customer.details.first_name} ${customer.details.middle_name} ${customer.details.last_name}`}</Text>
          </View>
        </ImageBackground>
      </View>
    )
  }

  const Separator = () => {
    return (
      <View style={styles.container}>
        <View style={styles.separatorOffset} />
        <View style={styles.separator} />
      </View>
    )
  }

  const Tel = ({
    index,
    number,
  }) => {
  
    return (
      <TouchableOpacity>
        <View style={styles.telCardcontainer}>
          <View style={styles.iconRow}>
            {index === 0 && (
              <Icon
                name="call"
                underlayColor="transparent"
                iconStyle={styles.telIcon}
              />
            )}
          </View>
          <View style={styles.telRow}>
            <View style={styles.telNumberColumn}>
              <Text style={styles.telNumberText}>{number}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderTel = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={customer.details.phone_numbers}
      keyExtractor={item => item.id.toString()}
      renderItem={(list) => {
        const { id, number } = list.item

        return (
          <Tel
            // key={`tel-${id}`}
            index={list.index}
            number={number}
          />
        )
      }}
    />
  )

  const Address = ({
    index,
    region,
    city,
    location,
  }) => {
  
    return (
      <TouchableOpacity>
        <View style={styles.telCardcontainer}>
          <View style={styles.iconRow}>
            {index === 0 && (
              <Icon
                name="place"
                underlayColor="transparent"
                iconStyle={styles.telIcon}
              />
            )}
          </View>
          <View style={styles.telRow}>
            <View style={styles.telNumberColumn}>
            <Text style={styles.telNumberText}>{location}, {city}, {region}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderAddress = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={customer.details.addresses}
      renderItem={(list) => {
        const { id, region, city, location } = list.item

        return (
          <Address
            // key={`addr-${id}`}
            index={list.index}
            region={region}
            city={city}
            location={location}
          />
        )
      }}
      keyExtractor={item => item.id.toString()}
    />
  )


  if (customer.loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={true} size="large" color="#0000ff"/>
      </View>
    );
  }
  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          {renderHeader()}
          {renderTel()}
          <Separator/>
          {renderAddress()}
          <Separator/>
          <View style={styles.chartContainer}>
            <View style={styles.paymentInfo}>
              <Text>Amount Loaned: {`Ghc ${paymentData.amount_loaned}`}</Text>
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={1}
                color="#4287f5"
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text>Amount Paid: {`Ghc ${paymentData.amount_paid}`}</Text>
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={paymentData.percent_paid}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text>Amount Expected: {`Ghc ${paymentData.expected_payment}`}</Text>
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={paymentData.percent_expected}
                color="#000000"
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text>Amount Remaining: {`Ghc ${paymentData.amount_remaining}`}</Text>
              <ProgressBar
                styleAttr="Horizontal"
                indeterminate={false}
                progress={paymentData.percent_remaining}
                color="#f50202"
              />
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  telCardcontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  telIcon: {
    color: 'gray',
    fontSize: 30,
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
  },
  separatorOffset: {
    flex: 2,
    flexDirection: 'row',
  },
  separator: {
    borderColor: '#EDEDED',
    borderWidth: 0.8,
    flex: 8,
    flexDirection: 'row',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  paymentInfo: {
    marginVertical: 24,
  },
});

export default CustomerDetailsScreen;
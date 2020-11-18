import {getToken} from './token';

const mockSuccess = (value) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), 2000);
  });
};

const mockFailure = (value) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(value), 2000);
  });
};

export const login = (email, password, shouldSucceed = true) => {
  if (!shouldSucceed) {
    return mockFailure({error: 500, message: 'Something went wrong!'});
  }

  return mockSuccess({auth_token: 'successful_fake_token'});
};

export const getCustomers = async (shouldSucceed = true) => {
  const token = await getToken();
  if (token !== 'successful_fake_token') {
    return mockFailure({error: 401, message: 'Invalid Request'});
  }

  return mockSuccess({
    customers: [
      {
        id: 1,
        title: 'Mr',
        first_name: "Kofi",
        middle_name: "David",
        last_name: "Assan",
        email: 'test@test.ca',
      },
      {
        id: 2,
        title: 'Mr',
        first_name: "Kofi",
        middle_name: "David",
        last_name: "Assan",
        email: 'test2@test.ca',
      },
      {
        id: 3,
        title: 'Mr',
        first_name: "Kofi",
        middle_name: "David",
        last_name: "Assan",
        email: 'test2@test.ca',
      },
    ],
  });
};

export const getCustomer = async (id) => {
  const token = await getToken();
  if (token !== 'successful_fake_token') {
    return mockFailure({error: 401, message: 'Invalid Request'});
  }

  return mockSuccess({
    customer:
      {
        id: 1,
        title: 'Mr',
        first_name: "Kofi",
        middle_name: "David",
        last_name: "Assan",
        email: 'test@test.ca',
        payments: [

        ]
      },
  });
};

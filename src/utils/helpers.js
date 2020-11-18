export const stateConditionString = state => {
    let navigateTo = '';
    if (state.isSignedIn && state.userToken && state.isSignedUp) {
        navigateTo = 'LOAD_HOME';
    }
    if (!state.isSignedIn && !state.noAccount) {
        navigateTo = 'LOAD_SIGNIN';
    }
    if (state.isSignedOut) {
        navigateTo = 'LOAD_SIGNIN';
    }
    if (state.isSignedIn && state.userToken && state.CustomerID) {
        navigateTo = 'LOAD_CUSTOMER';
    }
    return navigateTo;
};
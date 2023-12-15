import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import authReducer from 'src/redux/slices/auth';
import createEventReducer from 'src/redux/slices/createEvent';
import eventSlugReducer from 'src/redux/slices/eventSlug';
import folderReducer from 'src/redux/slices/folderDetails';
import kycStatusReducer from 'src/redux/slices/kycStatus';
import loginReducer from 'src/redux/slices/login';
import prePlanReducer from 'src/redux/slices/prePlans';
import successReducer from 'src/redux/slices/successMessage';
import userReducer from 'src/redux/slices/user';
import userTypeReducer from 'src/redux/slices/userType';
import uploadStatusReducer from 'src/redux/slices/uploadStatus';
import uploadStatusDrawerReducer from 'src/redux/slices/uploadDrawer';
import customPlanReducer from 'src/redux/slices/customPlan'
import passcodeReducer from 'src/redux/slices/passcode'
import passcodeStatusReducer from 'src/redux/slices/passcodeStatus'
import selfieReducer from 'src/redux/slices/hasSelfie'


// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const userTypeConfig = {
  key: 'usertype',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const userConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const loginConfig = {
  key: 'login',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const authConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const createEventConfig = {
  key: 'createEvent',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const folderConfig = {
  key: 'folder',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};


const eventSlugConfig = {
  key: 'eventSlug',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const successConfig = {
  key: 'success',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const kycConfig = {
  key: 'kycStatus',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const prePlanConfig = {
  key: 'prePlans',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const uploadStatusConfig = {
  key: 'uploadStatus',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const uploadStatusDrawerConfig = {
  key: 'uploadStatusDrawer',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const customPlanConfig = {
  key: 'customPlan',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};

const passcodeConfig = {
  key: 'passcode',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};
const passcodeStatusConfig = {
  key: 'passcodeStatus',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};
const hasSelfieConfig = {
  key: 'selfie',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['value'],
};
const rootReducer = combineReducers({
  auth: persistReducer(authConfig, authReducer),
  createEvent: persistReducer(createEventConfig, createEventReducer),
  eventSlug: persistReducer(eventSlugConfig, eventSlugReducer),
  folder: persistReducer(folderConfig, folderReducer),
  kycStatus: persistReducer(kycConfig, kycStatusReducer),
  login: persistReducer(loginConfig, loginReducer),
  prePlan: persistReducer(prePlanConfig, prePlanReducer),
  success: persistReducer(successConfig, successReducer),
  user: persistReducer(userConfig, userReducer),
  userType: persistReducer(userTypeConfig, userTypeReducer),
  uploadStatus: persistReducer(uploadStatusConfig, uploadStatusReducer),
  uploadStatusDrawer: persistReducer(uploadStatusDrawerConfig, uploadStatusDrawerReducer),
  customPlan : persistReducer(customPlanConfig,  customPlanReducer),
  passcode : persistReducer(passcodeConfig,  passcodeReducer),
  passcodeStatus: persistReducer(passcodeStatusConfig, passcodeStatusReducer),
  hasSelfie : persistReducer(hasSelfieConfig, selfieReducer)

});

export { rootPersistConfig, rootReducer };

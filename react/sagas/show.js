import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from 'constants/show_action_types';
import { addAssetRequest, updateShowAsset, showNewAsset, addChannelRequest, showNewChannel, updateShowChannel, addNewChannelToChannelList, updateFileAvailability, updateDisplayAssetError } from 'actions/show';
import { UNAVAILABLE, AVAILABLE } from 'constants/asset_display_states';
import { checkFileAvailability, triggerClaimGet } from 'api/fileApi';
import { getLongClaimId, getShortId, getClaimData } from 'api/assetApi';
import { getChannelData, getChannelClaims } from 'api/channelApi';

function* newAssetRequest (action) {
  const { id, name, modifier } = action.data;
  let success, message, longId;
  try {
    ({success, message, data: longId} = yield call(getLongClaimId, name, modifier));
  } catch (error) {
    yield put(addAssetRequest(id, error.message, name, null));
  }
  if (success) {
    yield put(addAssetRequest(id, null, name, longId));
    const newAssetId = `a#${name}#${longId}`; // note move to action
    return yield put(showNewAsset(newAssetId, name, longId));
  }
  yield put(addAssetRequest(id, message, name, null));
};

function* getAssetDataAndShowAsset (action) {
  const {id, name, claimId} = action.data;
  // if no error, get short Id
  let success, message, shortId;
  try {
    ({success, message, data: shortId} = yield call(getShortId, name, claimId));
  } catch (error) {
    return yield put(updateShowAsset(id, error.message, null, null, null)); // add with error
  }
  if (!success) {
    return yield put(updateShowAsset(id, message, null, null, null)); // add with error
  }
  // if no error, get claim data
  success = null;
  let claimData;
  try {
    ({success, message, data: claimData} = yield call(getClaimData, name, claimId));
  } catch (error) {
    return yield put(updateShowAsset(id, error.message, null, null, null)); // add with error
  }
  if (!success) {
    return yield put(updateShowAsset(id, message, null, null, null)); // add with error
  }
  // if both are successfull, add to asset list and select for showing
  yield put(updateShowAsset(id, null, name, claimId, shortId, claimData));
  // yield put(addAssetToAssetList(arg1, arg2));
}

function* retrieveFile (action) {
  const name = action.data.name;
  const claimId = action.data.claimId;
  // see if the file is available
  let success, message, isAvailable;
  try {
    ({ success, message, data: isAvailable } = yield call(checkFileAvailability, name, claimId));
  } catch (error) {
    return yield put(updateDisplayAssetError(error.message));
  };
  if (success) {
    if (isAvailable) {
      return yield put(updateFileAvailability(AVAILABLE));
    }
    yield put(updateFileAvailability(UNAVAILABLE));
  } else {
    yield put(updateDisplayAssetError(message));
  }
  // initiate get request for the file
  try {
    ({ success, message } = yield call(triggerClaimGet, name, claimId));
  } catch (error) {
    return yield put(updateDisplayAssetError(error.message));
  };
  if (success) {
    console.log('/api/glaim-get response:', message);
    yield put(updateFileAvailability(AVAILABLE));
  } else {
    yield put(updateDisplayAssetError(message));
  }
};

function* newChannelRequest (action) {
  const { id, name, channelId } = action.data;
  let success, message, data;
  try {
    ({success, message, data} = yield call(getChannelData, name, channelId));
  } catch (error) {
    return yield put(addChannelRequest(id, error.message, null, null, null));
  }
  if (!success) {
    return yield put(addChannelRequest(id, message, null, null, null));
  }
  const { channelName, longChannelClaimId, shortChannelClaimId } = data;
  yield put(addChannelRequest(id, null, channelName, longChannelClaimId, shortChannelClaimId));
  const channelRecordId = `c#${channelName}#${longChannelClaimId}`;  // move to the action
  yield put(showNewChannel(channelRecordId, channelName, longChannelClaimId ));
}

function* getNewChannelDataAndShowChannel (action) {
  const { id, name, longId, channelData } = action;
  let success, message, claimsData;
  try {
    ({ success, message, data: claimsData } = yield call(getChannelClaims, name, longId, 1));
  } catch (error) {
    return yield put(updateShowChannel(error.message, channelData, null));
    // yield put(addNewChannelToChannelList(id, error.message, null, null));
  }
  if (!success) {
    return yield put(updateShowChannel(message, channelData, null));
    // yield put(addNewChannelToChannelList(id, message, null, null));
  }
  yield put(updateShowChannel(null, channelData, claimsData));
  yield put(addNewChannelToChannelList(id, null, channelData, claimsData));
}

export function* watchNewAssetRequest () {
  yield takeLatest(actions.ASSET_REQUEST_NEW, newAssetRequest);
};

export function* watchNewChannelRequest () {
  yield takeLatest(actions.CHANNEL_REQUEST_NEW, newChannelRequest);
};

export function* watchShowNewAsset () {
  yield takeLatest(actions.SHOW_ASSET_NEW, getAssetDataAndShowAsset);
};

export function* watchShowNewChannel () {
  yield takeLatest(actions.SHOW_CHANNEL_NEW, getNewChannelDataAndShowChannel);
};

export function* watchFileIsRequested () {
  yield takeLatest(actions.FILE_REQUESTED, retrieveFile);
};

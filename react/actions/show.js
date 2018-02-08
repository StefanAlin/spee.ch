import * as actions from 'constants/show_action_types';

// basic request parsing
export function updateRequestError (error) {
  return {
    type: actions.REQUEST_ERROR_UPDATE,
    data: error,
  };
}

export function updateRequestWithChannelRequest (name, id) {
  const requestId = `cr#${name}#${id}`;
  return {
    type: actions.REQUEST_CHANNEL_UPDATE,
    data: { requestId, name, id },
  };
};

export function updateRequestWithAssetRequest (name, id, channelName, channelId, extension) {
  const requestId = `ar#${name}#${id}#${channelName}#${channelId}`;
  return {
    type: actions.REQUEST_CLAIM_UPDATE,
    data: {
      requestId,
      name,
      modifier: {
        id,
        channel: {
          name: channelName,
          id  : channelId,
        },
      },
      extension,
    },
  };
};

// request for an asset

export function newAssetRequest (id, name, modifier) {
  return {
    type: actions.ASSET_REQUEST_NEW,
    data: { id, name, modifier },
  };
};

export function addAssetRequest (id, error, name, claimId) {
  return {
    type: actions.ASSET_REQUEST_ADD,
    data: { id, error, name, claimId },
  };
};

// show an asset

export function showNewAsset (id, name, claimId) {
  return {
    type: actions.SHOW_ASSET_NEW,
    data: { id, name, claimId },
  };
};

export function updateShowAsset (id, error, name, claimId, shortId, claimData) {
  return {
    type: actions.SHOW_ASSET_UPDATE,
    data: { id, error, name, claimId, shortId, claimData },
  };
};

export function clearShowAsset () {
  return {
    type: actions.SHOW_ASSET_CLEAR,
  };
};

// request for a channel

export function newChannelRequest (id, name, channelId) {
  return {
    type: actions.CHANNEL_REQUEST_NEW,
    data: {id, name, channelId},
  };
};

export function addChannelRequest (id, error, name, longId, shortId) {
  return {
    type: actions.CHANNEL_REQUEST_ADD,
    data: { id, error, name, longId, shortId },
  };
}

// show a channel

export function showNewChannel (id, name, longId, channelData) {
  return {
    type: actions.SHOW_CHANNEL_NEW,
    data: { id, name, longId, channelData},
  };
};

// export function showExistingChannel (existingChannel) {
//   return {
//     type: actions.SHOW_CHANNEL_EXISTING,
//     data: { existingChannel },
//   };
// };

export function updateShowChannel (error, channelData, claimData) {
  return {
    type: actions.SHOW_CHANNEL_UPDATE,
    data: { error, channelData, claimData },
  }
};

export function clearShowChannel () {
  return {
    type: actions.SHOW_CHANNEL_CLEAR,
  };
};

// add channels to channel list

export function addNewChannelToChannelList (id, error, channelData, claimsData) {
  return {
    type: actions.CHANNEL_LIST_ADD,
    data: { id, error, channelData, claimsData },
  };
};

// display a file

export function fileRequested (name, claimId) {
  return {
    type: actions.FILE_REQUESTED,
    data: { name, claimId },
  };
};

export function updateFileAvailability (status) {
  return {
    type: actions.FILE_AVAILABILITY_UPDATE,
    data: status,
  };
};

export function updateDisplayAssetError (error) {
  return {
    type: actions.DISPLAY_ASSET_ERROR,
    data: error,
  };
};

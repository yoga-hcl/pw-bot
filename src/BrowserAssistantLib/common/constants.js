const roomState = Object.freeze({
  UNKNOWN: 0,
  ONINITIALIZE: 1,
  INITIALIZED: 2,
  ONDEINITIALIZE: 3,
  DEINITIALIZED: 4,
  JOINING: 5,
  JOINED: 6,
  REJOINING: 7,
  REJOINED: 8,
  EXITING: 9,
  EXITED: 10
});

const roomType = Object.freeze({
  UNKNOWN: 0,
  MSTEAM: 1,
  ZOOM: 2,
  EIGHTCROSSEIGHT: 3
});


module.exports = {
  roomState,
  roomType
}
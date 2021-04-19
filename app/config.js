// make it a js file, so that I can add comments
// always change constants in one place
module.exports = {
  FRAME_PER_SECOND: 10,
  ROAD_LENGTH: 1500, // m
  MAX_SPEED: 27, // m/s  - 97.2 km/h
  MAX_ACCELERATE_SPEED: 2.7, // m/s^2
  MAX_DECELERATE_SPEED: -10, // m/s^2
  DISTANCE_TO_HIT_BRAKE_HARDEST: 5, // m
  DISTANCE_START_TO_HIT_BRAKE: 45, // m
  CAR_LENGTH: 3, // m
  CAR_WIDTH: 2, // m
  // A road is broken into many segments, so that they can fit into one screen, and no need to scroll
  SEGMENT_LENGTH: 1500, // px
  SEGMENT_HEIGHT: 100,
  FIRST_SEGMENT_HEIGHT: 40,
};
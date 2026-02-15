
const previousZoneStates = {};

exports.hasAlertChanged = (zone, newLevel) => {
  const previousLevel = previousZoneStates[zone];

  if (previousLevel !== newLevel) {
    previousZoneStates[zone] = newLevel;
    return true;
  }

  return false;
};

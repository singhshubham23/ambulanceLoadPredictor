exports.getDashboardOverview = async (req, res) => {
  const [zones, hospitals] = await Promise.all([
    zoneService.getZoneDensityData(),
    hospitalService.getHospitalLoadData()
  ]);

  res.json({
    timestamp: new Date(),
    zones,
    hospitals
  });
};

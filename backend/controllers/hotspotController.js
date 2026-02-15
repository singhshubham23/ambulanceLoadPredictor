const Joi = require("joi");
const Accident = require("../models/Accident");
const hotspotCacheService = require("../services/hotspotCacheService");


const hotspotQuerySchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  radius: Joi.number().min(100).max(50000).default(5000),
  city: Joi.string().trim().optional(),
  hours: Joi.number().integer().min(1).max(168).default(24),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

exports.getAccidentHotspots = async (req, res, next) => {
  try {


    const { error, value } = hotspotQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const { lat, lng, radius, city, hours, page, limit } = value;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const cacheKey = `${lat}_${lng}_${radius}_${city || "all"}_${hours}_${page}_${limit}`;

    
    const cached = hotspotCacheService.getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: radius,
          query: {
            date: { $gte: since },
            ...(city && { city })
          }
        }
      },
      {
        $group: {
          _id: {
            lat: {
              $multiply: [
                {
                  $floor: {
                    $multiply: [
                      { $arrayElemAt: ["$location.coordinates", 1] },
                      100
                    ]
                  }
                },
                0.01
              ]
            },
            lng: {
              $multiply: [
                {
                  $floor: {
                    $multiply: [
                      { $arrayElemAt: ["$location.coordinates", 0] },
                      100
                    ]
                  }
                },
                0.01
              ]
            }
          },
          accidentCount: { $sum: 1 },
          avgSeverity: { $avg: "$severity" }
        }
      },
      {
        $sort: { accidentCount: -1 }
      }
    ];

    const hotspots = await Accident.aggregate(pipeline);

   
    const totalHotspots = hotspots.length;
    const totalPages = Math.ceil(totalHotspots / limit);
    const startIndex = (page - 1) * limit;

    const paginatedHotspots = hotspots.slice(
      startIndex,
      startIndex + limit
    );

    // 🔥 Convert to GeoJSON
    const geoJSON = {
      success: true,
      timestamp: new Date(),
      meta: {
        center: { lat, lng },
        radius,
        hours,
        page,
        limit,
        totalHotspots,
        totalPages
      },
      type: "FeatureCollection",
      features: paginatedHotspots.map((h) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [h._id.lng, h._id.lat],
        },
        properties: {
          accidentCount: h.accidentCount,
          avgSeverity: Number((h.avgSeverity || 0).toFixed(2)),
          hotspotLevel:
            h.accidentCount > 10
              ? "CRITICAL"
              : h.accidentCount > 5
              ? "HIGH"
              : h.accidentCount > 2
              ? "MEDIUM"
              : "LOW",
        },
      })),
    };


    hotspotCacheService.setCache(cacheKey, geoJSON);

    return res.json(geoJSON);

  } catch (err) {
    console.error("Hotspot error:", err.message);
    next(err);
  }
};

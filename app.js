require("dotenv").config();
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware");

const app = express();

app.use(cors());
app.use(errorHandler);

// Routes

app.get("/", (req, res) => {
  res.send("Welcome to my server for Booking-Smart.");
});

app.get("/merchant", async (req, res) => {
  const queryKeyword = req.query.keyword;

  const fetchPlaceId = async () => {
    const config = {
      params: {
        key: process.env.PLACES_API_KEY,
        input: queryKeyword,
        inputtype: "textquery",
        fields: "name,place_id",
      },
    };

    // handle zero result
    const { data: response } = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      config
    );

    if (response.status === "ZERO_RESULTS") {
      return "No Match Result";
    }
    return response.candidates[0].place_id;
  };

  const fetchPlaceDetail = async (placeId) => {
    const config = {
      params: {
        key: process.env.PLACES_API_KEY,
        place_id: placeId,
        fields: "name,rating,reviews,user_ratings_total,formatted_address,url",
        reviews_sort: "newest",
        language: "zh-TW",
      },
    };

    const { data: response } = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      config
    );
    console.log("Response logged from server:");
    console.log(response);
    return response;
  };

  const placeId = await fetchPlaceId();

  if (placeId === "No Match Result") {
    console.log("The API response with no result.");
    res.send({ result: { name: "No Match Result" } });
  } else {
    const resultObj = await fetchPlaceDetail(placeId);
    res.send(resultObj);
  }
});

app.listen(8080, () => {
  console.log("Server on port 8080.");
});

import React, { useEffect, useRef, useMemo, useState } from "react";
//firebase
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { Loading } from "../components/Loading";
//
import { BsWhatsapp } from "react-icons/bs";
import { BsFillTelephoneFill } from "react-icons/bs";

//
import { useParams } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";

//map leaflet
import {
  Circle,
  FeatureGroup,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";

const fillBlueOptions = { fillColor: "blue" };
const fillRedOptions = { fillColor: "red" };
const greenOptions = { color: "green", fillColor: "green" };
const purpleOptions = { color: "purple" };

export default function Listing() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [Loader, setLoader] = useState(true);
  const [ListingData, setListingData] = useState(null);

  const [Longlat, setLonglat] = useState([]);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const ListingItem = async () => {
      const docRef = doc(db, "listing", params.itemid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListingData(docSnap.data());
        setLonglat([docSnap.data().latitude, docSnap.data().longitude]);
        setLoader(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    ListingItem();
  }, [params.itemid]);

  if (Loader) {
    return <Loading />;
  }

  return (
    <section className="listingItem-wrapper">
      <div className="row">
        <div className="col-md-8">
          <div className="details_item">
            <div className="details_item--image">
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
              >
                {ListingData.Images.map((image) => (
                  <SwiperSlide>
                    <img src={image} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {ListingData.Images.map((image) => (
                  <SwiperSlide>
                    <img src={image} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="details_item--description">
              <h2>Description</h2>
              <p>
                How the adventure ended will be seen anon. Aouda was anxious,
                though she said nothing. As for Passepartout, he thought Mr.
                Fogg’s manoeuvre simply glorious. The captain had said “between
                eleven and twelve knots,” and the Henrietta confirmed his
                prediction.
              </p>
            </div>
            <div className="details_item--map">
              <h2>Location</h2>

              <div className="details_item--map--card">
                <MapContainer
                  center={Longlat}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FeatureGroup pathOptions={purpleOptions}>
                    <Popup>Popup in FeatureGroup</Popup>
                    <Circle
                      center={Longlat}
                      pathOptions={fillBlueOptions}
                      radius={200}
                    />
                    {/* <Circle center={[51.51, -0.06]} radius={200} /> */}
                  </FeatureGroup>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="details_box">
            <h1>{ListingData.Title}</h1>
            <hr />
            <h2 className="text-primary">$ {ListingData.Price}</h2>
            <div className="details_box--infos">
              <div className="details_box--infos--card">
                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    Brand :
                  </div>
                  <div>{ListingData.Brand}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    Model :
                  </div>
                  <div>{ListingData.Model}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    ModelYear :
                  </div>
                  <div>{ListingData.ModelYear.toString()}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    NumberDoors :
                  </div>
                  <div>{ListingData.NumberDoors}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    Price :
                  </div>
                  <div>{ListingData.Price} $</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    DiscountedPrice :
                  </div>
                  <div>{ListingData.DiscountedPrice} $</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    State :
                  </div>
                  <div>{ListingData.State}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    Type :
                  </div>
                  <div>{ListingData.Type}</div>
                </div>

                <div className="details_box--infos--card--item">
                  <div className="details_box--infos--card--item--title">
                    Mileage :
                  </div>
                  <div>{ListingData.Mileage}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact_info d-grid col-6 mx-auto">
            <a
              className="btn btn-outline-primary mt-2 mb-2 btn-call"
              href="tel:212644548767"
            >
              <BsFillTelephoneFill /> +212 644548767
            </a>
            <a className="btn btn-whatsapp" href="https://wa.me/212644548767">
              <BsWhatsapp /> chat via whatsapp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

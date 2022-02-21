import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
//firebase - firestore
import {
  collection,
  getDoc,
  query,
  limit,
  where,
  doc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
//loader
import { Loading } from "../components/Loading";
//toastify
import { toast } from "react-toastify";
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// import required modules Swiper
import { FreeMode, Pagination, Controller } from "swiper";

export default function Home() {
  const [listings, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const swiper = useSwiper();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ListingRef = collection(db, "listing");
        // const listingSnap = await getDocs(ListingRef);

        //create a query
        const q = query(ListingRef, limit(5));

        //execute the query
        const qSnapshot = await getDocs(q);
        const listings = [];

        qSnapshot.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Hero />

      {loading ? (
        <Loading />
      ) : listings && listings.length > 0 ? (
        <>
          <section className="listingRecent">
            <h2>Recent Listing</h2>

            <div className="listingRecent_boxes">
              {listings.map((list) => (
                <div className="listingRecent_boxes--card" key={list.id}>
                  <div className="listingRecent_boxes--card--item">
                    <div className="listingRecent_boxes--card--item--img">
                      <img src={list.data.Images} alt={list.data.Brand} />
                    </div>
                    <div className="listingRecent_boxes--card--item--info">
                      <div className="listingRecent_boxes--card--item--info--header">
                        <h1>{list.data.Brand}</h1>
                        <p>$ {list.data.Price}</p>
                      </div>
                      <div className="listingRecent_boxes--card--item--info--body">
                        <p>model:{list.data.Model}</p>
                        <p>type:{list.data.Type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <h2>no listing yet</h2>
      )}

      <section className="popular_section">
        <div className="popular_section--wrapper">
          <h2>Popular</h2>
          <div className="popular_section--wrapper--carouselItems">
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
              modules={[Controller]}
            >
              {loading ? (
                <Loading />
              ) : listings && listings.length > 0 ? (
                <>
                  {listings.map((list) => (
                    <SwiperSlide key={list.id}>
                      <div className="popular_section_boxes--item">
                        <div className="popular_section_boxes--item--img">
                          <img src={list.data.Images} alt={list.data.Brand} />
                        </div>
                        <div className="popular_section_boxes--item--info">
                          <div className="popular_section_boxes--item--info--header">
                            <h1>{list.data.Brand}</h1>
                            <p>$ {list.data.Price}</p>
                          </div>
                          <div className="popular_section_boxes--item--info--body">
                            <p>model:{list.data.Model}</p>
                            <p>type:{list.data.Type}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                  {listings.map((list) => (
                    <SwiperSlide key={list.id}>
                      <div className="popular_section_boxes--item">
                        <div className="popular_section_boxes--item--img">
                          <img src={list.data.Images} alt={list.data.Brand} />
                        </div>
                        <div className="popular_section_boxes--item--info">
                          <div className="popular_section_boxes--item--info--header">
                            <h1>{list.data.Brand}</h1>
                            <p>$ {list.data.Price}</p>
                          </div>
                          <div className="popular_section_boxes--item--info--body">
                            <p>model:{list.data.Model}</p>
                            <p>type:{list.data.Type}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </>
              ) : (
                <h2>no listing yet</h2>
              )}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}

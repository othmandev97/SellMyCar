import React, { useEffect, useState } from "react";
//firebase firestore
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  startAt,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.config";
//loader
import { Loading } from "../components/Loading";
//toastify
import { toast } from "react-toastify";
import { ListingItem } from "../components/ListingItem";
export default function Offers() {
  const [listings, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [LastfetchListing, setLastfetchListing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ListingRef = collection(db, "listing");

        //create a query
        const q = query(ListingRef, where("Offer", "==", true), limit(1));

        //execute the query
        const qSnapshot = await getDocs(q);
        // Get the last visible document
        const lastVisible = qSnapshot.docs[qSnapshot.docs.length - 1];
        setLastfetchListing(lastVisible);

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

  const onLoadMore = async () => {
    try {
      const ListingRef = collection(db, "listing");

      //create a query
      // Construct a new query starting at this document,
      // get the next 25 cities.
      const q = query(
        ListingRef,
        where("Offer", "==", true),
        startAfter(LastfetchListing),
        limit(1)
      );

      //execute the query
      const qSnapshot = await getDocs(q);
      const listings = [];

      qSnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListing((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="offer-wrapper">
        <h1 className="fw-bold">Offers</h1>
        <div className="listingOffers">
          {loading ? (
            <Loading />
          ) : listings && listings.length > 0 ? (
            <>
              {listings.map((list) => (
                <ListingItem
                  key={list.id}
                  list={list}
                  id={list.id}
                  onDelete={false}
                  onUpdate={false}
                />
              ))}

              {LastfetchListing && (
                <button
                  className="btn btn-primary load__more-btn"
                  onClick={onLoadMore}
                >
                  Load more
                </button>
              )}
            </>
          ) : (
            <h1>no listing yet</h1>
          )}
        </div>
      </div>
    </>
  );
}

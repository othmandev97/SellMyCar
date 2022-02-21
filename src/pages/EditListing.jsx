import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
// icons
import { BsFillImageFill } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
// firebase auth
import { getAuth, onAuthStateChanged } from "firebase/auth";
// storage firebase
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  list,
} from "firebase/storage";
// save to firebase / firestre
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
// random id
import { v4 as uuidv4 } from "uuid";
//toaster
import { toast } from "react-toastify";
// routes
import { useNavigate, useParams } from "react-router-dom";
//map leaflet
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

export default function EditListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [UploadedImages, setUploadedImages] = useState(null);
  const uploadedImagesArray = [];
  const fileObj = [];
  const [Loading, setLoading] = useState(false);
  const [PriceState, setPriceState] = useState(true);
  const [GeoLocation, setGeoLocation] = useState(true);
  const ListingId = useParams();
  // position
  const [position, setPosition] = useState(null);

  //
  const [formData, setformData] = useState(null);

  const [ListingData, setListingData] = useState({
    Title: "",
    Brand: "",
    Price: 0,
    DiscountedPrice: 0,
    Images: {},
    Mileage: 0,
    Model: "",
    ModelYear: "",
    NumberDoors: 0,
    Offer: false,
    State: "new",
    Type: "new",
    Address: "",
    latitude: 0,
    longitude: 0,
  });

  const {
    Title,
    Brand,
    Price,
    DiscountedPrice,
    Images,
    Mileage,
    Model,
    ModelYear,
    NumberDoors,
    Offer,
    State,
    Type,
    Address,
    latitude,
    longitude,
  } = ListingData;

  //redirect if user not logged in
  useEffect(() => {
    if (ListingData.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this listing");
      // navigate("/");
    }

    // console.log("1" + ListingData.userRef);
    // console.log("2" + auth.currentUser.uid);
  });
  useEffect(() => {
    //
    // console.log(ListingId.itemid);
    const fetchLisitingItem = async () => {
      const docRef = doc(db, "listing", ListingId.itemid);
      const snapDoc = await getDoc(docRef);

      if (snapDoc.exists()) {
        console.log(snapDoc.data());
        setListingData(snapDoc.data());
      } else {
        console.log("no document found");
      }
    };

    fetchLisitingItem();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    //check for images
    if (e.target.files) {
      toast.error("the max images is 5");
    }
    // store images in firebase / storage
    const StoreImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, "images/" + filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;
              // ...
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    //

    if (e.target.files) {
      const imageUrls = await Promise.all(
        [...Images].map((image) => {
          StoreImage(image);
        })
      ).catch(() => {
        toast.error("images not uploaded");
        return;
      });
    }
    // console.log(imageUrls);

    // upload to firestore
    //copy of the date

    const CopyListingData = {
      ...ListingData,
      // imageUrls: imageUrls,
      timestamp: serverTimestamp(),
    };

    delete CopyListingData.Images;

    // console.log(CopyListingData);
    // console.log(ListingData);

    // update the data
    const docRef = await updateDoc(
      doc(db, "listing", ListingId.itemid),
      CopyListingData
    );
    toast.success("listing updated succesfully");
    navigate(`/`);
  };

  const OnChangeoffer = () => {
    setPriceState(!PriceState);
  };

  const onChange = (e) => {
    // file images
    if (e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        Images: e.target.files,
      }));
    }
    //inputs
    if (!e.target.files) {
      setListingData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const onUploadImaged = (e) => {
    fileObj.push(e.target.files);
    for (let i = 0; i < fileObj[0].length; i++) {
      uploadedImagesArray.push(URL.createObjectURL(fileObj[0][i]));
    }
    setUploadedImages(uploadedImagesArray);
    console.log(UploadedImages);
    console.log(uploadedImagesArray);
  };

  const onRemoveUploadImages = (e) => {
    // setUploadedImages();
    console.log(e.target.id);
    // uploadedImagesArray.splice(e.target.id, 1);
    console.log("array =" + uploadedImagesArray);
    console.log("imgages state =" + Images);
  };

  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <div className="editlisting__wrapper">
      <h1 className="fw-bold">Edit </h1>
      <div className="addListingpage__wrapper--card">
        <form onSubmit={onSubmit} className="form-group">
          <div className="mb-3  ">
            <label htmlFor="">
              Listing Title <span className="required__red">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="Title"
              onChange={onChange}
              value={Title}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Brand <span className="required__red">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="Brand"
              onChange={onChange}
              value={Brand}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Model <span className="required__red">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="Model"
              onChange={onChange}
              value={Model}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Model Year <span className="required__red">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="ModelYear"
              onChange={onChange}
              value={ModelYear}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Mileage <span className="required__red">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="Mileage"
              placeholder="0,000 - 0,000"
              onChange={onChange}
              value={Mileage}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Number of doors <span className="required__red">*</span>
            </label>
            <select
              name=""
              id="NumberDoors"
              className="form-control"
              onChange={onChange}
              value={NumberDoors}
            >
              <option value="2">2</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Offer <span className="required__red">*</span>
            </label>
            {/* <input type="text" className="form-control" /> */}
            <select
              name=""
              id="Offer"
              className="form-control"
              onChange={(e) => {
                onChange(e);
                OnChangeoffer(e);
              }}
              value={Offer}
              // onChange={onChange}
              // value={Price}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Price (USD)<span className="required__red">*</span>
            </label>
            <input
              type="text"
              id="Price"
              className="form-control"
              onChange={onChange}
              value={Price}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Discounted Price <span className="required__red">*</span>
            </label>
            <input
              type="text"
              id="DiscountedPrice"
              className="form-control"
              disabled={PriceState}
              onChange={onChange}
              value={DiscountedPrice}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              State <span className="required__red">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="State"
              onChange={onChange}
              value={State}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Type <span className="required__red">*</span>
            </label>
            <select
              name=""
              id="Type"
              className="form-control"
              onChange={onChange}
              value={Type}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
          </div>
          <div className="mb-3  ">
            <label htmlFor="Images" className="custom__fileImage">
              <span>
                <BsFillImageFill />
                Add images
              </span>
            </label>

            <div className="uploadedImages__wrapper">
              {/* <img src={uploadedImagesArray}></img> */}
              {(UploadedImages || []).map((url, index) => (
                <>
                  <div className="uploadedImages">
                    <div className="uploadedImages--overlay"></div>
                    <img src={url} alt="" />
                    <BsXCircle onClick={onRemoveUploadImages} id={index} />
                  </div>
                </>
              ))}
            </div>
            <input
              type="file"
              max="6"
              id="Images"
              accept=".jpg,.png,.jpeg"
              multiple
              className="form-control"
              onChange={(e) => {
                onUploadImaged(e);
                onChange(e);
              }}
            />
          </div>
          <div className="mb-3  ">
            <label htmlFor="">
              Adress <span className="required__red">*</span>
            </label>
            <input
              type="text"
              id="Address"
              required
              className="form-control"
              onChange={onChange}
              value={Address}
            />
          </div>

          {/* <div id="map">
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={{ lat: 51.505, lng: -0.09 }}
              zoom={13}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
          </div> */}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Edit listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

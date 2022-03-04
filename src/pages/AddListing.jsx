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
} from "firebase/storage";
// save to firebase / firestre
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

// random id
import { v4 as uuidv4 } from "uuid";
// routes
import { useNavigate } from "react-router-dom";
//loader
import { Loading } from "../components/Loading";

//toaster
import { toast } from "react-toastify";

//map leaflet
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
// map default latitude longitude
const center = {
  lat: 51.505,
  lng: -0.09,
};

export const AddListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [UploadedImages, setUploadedImages] = useState(null);
  const uploadedImagesArray = [];
  const fileObj = [];
  const [Loading, setLoading] = useState(false);
  const [PriceState, setPriceState] = useState(true);
  const [GeoLocation, setGeoLocation] = useState(true);
  const [ImagesUrlToupload, setImagesUrlToupload] = useState(null);
  let arrayimg = [];
  const [value, setValue] = useState([]);
  // position
  const [position, setPosition] = useState(null);

  // let imagesnew = [];
  const [ListingData, setListingData] = useState({
    Title: "",
    Brand: "",
    Price: 0,
    DiscountedPrice: 0,
    Images: [],
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

  useState(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setListingData({ ...ListingData, userRef: user.uid });
      } else {
        navigate("/signin");
      }
    });
  }, []);

  useEffect(() => {
    if (position) {
      setListingData((prevState) => ({
        ...prevState,
        latitude: position.lat,
        longitude: position.lng,
      }));
    }
  }, [position]);

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
            // switch (error.code) {
            //   case "storage/unauthorized":
            //     // User doesn't have permission to access the object
            //     break;
            //   case "storage/canceled":
            //     // User canceled the upload
            //     break;
            //   // ...
            //   case "storage/unknown":
            //     // Unknown error occurred, inspect error.serverResponse
            //     break;
            // }
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

    const imageUrls = await Promise.all(
      [...Images].map((image) => StoreImage(image))
    ).catch(() => {
      toast.error("images not uploaded");
      return;
    });

    // console.log(imageUrls);
    // upload to firestore
    //copy of the date

    // const CopyListingData = {
    //   ...ListingData,
    //   imageUrls: imageUrls,
    //   timestamp: serverTimestamp(),
    // };

    // delete CopyListingData.Images;

    // const docRef = await addDoc(collection(db, "listing"), CopyListingData);
    // toast.success("listing added succesfully");
    // navigate(`/profile`);

    // return imageUrls;
    awaitforimages(imageUrls);
  };

  const awaitforimages = async (imageUrls) => {
    const CopyListingData = {
      ...ListingData,
      imageUrls: imageUrls,
      timestamp: serverTimestamp(),
    };

    delete CopyListingData.Images;

    const docRef = await addDoc(collection(db, "listing"), CopyListingData);
    toast.success("listing added succesfully");
    navigate(`/profile`);
  };

  const OnChangeoffer = () => {
    setPriceState(!PriceState);
  };

  const onChange = (e) => {
    //file images
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
    // uploadedImagesArray.push(URL.createObjectURL(e.target.files[0]));
    // console.log(UploadedImages);
    // console.log(uploadedImagesArray);
  };

  const onRemoveUploadImages = (e) => {
    // setUploadedImages();
    console.log(e.target.id);
    // uploadedImagesArray.splice(e.target.id, 1);
    console.log("array =" + uploadedImagesArray);
    console.log("imgages state =" + Images);
  };

  function LocationMarker() {
    // const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    // if (position) {
    //   setListingData((prevState) => ({
    //     ...prevState,
    //     latitude: position.lat,
    //     longitude: position.lng,
    //   }));
    // }

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  // function DraggableMarker() {
  //   const [draggable, setDraggable] = useState(false);
  //   const [position, setPosition] = useState(center);
  //   const markerRef = useRef(null);
  //   const eventHandlers = useMemo(
  //     () => ({
  //       dragend() {
  //         const marker = markerRef.current;
  //         if (marker != null) {
  //           setPosition(marker.getLatLng());
  //           // console.log("seconds ==" + marker.getLatLng().lat);
  //           setListingData((prevState) => ({
  //             ...prevState,
  //             latitude: marker.getLatLng().lat,
  //             longtitude: marker.getLatLng().lng,
  //           }));
  //         }
  //       },
  //     }),
  //     []
  //   );
  //   const toggleDraggable = useCallback(() => {
  //     setDraggable((d) => !d);
  //   }, []);

  //   // console.log("second ==" + position);

  //   return (
  //     <Marker
  //       draggable={draggable}
  //       eventHandlers={eventHandlers}
  //       position={position}
  //       ref={markerRef}
  //     >
  //       <Popup minWidth={90}>
  //         <span onClick={toggleDraggable}>
  //           {draggable
  //             ? "Marker is draggable"
  //             : "Click here to make marker draggable"}
  //         </span>
  //       </Popup>
  //     </Marker>
  //   );
  // }

  if (Loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="addListingpage__wrapper">
        <h1 className="addListingpage__wrapper--heading fw-bold">
          add listing
        </h1>
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
                  <div className="uploadedImages" key={index}>
                    <div className="uploadedImages--overlay"></div>
                    <img src={url} alt="" />
                    <BsXCircle onClick={onRemoveUploadImages} id={index} />
                  </div>
                ))}
              </div>
              <input
                type="file"
                max="6"
                id="Images"
                accept=".jpg,.png,.jpeg"
                multiple
                required
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

            <div id="map">
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
                {/* <DraggableMarker /> */}
              </MapContainer>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                add listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

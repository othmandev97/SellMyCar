import React from "react";
import { Link } from "react-router-dom";

//icons
import { BsFillTrashFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

export const ListingItem = ({ list, id, onDelete, onUpdate }) => {
  // const date = new Date(list.data.ModelYear.toDate());

  // var timestamp = list.data.ModelYear.toMillis();
  // const date = new Date(timestamp * 1000);
  // const datevalues = [
  //   date.getFullYear(),
  //   date.getMonth() + 1,
  //   date.getDate(),
  //   date.getHours(),
  //   date.getMinutes(),
  //   date.getSeconds(),
  // ];

  // console.log(list.data);
  return (
    <div className="listingOffers--item">
      <div className="listingOffers--item--img">
        <img src={list.data.Images} alt={list.data.Brand} />
      </div>
      <div className="listingOffers--item--info">
        <div className="listingOffers--item--info--header">
          <h3>{list.data.Title}</h3>
          <p>Brand : {list.data.Brand}</p>
          <p>Mileage : {list.data.Mileage}</p>
        </div>
        <div className="listingOffers--item--info--body">
          <p>model:{list.data.ModelYear.toString()}</p>
          <p>type:{list.data.Type}</p>
        </div>
      </div>
      <div className="listingOffers--item--link">
        <div className="listingOffers--item--link--info">
          <span>Price :</span>
          <p>$ {list.data.Price}</p>
        </div>
        <div className="listingOffers--item--link--event">
          <Link className="btn btn-primary" to={`/listing/${id}`}>
            See Lesting
          </Link>

          <div className="listingOffers--item--link--event--button-group">
            {onDelete && (
              <>
                <button className="btn btn-danger" onClick={() => onDelete(id)}>
                  <BsFillTrashFill />
                </button>
              </>
            )}

            {onUpdate && (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => onUpdate(id)}
                >
                  <BiEdit />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

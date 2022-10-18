import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import  jwt_decode  from "jwt-decode";
import Swal from "sweetalert2";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";






function RestaurantPage() {
  let [tab, setTab] = useState(1);
  let { id } = useParams();

  let defaultValue = {
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "restaurant-background.png",
    locality: "",
    location_id: -1,
    mealtype_id: -1,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: -1,
  };
  let [restaurant, setRestaurant] = useState({ ...defaultValue });
  let [menuItems, setMenuItems] = useState([]);
  let [totalPrices, setTotalPrices] = useState(0);

  let   getTOkenDetails = () => {
    //read a data  from localstorage
 let token =   localStorage.getItem('auth-token');
 if(token === null) {
   return false;
 } else {
   return jwt_decode(token);
 }
}


let [userDetails, setUserDetails] = useState( getTOkenDetails);



  let getRestaurantDetails = async () => {
    try {
      let URL = 'https://zomatoclonenodejs.herokuapp.com/api/getRestaurantDetailsById/' + id;
      let { data } = await axios.get(URL);

      if (data.status === true) {
        setRestaurant({ ...data.result });
      } else {
        setRestaurant({ ...defaultValue });
      }
    } catch (error) {
      alert("server error");
    }
  };
  let getMenuItems = async () => {
    try {
      let URL = `https://zomatoclonenodejs.herokuapp.com/api/getMenuItemListByRestaurantId/${id}`;
      let { data } = await axios.get(URL);
      if (data.status === true) {
        setMenuItems([...data.result]);
      } else {
        setMenuItems([]);
      }
      setTotalPrices(0);
    } catch (error) {
      alert("server error");
    }
  };

  let addItemQuantity = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty += 1;

    let _price = Number(_menuItems[index].price);
    setTotalPrices(totalPrices + _price); // updating TotalPrices State
    setMenuItems(_menuItems); // updating menuItem State
  };

  let removeItemQuantity = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty -= 1;

    let _price = Number(_menuItems[index].price);
    setTotalPrices(totalPrices - _price); // updating TotalPrices State
    setMenuItems(_menuItems); // updating menuItem State
  };

  async function loadScript() { //used for runtime
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }

  let displayRazorpay = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("sdk is not loaded");
      return false;
    }
    var serverData = {
       amount : totalPrices,

    };
    var { data } = await axios.post(
      "https://zomatoclonenodejs.herokuapp.com/api/payment/genOrder",
      serverData
    );
    console.log(data);
    var order = data.order;
    var options = {
      key: "rzp_test_KvxHzp17jmYyxR", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato Clone payment",
      description: "Buying a product from zomato",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQLubDHfo9Ind7y2jagRMxlmInf430YRGoDi4ILqVu&s",
      order_id: order.id, //order is is generated server side
      handler: async function (response) {
        var sendData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        var { data } = await axios.post(
          "https://zomatoclonenodejs.herokuapp.com/api/payment/verify",
          sendData
        );
       if (data.status === true)  {
        Swal.fire({
          icon: 'success',
          title: 'Ordered Places Succesfully',
          text: 'Thanks for Buying.....Visit Again',
        }).then( () => {
          window.location.replace("/");
        });
       } else {
        Swal.fire({
          icon: 'warning',
          title: 'Payment Failed',
          text: 'Re-try Again',
        });
       }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "123456789",
      },
    };

    var razorpayObject = window.Razorpay(options);
    razorpayObject.open(); //to start operation
  };

  useEffect(() => {
    getRestaurantDetails();
  }, []);
  return (
    <>
        <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {restaurant.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
       
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItems.map((menu_item, index) => {
                return (
                  <div className="row p-2" key={index}>
                    <div className="col-8 ">
                      <p className="mb-1 h6">{menu_item.name}</p>
                      <p className="mb-1">@{menu_item.price}</p>
                      <p className="small text-muted">
                        {menu_item.description}
                      </p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menu_item.image} alt="" />
                        {menu_item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItemQuantity(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeItemQuantity(index)}
                            >
                              -
                            </span>
                            <span>{menu_item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addItemQuantity(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
                );
              })}
              {totalPrices > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Subtotal {totalPrices}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#exampleModalToggle2"
                    data-bs-toggle="modal"
                  >
                    Pay Now
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter User Name"
                  value={userDetails.name}
                  readOnly ={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={userDetails.email}
                  placeholder="eg.name@example.com"
                  readOnly ={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value="@ INDIA"
                  onChange={() => {}}
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-between p-2 mb-3">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Go Back
              </button>
              <button className="btn btn-success" 
                    onClick={displayRazorpay}>
                     Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header color="bg-danger" />
      <section className="row justify-content-center">
        <section className="col-11 mt-2 restaurant-main-image position-relative">
          <img src={"/images/" + restaurant.image} alt="" />
          <button 
            className="btn-gallery position-absolute btn"
            data-bs-toggle="modal"
            data-bs-target ="#slideShow"
          >
            Click to see Image Gallery
          </button>
        </section>
        <section className="col-11">
          <h2 className="mt-3">{restaurant.name}</h2>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="list-unstyled d-flex gap-3 fw-bold">
              <li className="pb-2 hand" onClick={() => setTab(1)}>
                Overview
              </li>
              <li className="pb-2 hand" onClick={() => setTab(2)}>
                Contact
              </li>
            </ul>
            { userDetails ? (
            <button
              data-bs-toggle="modal"
              href="#exampleModalToggle"
              role="button"
              className="btn btn-danger"
              onClick={getMenuItems}
            >
              Place Online Order
            </button>
            ) : <button className="btn btn-info" disabled ={true}>Please Login to Place order</button> }
          </div>
          {tab === 1 ? (
            <section>
              <h4 className="mb-3">About this place</h4>
              <p className="m-0 fw-bold">Cuisine</p>
              <p className="mb-3 text-muted small">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pValue, cValue) => {
                      return pValue.name + ", " + cValue.name;
                    })
                  : null}
              </p>

              <p className="m-0 fw-bold">Average Cost</p>
              <p className="mb-3 text-muted small">
                ₹{restaurant.min_price} for two people (approx.)
              </p>
            </section>
          ) : (
            <section>
              <h4 className="mb-3">Contact</h4>
              <p className="m-0 fw-bold">Phone Number</p>
              <p className="mb-3 text-danger small ">
                +{restaurant.contact_number}
              </p>

              <p className="m-0 fw-bold">{restaurant.name}</p>
              <p className="mb-3 text-muted small">
                {restaurant.locality},{restaurant.city}
              </p>
            </section>
          )}
        </section>
      </section>
    </>
  );
}

export default RestaurantPage;
  
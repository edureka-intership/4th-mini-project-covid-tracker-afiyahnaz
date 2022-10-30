import React from "react";
import axios from  "axios";
import { useEffect, useState, useRef } from "react";
import Header from "../Header";

function Wallpaper() {

  let selectInput =  useRef();  //it will give a element reference
  let [locationList, setLocationList]  = useState([]);
  let [disabled, setDisabled]   = useState(true);
  
  let   getLocationList  = async  () =>{
  try{
      let response = await   axios.get("https://zomatoclonenodejs1.herokuapp.com/api/getLocation");
      let data = response.data;
      if (data.status === true ) {
           setLocationList([...data.result])
      } else {
        setLocationList([]);
      }
    }  catch (error) {
      console.log(error);
      alert("server error");
    }      
  };
  
  let  getLocationId =  async (event) =>{
        let value = event.target.value;
        if(value !== "") {
          try{
            let  url =`https://zomatoclonenodejs1.herokuapp.com/api/getRestaurantByLocationId/${value}`;
            let { data } =  await  axios.get(url);
            if(data.status === true){
              if(data.result.length === 0) {
                  setDisabled(true)
              }  else {
                setDisabled(false);

              }
            }
          } catch (error) {
              console.log(error);
              alert("server side error");
          }

        }
  };
  useEffect(() => {
    getLocationList();
  }, []); // [ ]===>  why using array to excutive only once
  return (
    <>
     
                
      <section className="row main-section align-content-start">
        <div className="col-12">
              <Header  color=""/>
        </div>
      
        <section className="col-12 d-flex flex-column align-items-center justify-content-center">
          <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
          <p className="h1 text-white my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
          <div className="search w-50 d-flex mt-3">
            <select 
               ref = {selectInput}
               className="form-control mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
               onChange = {getLocationId}
               >
               
                  <option  value = "">Please select a location</option>
                  {
                    locationList.map((location, index) => {
                      return (
                       <option value = {location.location_id} key = {index}>
                        {location.name}, {location.city}
                        </option>
                      );
                    })
                  }
             </select>

            <div className="w-75 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search for restaurants"
                disabled = {disabled}
              />
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Wallpaper;

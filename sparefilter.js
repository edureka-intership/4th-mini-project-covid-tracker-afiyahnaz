import React from "react";
import FilterPagination from "./FilterPagination";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


function SearchPageResult() {
  let params = useParams(); //{...}
  let navigate = useNavigate();
  let [searchList, setSearchList] = useState([]);
  let [restaurantList, setRestaurantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({});
  let [pageCount, setPageCount] = useState(0);


  let   getLocationList  = async  () =>{
    try{
        let URL = await   axios.get("https://zomatoclonenodejs1.herokuapp.com/api/getLocation");
        let response = await axios.get(URL);
        let { status, location } = response.data;
        if (status ) {
             setLocationList([...location])
        } else {
          alert("Looks like Input is missing");
         
        }
      }  catch (error) {
        alert(error);
      }      
    };

    useEffect(() => {
      getLocationList();
    }, []);

  let filterOperation = async (_filter) => {
     _filter = { _filter };
    let URL = "https://zomatoclonenodejs1.herokuapp.com/api/filter";
   
    if (searchParams.get("meal_type")) {
      _filter["mealtype"] = searchParams.get("mealType");
    }
    try {
      let response = await axios.post(URL, _filter);
      let { result, pageCount } = response?.data;
      setSearchList(...[result]);
      setPageCount(pageCount);
    } catch (error) {
      alert(error);
    }
  };

  let makeFiltration = (event, type) => {
    let { value } = event.target;
    let _filter = {};
    switch (type) {
      case "location":
        _filter["location"] = value;
        break;

      case "sort":
        _filter["sort"] = value;
        break;

      case "cuisine":
        let checked = event.target.checked;
        // console.log(checked);

        let cuisine =
          filter.cuisine = undefined ? [] : [...filter.cuisine];
        if (checked) {
          let isAvailable = cuisine.includes(Number(value));
          if (isAvailable === false) cuisine.push(Number(value));
        } else {
          let position = cuisine.indexOf(Number(value));
          cuisine.splice(position, 1);
        }
        if (cuisine.length > 0) {
          _filter["cuisine"] = cuisine;
        }
        break;

        case "cost":
          let cost = value.split("-");
          _filter["lcost"] = cost[0];
          _filter["hcost"] = cost[1];
          break;
        case "page":
          _filter["page"] = value;
          break;
        default:
          break;
    
    
    
    
      }


    // console.log(_filter);
    setFilter({ ..._filter, ..._filter });
    filterOperation(_filter);
  };

  useEffect(() => {
    filterOperation(filter);
   
  }, [filter]);
  return (
    <>
      <div className="row">
        <div className="col-12 px-5 pt-4">
          <p className="h3">Breakfast Places In Mumbai</p>
        </div>
        {/* <!-- food item --> */}
        <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
          <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
            <div className="d-flex justify-content-between">
              <p className="fw-bold m-0">Filters</p>
              <button
                className="d-lg-none d-md-none btn"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilter"
                aria-controls="collapseFilter"
              >
                <span className="fa fa-eye"></span>
              </button>
            </div>
            {/* <!-- Collapse start  --> */}
            <div className="collapse show" id="collapseFilter">
              <div>
                <label htmlFor="" className="form-label">
                  Select Location
                </label>
                <select
                  className="form-select form-select-sm"
                  onChange={(event) => makeFiltration(event, "location")}
                >
                  <option value="-1">--- select a Location ---</option>
                  {locationList.map((location, index) => {
                    return (
                      <option value={location.location_id} key={index}>
                        {location.name}, {location.city}
                      </option>
                    );
                  })}
                </select>
              </div>
                {/* ////////////////////////////////////////// */}
                 {/* Cuisine*/}
                  {/* ////////////////////////////////////////// */}
              <p className="mt-4 mb-2 fw-bold">Cuisine</p>
              <div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    id="north"
                    value="1"
                    onChange={(event) => makeFiltration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    North Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    id="north"
                    value="2"
                    onChange={(event) => makeFiltration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1" checked>
                    South Indian
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    id="north"
                    value="Chinese"
                    onChange={(event) => makeFiltration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1" checked>
                    Chinese
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="cuisine"
                    id="north"
                    value="3"
                    onChange={(event) => makeFiltration(event, "cuisine")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Fast Food
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="north"
                    value="4"
                    onChange={(event) => makeFiltration(event, "cuisine")}
                   
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Street Food
                  </label>
                </div>
              </div>
                 {/* ////////////////////////////////////////// */}
                {/* COST FOR TWO */}
                 {/* ////////////////////////////////////////// */}
              <p className="mt-4 mb-2 fw-bold">Cost For Two</p>
              <div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cost-for-two"
                    value="0-500"
                    id="0-500"
                    onChange={(event) => makeFiltration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    less then 500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cost-for-two"
                    value="500-1000"
                    id="500-1000"
                    onChange={(event) => makeFiltration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    500 to 1000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cost-for-two"
                    value="1000-1500"
                    id="1000-1500"
                    onChange={(event) => makeFiltration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                     &#8377;1000 to &#8377; 1500
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cost-for-two"
                    value="1500-2000"
                    id="1500-2000"
                    onChange={(event) => makeFiltration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    1500 to 2000
                  </label>
                </div>
                <div className="ms-1">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="cost-for-two"
                    value="2000-999999"
                    id="2000-999999"
                    onChange={(event) => makeFiltration(event, "cost-for-two")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    &#8377;2000
                  </label>
                </div>
              </div>
                  {/* ////////////////////////////////////////// */}
                  {/* SORT*/}
                  {/* ////////////////////////////////////////// */}
              <p className="mt-4 mb-2 fw-bold">Sort</p>
              <div>
                <div className="ms-1 form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="sort"
                    id="low-high"
                    value="1"
                    onChange={(event) => makeFiltration(event, "sort")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price low to high
                  </label>
                </div>
                <div className="ms-1 form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="sort"
                    id="high-low"
                    value="-1"
                    onChange={(event) => makeFiltration(event, "sort")}
                  />
                  <label htmlFor="" className="form-check-label ms-1">
                    Price high to low
                  </label>
                </div>
              </div>
            </div>
            {/* <!-- Collapse end --> */}
          </div>
          {/* <!-- search result --> */}
          <div className="col-12 col-lg-8 col-md-7">
            {restaurantList.map((restaurant, index) => {
              return (
                <div className="col-12 food-shadow p-4 mb-4" key={index}  
                onClick = {() => navigate("/restaurant/" + restaurant._id )}
                 > 
                  <div className="d-flex align-items-center">
                    <img
                      src={"/images/"+ restaurant.image }
                      className="food-item"
                    />
                    <div className="ms-5">
                      <p className="h4 fw-bold">{restaurant.name}</p>
                      <span className="fw-bold text-muted">
                        {restaurant.city}
                      </span>
                      <p className="m-0 text-muted">
                        <i
                          className="fa fa-map-marker fa-2x text-danger"
                          aria-hidden="true"
                        ></i>
                        {restaurant.locality}, {restaurant.city}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div>
                      <p className="m-0">CUISINES:</p>
                      <p className="m-0">COST FOR TWO:</p>
                    </div>
                    <div className="ms-5">
                      <p className="m-0 fw-bold">
                        {restaurant.cuisine.reduce((pValue, cValue) => {
                          return pValue.name + ", " + cValue.name;
                        })}
                      </p>
                      <p className="m-0 fw-bold">
                        <i className="fa fa-inr" aria-hidden="true"></i>
                        {restaurant.minPrice}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
             <div className="col-12 pagination d-flex justify-content-center">
              <ul className="pages">
                <li>&lt;</li>
                <li className="active">1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>&gt;</li>
              </ul>
            </div> 
             {/* <div>
                <FilterPagination
                  filterData={makeFiltration}
                  pageCount={pageCount}
                />
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPageResult;
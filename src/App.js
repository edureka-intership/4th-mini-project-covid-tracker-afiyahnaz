import Mainhomepage from "./components/home/Mainhomepage";
import Mainhsearchpage from "./components/search/Mainsearchpage";
import { Routes, Route } from "react-router-dom";
import RestaurantPage from "./components/restaurant/RestaurantPage";

function App() {
  return (
    <>
      <main className="container-fluid">
       <Routes>
            <Route path = "/" element = {  <Mainhomepage />} />
            <Route path = "/searchPage/:meal_Id" element = {  <Mainhsearchpage/>} />
            <Route path = "/restaurant/:id" element = {<RestaurantPage/>} />
        </Routes>
       
      </main>
    </>
  );
}

export default App;


//    https://zomatoclonereactjs.herokuapp.com

// https://sage-bunny-62e6ad.netlify.app



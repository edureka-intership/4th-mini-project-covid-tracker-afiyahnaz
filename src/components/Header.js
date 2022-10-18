import { GoogleOAuthProvider,  GoogleLogin } from '@react-oauth/google';
import {useNavigate} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import {useState}  from 'react';
import Swal from 'sweetalert2';




function Header(props) {

    let  navigate = useNavigate();

    let   getTOkenDetails = () => {
           //read a data  from localstorage
        let token =   localStorage.getItem('auth-token');
        if(token === null) {
          return false;
        } else {
          return jwt_decode(token);
        }
    }


    let [userLogin, setUserLogin] = useState( getTOkenDetails);
   
    let onsuccess = (credentialResponse) => {
      let token = credentialResponse.credential;
     
      // save the data
      localStorage.setItem("auth-token", token);
      Swal.fire({
        icon: 'success',
        title: 'Loged in  Succesfully',
        text: 'welcome to Zomato-clone',
      }).then( () => {
        window.location.reload();
      })
    };

    let onError = () => {
      Swal.fire({
        icon: 'error',
        title: 'Opps Login Failed..................',
        text: 'please try again',
      });
    };
    console.log(userLogin);
     let logOut = () => {

      Swal.fire({
        title: 'Are you sure you want to logout?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, LogOut me!'
      }).then((result) => {
        if (result.isConfirmed) {
           //remove token from local storage
           //removeItem
        localStorage.removeItem("auth-token");
        window.location.reload();
        }
      })
     };

    return (
      <>

     <GoogleOAuthProvider clientId="586235440455-7esd81dskqcnntqpibv06jkti5fonkku.apps.googleusercontent.com">
<div className="modal fade" id="google-sign-in" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Google Sign-in</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <GoogleLogin  onSuccess = { onsuccess} onError  = { onError }/>;
        </div>
      </div>
  </div>
</div>
        <div className={"row  justify-content-center" + props.color}>
          <div className="col-10 d-flex justify-content-between py-2">
            <p className="m-0 brand hand" onClick={() => navigate("/")}>e!</p>

            {
               userLogin ? ( <div>
               <span className="text-info fw-bold  fs-25 me-5">Welcome, {userLogin.given_name}</span>
              <button className="btn btn-outline-light" onClick={logOut}>
                <i className="fa fa-exit" aria-hidden="true"></i>Logout
               
              </button>

          </div>
        ) : ( <div>
               <button 
                  className="btn text-white" 
                  data-bs-toggle="modal" 
                  data-bs-target="#google-sign-in" 
                >
                  Login
            </button>
              <button className="btn btn-outline-light">
                <i className="fa fa-search" aria-hidden="true"></i>Create a
                Account
              </button>
            </div>
         )}
    
          </div>
        </div>
      </GoogleOAuthProvider>
      </>  
    );
  }
  
  
  export default Header;
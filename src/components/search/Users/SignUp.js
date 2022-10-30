import React from "react";
import { GoogleLogin } from "@react-oauth/google";
function SignUp({ success, error }) {
  return (
    <>
      <div
        className="modal fade"
        id="sign-up"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="sign-up-title">
                SignUp
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12 d-flex flex-column align-items-center py-3">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      success(credentialResponse);
                    }}
                    onError={() => {
                      error();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
// react-toastify
import { toast } from "react-toastify";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      // Password reset email sent!
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset sent!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="forgetpasword-wrapper">
      <h1>ForgetPassword</h1>

      <form onSubmit={onSubmit} className="form-group">
        <div className="mb-3">
          <div className="col-sm-12">
            <label htmlFor="email">Enter Your Email</label>
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email*"
              id="email"
              value={email}
              onChange={onChange}
            />
          </div>
        </div>
        <button className="btn btn-primary">Reset Password</button>
      </form>
    </section>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";

function SignUpInputs({}) {
  return <input type="fname" name="fname" id="fname" required=""
  className="w-full p-2 text-sm rounded-[10px] border-gray-500 border mr-3" placeholder="First Name" />
}

function SignUp() {
  const inputStyle = "w-full p-2 text-sm rounded-[10px] border-gray-500 border";
  let [signUpForm, setSignUpForm] = useState({
    fname: "",
    lname: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setSignUpForm({
      ...signUpForm,
      [name]: value,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-5xl font-bold text-transparent bg-gradient-to-br from-[#001233] to-[#979DAC] bg-clip-text">
        1 on 1
      </h1>
      <div className="w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Sign up</h2>
        <form action="contacts.html" className="space-y-4">
          <div className="flex">
            <input onChange={handleChange} type="fname" name="fname" id="fname" required="" className={inputStyle + " mr-3"} placeholder="First Name" />
            <input onChange={handleChange} type="lname" name="lname" id="lname" required="" className={inputStyle} placeholder="Last Name" />
          </div>
          <input onChange={handleChange} type="email" name="email" id="email" required="" className={inputStyle} placeholder="Email Address" />
          <input onChange={handleChange} type="password" name="password" id="password" required="" className={inputStyle} placeholder="Password" />
          <button type="submit" className="w-full px-5 py-3 bg-green-3 text-white rounded-[10px]">Register</button>
        </form>
        <p className="text-sm font-medium text-center">
          Already have an account?
          <Link to="/signin" className="hover:underline text-green-3">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;

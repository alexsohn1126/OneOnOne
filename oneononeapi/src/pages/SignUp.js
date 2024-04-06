import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function InputField({ onChange, type, name, error, placeholder, extraStyle}) {
  const inputStyle = "w-full p-2 text-sm rounded-[10px] border-gray-500 border";
  return (<div>
    <input onChange={onChange} type={type} name={name} id={name} required="" 
      className={[inputStyle, extraStyle, (error ? " border-red-600" : "")].join(' ')} placeholder={placeholder} />
    <p className={error ? "text-red-600" : ""}>{error}</p>
  </div>);
}

function SignUp() {
  const signUpAPI = "http://localhost:8000/api/accounts/signup/"
  const navigate = useNavigate();
  let [signUpForm, setSignUpForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    repeat_password: ""
  });

  let [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    repeat_password: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setSignUpForm({
      ...signUpForm,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch(signUpAPI, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpForm),
    }).then(async res => {
      // redirect to signin if account creation successful
      if (res.status == 201) {
        navigate("/signin");
        return;
      }
      let errors = await res.json();
      handleErrors(errors);
    });
  }

  function handleErrors(e) {
    let newErrors = {}
    for (const errorElement in errors) {
      // if an element is in returned error object, change it to show error
      // otherwise reset to empty string
      if (errorElement in e){
        newErrors[errorElement] = e[errorElement][0];
      } else {
        newErrors[errorElement] = "";
      }
    }
    setErrors(newErrors);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <h1 className="text-5xl font-bold text-transparent bg-gradient-to-br from-[#001233] to-[#979DAC] bg-clip-text">
        1 on 1
      </h1>
      <div className="w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">Sign up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField onChange={handleChange} name="first_name" error={errors.first_name} placeholder="First Name"/>
          <InputField onChange={handleChange} name="last_name" error={errors.last_name} placeholder="Last Name"/>
          <InputField onChange={handleChange} type="email" name="email" error={errors.email} placeholder="Email Address"/>
          <InputField onChange={handleChange} name="username" error={errors.username} placeholder="Username"/>
          <InputField onChange={handleChange} type="password" name="password" error={errors.password} placeholder="Password"/>
          <InputField onChange={handleChange} type="password" name="repeat_password" error={errors.repeat_password} placeholder="Repeat Password"/>
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

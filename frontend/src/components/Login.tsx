import "../styles/Login.css"
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
    

const navigate = useNavigate();

type RegisterFormData = {
      username: string;
      password: string;
     
    };

    const [serverError, setServerError] = useState("");

    const {
    register,
    handleSubmit,
    formState: { errors }
    } = useForm<RegisterFormData>();


  const onSubmit = async (data: RegisterFormData) => {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });



    if (!response.ok) {
      setServerError("Username or Password is not correct");
    } else {
          const token_data = await response.json();
          const token = token_data.token;
          const resp = await fetch("http://127.0.0.1:5000/dashboard", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
          if(resp.ok) {
              localStorage.setItem("token", token);

               navigate("/dashboard");
          }
          else {
                
             navigate("/");

          }
          
    }
};
  return (
    <>
    <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      <div className="containter">
        <div className="left-side">
          <div className="left-side-top">
            <h1>Demo<em>Bank</em></h1>
            <p>Secure Banking for Everyone</p>
          </div>
          <div className="left-side-bottom">
            <div className="left-side-bottom-content">
              <div className="text-icon">
                <i className="ti ti-user-plus"></i>
                <p>Bank-grade security on every transaction</p>

              </div>

              <div className="text-icon">
                  <i className="ti ti-bolt"></i>
                  <p>Instant transfers between accounts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-side">
          <div className="right-side-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          <div className="sign-in-form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="label-input">
                 <label>Username</label>
                  <input {...register("username", { required: "Username is required" })} placeholder="John Smith"/>  
                    {errors.username && <span className="error-message">{errors.username.message}</span>}
                </div>

                <div className="label-input">
                 <label>Password</label>
                  <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      placeholder="••••••••"
                    />
                </div>
              {serverError && <span className="error-message">{serverError}</span>}
              <button className="sign-in-btn">Sign in</button>
              <p className="bottom-link">
              Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </form>
            
          </div>


        </div>

      </div>
    </>
  )
  
}
export default Login

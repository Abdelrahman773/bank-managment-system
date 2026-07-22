import "../styles/Register.css"
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {

    const navigate = useNavigate();

    type RegisterFormData = {
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      nationalId: string;
      dateOfBirth: string;
      phonenumber: string;
    };

    const [serverError, setServerError] = useState("");

    const {
    register,
    handleSubmit,
    formState: { errors }
    } = useForm<RegisterFormData>();

    const onSubmit = async (data: RegisterFormData) => {
         const response = await fetch("http://127.0.0.1:5000/register", {    
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
    });
    if (!response.ok) {
            setServerError("Username already exists!")
        }
        else {
              navigate("/");
        }
    }

    return(
    
      <div className="register-layout">
          <link rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
          <div className="register-panel-left">
            <div className="register-panel-left-top">
              <h1>Nile<em>Bank</em></h1>
              <p>Open your account in minutes</p>
            </div>
            <div className="register-panel-left-bottom">
              <div className="register-benefits">
                <div className="register-feature">
                <i className="ti ti-id-badge" aria-hidden="true"></i>                
                <p>National ID verification for security</p>
                </div>

                <div className="register-feature">
                    <i className="ti ti-clock" aria-hidden="true"></i>
                    <p>Account ready instantly after signup</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-panel-right">
            <div className="register-panel-right-header">
              <h1>Create your account</h1>
              <p>Fill your details to get started</p>
            </div>
            <div className="register-form">
              <form onSubmit={handleSubmit(onSubmit)}>
                  <p>Personal information</p>

                  <div className="register-field">
                  <label>Username</label>
                    <input {...register("username", { required: "Username is required" })} placeholder="John Smith"/>  
                    {errors.username && <span className="error-message">{errors.username.message}</span>}
                  </div>
            
                  <div className="register-field">
                  <label>First name</label>
                    <input {...register("firstName", { required: "First name is required" })} placeholder="John"/>   
                    {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                  </div>

                  <div className="register-field">
                  <label>Last name</label>
                    <input
                      {...register("lastName", { required: "Last name is required" })}
                      placeholder="Smith"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                  </div>

                  <div className="register-field">
                  <label>Email address</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address"
                        }
                      })}
                      placeholder="you@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>


                  <div className="register-field">
                  <label>Password</label>
                    <input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" }
                      })}
                      placeholder="••••••••"
                    />
                    {errors.password && <span className="error-message">{errors.password.message}</span>}
                  </div>

                  <div className="register-field">
                  <label>National ID</label>
                    <input 
                      {...register("nationalId", { required: "National ID is required",minLength: {value:14, message: "Please enter a valid National ID."}, maxLength: {
                      value: 14,
                      message: "National ID must be 14 digits"
                    },
                    pattern: {
                      value: /^\d+$/,
                      message: "National ID must contain only numbers"
                    }}
                  
                      )}
                      placeholder="30xxxx"
                    />
                    {errors.nationalId && <span className="error-message">{errors.nationalId.message}</span>}
                  </div>

                  <div className="register-field">
                  <label>Date of birth</label>
                    <input
                      type="date"
                      {...register("dateOfBirth", { required: "Date of birth is required" })}
                    />
                    {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth.message}</span>}
                  </div>

                  <div className="register-field">
                  <label>Phone number</label>
                    <input
                      {...register("phonenumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[0-9]{7,15}$/,
                          message: "Enter a valid phone number"
                        }
                      })}
                      placeholder="+20xxxxx"
                    />
                    {errors.phonenumber && <span className="error-message">{errors.phonenumber.message}</span>}
                  </div>
                {serverError && <span className="error-message">{serverError}</span>}
                <button className="register-submit">Create account</button>
                <p className="register-footer-link">
                Already have an account? <Link to="/">Sign in</Link>
                </p>
              </form>
              
            </div>


          </div>

      </div>

    
  );
  
}
export default Register
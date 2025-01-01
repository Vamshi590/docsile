import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import MainHead from "../components/MainHead";
import axios from "axios";
import googleicon from "../assets/googleicon.svg";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import InputWithPlace from "../components/InputWithPlace";
import background from "../assets/background.svg";
import appleicon from "../assets/appleicon.svg";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { auth, signInWithApplePopup, signInWithGooglePopup } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

axios.defaults.withCredentials = true;

function SignUp() {
  //zod schema
  const signupSchema = z
    .object({
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z
        .string()
        .min(8, "Confirm Password must be at least 8 characters long"),
      category: z.enum(["doctor", "student", "organisation"], {
        errorMap: () => ({ message: "Invalid category" }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const [signupInputs, setSgnupInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: any) {
    setSgnupInputs({ ...signupInputs, [e.target.name]: e.target.value });
  }

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state?.id || 2;
  let category = "";
  if (id === 1) {
    category = "organisation";
  } else if (id === 2) {
    category = "doctor";
  } else if (id === 3) {
    category = "student";
  }

  const finalData = {
    ...signupInputs,
    category: category,
  };

  async function handleSignUp(e: any) {
    e.preventDefault();

    console.log(category);

    //giving toast message based on zod validification
    const result = signupSchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0]; // Only the first error
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }
    //loading toast
    const accountcreate = toast.loading("creating account");
    try {
      //sending post request to backend
      const response = await axios.post(
        `${BACKEND_URL}/auth/signup`,
        {
          email: signupInputs.email,
          password: signupInputs.password,
          category: category,
        },
        { withCredentials: true }
      );

      // adding to firebase

      if (response) {
        try {
          await createUserWithEmailAndPassword(
            auth,
            signupInputs.email,
            signupInputs.password
          );

          toast.dismiss(accountcreate);

          //showing toast message
          toast.success("Signup successful!");

          const userid = response.data.id;

          console.log(userid);

          localStorage.setItem("Id", userid);

          if (id === 1) {
            navigate(`/signup/organisation/${userid}`, { state: userid });
          } else if (id === 2) {
            navigate(`/signup/doctor/${userid}`, { state: userid });
          } else if (id == 3) {
            navigate(`/signup/student/${userid}`, { state: userid });
          }
        } catch (e: any) {
          toast.error(e.message || "something went wrong");
        }
      }

    
    } catch (error: any) {
      toast.dismiss(accountcreate);
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }

  async function handleGoogleSignup(e: any) {
    e.preventDefault();
    
    const loadingToast = toast.loading("Signing up with Google...");
    
    try {
      const response = await signInWithGooglePopup();
      
      if (!response.user?.email) {
        toast.dismiss(loadingToast);
        toast.error("Could not get email from Google account");
        return;
      }

      const axiosResponse = await axios.post(
        `${BACKEND_URL}/auth/signup`,
        {
          email: response.user.email,
          category: category,
          password: response.user.uid,
        },
        {
          withCredentials: true,
        }
      );

      const userid = axiosResponse.data.id;
      localStorage.setItem("Id", userid);
      const token = await response.user.getIdToken();
      localStorage.setItem("token", token);

      toast.dismiss(loadingToast);
      toast.success("Signup successful!");

      // Navigate based on category
      switch (id) {
        case 1:
          navigate(`/signup/organisation/${userid}`, { state: userid });
          break;
        case 2:
          navigate(`/signup/doctor/${userid}`, { state: userid });
          break;
        case 3:
          navigate(`/signup/student/${userid}`, { state: userid });
          break;
        default:
          toast.error("Invalid user category");
      }

    } catch (error: any) {
      toast.dismiss(loadingToast);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in popup was closed. Please try again.");
        return;
      }

      if (error.code === 'auth/cancelled-popup-request') {
        toast.error("Another popup is already open");
        return;
      }

      if (error.response) {
        // Backend server error response
        toast.error(`Signup failed: ${error.response.data}`);
      } else if (error.request) {
        // No response from server
        toast.error("Could not connect to server. Please try again later.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
      
      console.error("Signup error:", error);
    }
  }

  const handleAppleSignup = async () => {
    await signInWithApplePopup();
  };

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen">
      <div className="bg-white flex-col rounded-lg px-8 py-2 max-w-md w-full  h-screen">
        <Toaster />

        <div className="w-full">
          <img className="w-full" src={background} alt="background image" />
        </div>

        <div className="mt-4">
          <MainHead />
        </div>

        <form onSubmit={handleSignUp}>
          <InputWithPlace
            place="Email-ID or Phone"
            type="email"
            onChange={handleChange}
            name="email"
            value={signupInputs.email}
          />

          <div className="w-full max-w-sm min-w-[200px] mt-5">
            <input
              className="w-full bg-transparent text-base placeholder:text-slate-400 text-slate-700  border border-main rounded-lg px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Password (8 or more characters)"
              type="password"
              onChange={handleChange}
              name="password"
              value={signupInputs.password}
            />
          </div>

          <div className="w-full max-w-sm min-w-[200px] mt-5">
            <input
              className="w-full bg-transparent text-base placeholder:text-slate-400 text-slate-700  border border-main rounded-lg px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Confirm Password"
              type="password"
              onChange={handleChange}
              name="confirmPassword"
              value={signupInputs.confirmPassword}
            />
          </div>

          <div className="text-center mt-6 text-xs">
            <p>
              By clicking 'Sign Up', you confirm that you accept our{" "}
              <span className="text-blue-800">
                <a href="#">Terms of service, </a>
              </span>{" "}
              <span className="text-blue-800">
                <a href="#">Privacy policy, </a>
              </span>
              and{" "}
              <span className="text-blue-800">
                <a href="#">Community Guidelines.</a>
              </span>
            </p>
          </div>

          <div className="mt-6">
            <Button
              label="Sign Up"
              bgColor="bg-main"
              textColor="text-white"
              onClick={handleSignUp}
            />
          </div>

          <div className="flex flex-row justify-center gap-10 items-center mt-8">
            <div
              className="flex flex-row justify-end ml-6 cursor-pointer"
              onClick={handleGoogleSignup}
            >
              <img src={googleicon} alt="google icon" />
            </div>

            <div
              className="flex flex-row justify-start mr-6 cursor-pointer"
              onClick={handleAppleSignup}
            >
              <img src={appleicon} alt="apple icon" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;

import { useState } from "react";
import Button from "../components/Button";
import MainHead from "../components/MainHead";
import background from "../assets/background.svg";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import InputWithPlace from "../components/InputWithPlace";
import googleicon from "../assets/googleicon.svg";
import appleicon from "../assets/appleicon.svg";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGooglePopup } from "@/firebase";
import axios from "axios";
import { BACKEND_URL } from "@/config";

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [passwordVisiblity, setPasswordVisibilty] = useState(false);

  function handlePasswordVisibility() {
    setPasswordVisibilty((prev) => !prev);
  }

  function handleChange(e: any) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  async function handleLogin(e: any) {
    e.preventDefault();
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const firstError = result.error.errors[0]; // Only the first error
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loggingIn = toast.loading("Logging in");

    try {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
          date: new Date().toISOString(),
          email : values.email,
        });


        console.log(response.data);

        navigate("/");
      } catch (e: any) {
        toast.error(e.message || "something went wrong");
      }

      toast.dismiss(loggingIn);
    } catch (error: any) {
      toast.dismiss(loggingIn);
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      const email = user.email;
      const password = result.user.uid;

      const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email,
        provider: "google",
      });

      const { exists, token } = response.data;

      if (exists) {
        toast.success("Sign in successful!");
        localStorage.setItem("token", token);
        window.location.href = "/";
      } else {
        if (email) {
          localStorage.setItem("googleEmail", email);
          localStorage.setItem("googlePassword", password);
          toast.info("Please select your category to complete registration");
          navigate("/category");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error(
          "This email is already registered. Please sign in instead."
        );
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen">
      <div className="bg-white flex-col rounded-2xl p-8 max-w-md w-full shadow-md h-screen">
        <div className="w-full">
          <img className="w-full" src={background} alt="background" />
        </div>

        <div className="mt-4">
          <MainHead />
        </div>

        <Toaster />

        <form onSubmit={handleLogin}>
          <InputWithPlace
            onChange={handleChange}
            place="Email-ID or Phone"
            type="email"
            name="email"
            value={values.email}
          />

          <div className="flex flex-row items-center w-full max-w-sm min-w-[200px] mt-5 border border-main rounded-lg  transition duration-300 ease  focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow">
            <input
              className="w-full bg-transparent text-base placeholder:text-slate-400 text-slate-700 px-3 py-3 focus:outline-none"
              placeholder="Password (8 or more characters)"
              type={passwordVisiblity ? "text" : "password"}
              onChange={handleChange}
              name="password"
              value={values.password}
            />
            <div
              className="px-3 text-slate-400 cursor-pointer"
              onClick={handlePasswordVisibility}
            >
              {passwordVisiblity ? <LuEyeOff /> : <LuEye />}
            </div>
          </div>

          <div className="flex flex-row justify-end mt-2">
            <p className="text-sm">Forgot password ?</p>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleLogin}
              label="Login"
              bgColor="bg-main"
              textColor="text-white"
            />
          </div>

          <div className="flex flex-row items-center justify-center mt-6">
            <div className="border-b border-slate-200 w-full shadow-sm">
              <hr />
            </div>

            <div className="flex justify-center w-full ">
              <p className="text-sm font-light">Sign In with</p>
            </div>

            <div className="border-b border-slate-200 w-full shadow-sm">
              <hr />
            </div>
          </div>

          <div className="flex flex-row justify-center gap-6 items-center mt-4">
            <div
              className="flex flex-row cursor-pointer justify-end pr-4"
              onClick={handleGoogleSignin}
            >
              <img src={googleicon} alt="google icon" />
            </div>

            <div className="flex flex-row justify-start pl-4">
              <img src={appleicon} alt="apple icon" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center mt-10">
            <p className="text-sm font-light">
              Not registered yet?{" "}
              <span className="font-normal hover:cursor-pointer">
                <Link to={"/category"}> Create Account</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

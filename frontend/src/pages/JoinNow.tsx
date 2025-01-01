import joinLogo from "../assets/joinlogo.svg";
import Button from "../components/Button";
import googleicon from "../assets/googleicon.svg";
import appleicon from "../assets/appleicon.svg"

import MainHead from "../components/MainHead";
import { useNavigate } from "react-router-dom";

function JoinNow() {
  const navigate = useNavigate();

  function handleJoinNow() {
    navigate("/category");
  }

  function handleSignIn() {
    navigate("/auth/signin");
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center h-screen ">
      <div className="bg-white flex-col rounded-lg p-8 max-w-md w-full  h-screen">
        <MainHead />

        <div className="flex justify-center mt-8">
          <img src={joinLogo} alt="join logo" />
        </div>

        <div className="mt-8">
          <Button
            label="Join now"
            bgColor="bg-main"
            textColor="text-white"
            onClick={handleJoinNow}
          />
        </div>

        <div className=" flex flex-row justify-center items-center rounded-full border-2 mt-3">
          <div className="w-6">
            <img src={googleicon} alt="google icon" />
          </div>
          <div className="flex justify-center">
            <button className={'w-full  flex justify-center'}>
              <p className={"text-black  font-semibold p-2"}>
                Continue with Google
              </p>
            </button>
          </div>
        </div>

        <div className=" flex flex-row justify-center items-center rounded-full border-2 mt-3">
          <div className="w-6">
            <img src={appleicon} alt="apple icon" />
          </div>
          <div className="flex justify-center">
            <button className={'w-full  flex justify-center'}>
              <p className={"text-black  font-semibold p-2"}>
                Continue with Apple
              </p>
            </button>
          </div>
        </div>

       

        <p
          onClick={handleSignIn}
          className="flex justify-center text-main text-lg font-semibold p-2 cursor-pointer mt-5"
        >
          Sign in
        </p>
      </div>
    </div>
  );
}

export default JoinNow;

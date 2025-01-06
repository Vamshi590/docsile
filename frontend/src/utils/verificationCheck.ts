import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast } from "sonner";

export const checkVerification = async (
  userId: string, 
  action: string,
  navigate: (path: string) => void,
  setShowDialog: (show: boolean) => void
) => {
  const loading = toast.loading("Checking verification status");
  try {
    const response = await axios.get(`${BACKEND_URL}/check-verification`, {
      params: { id: userId },
    });
    const verified = response.data.verified;

    if (verified) {
      toast.dismiss(loading);
      toast.success(`Verified, redirecting to ${action}`);
      navigate(`/${action}/${userId}`);
    } else {
      toast.dismiss(loading);
      toast.warning("Please verify your medical registration first");
      setShowDialog(true);
    }
  } catch (e) {
    toast.dismiss(loading);
    toast.error("Something went wrong. Please try again later");
    console.error(e);
  }
}; 
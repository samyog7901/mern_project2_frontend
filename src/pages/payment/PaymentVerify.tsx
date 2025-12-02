import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import APIWITHTOKEN from "../../http/APIWITHTOKEN";
import { toast } from "react-hot-toast";


function PaymentVerify() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const pidx = params.get("pidx");

        if (!pidx) return;

        const res = await APIWITHTOKEN.post("/order/verify", { pidx });
        if (res.status === 200) {
            toast.success("Order placed successfully!",{duration:2000});
            navigate("/myOrders");
        } else {
          navigate("/");
          alert("❌ Payment verification failed!");
          
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Something went wrong!");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold">Verifying your payment...</h2>
    </div>
  );
}

export default PaymentVerify;

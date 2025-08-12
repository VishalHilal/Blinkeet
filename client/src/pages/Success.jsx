import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = Boolean(location?.state?.text) ? location.state.text : "Payment";

   const [searchParams] = useSearchParams();

      useEffect(()=>{

       const sessionId = searchParams.get("session_id");

      console.log("session id is ",sessionId);
      if(sessionId){
        navigate("/success");
      }else{
        navigate("/");
      }
  
      },[searchParams])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl border border-green-200 rounded-2xl p-6 md:p-8 text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="text-green-600" size={56} />
          <h2 className="text-2xl font-bold text-green-700">
            {message} Successful
          </h2>
          <p className="text-gray-600 text-sm">
            Thank you for your transaction. You can now return to the homepage.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
          >
            Go To Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;

import { Button } from "@/components/ui/button";
import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function CloudinaryUploadWidget({ uwConfig, setPublicId, idEle, buttonText }) {
  const [loaded, setLoaded] = useState(false);
  const [val, setval] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);


  useEffect(() => {
    console.log(loaded)

    if (loaded && window.cloudinary) {
      // Check if cloudinary is available
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setPublicId(result.info.public_id);
          }
        }
      );
        
      const buttonElement = document.getElementById(idEle);
      const openWidget = () => {
        
        myWidget.open();
      };

      // Add event listener only once
      buttonElement.addEventListener("click", openWidget);

      // Cleanup function to remove the listener on component unmount
      return () => {
        buttonElement.removeEventListener("click", openWidget);
        setval(false)
      };
    }
  }, [loaded, uwConfig, val, setPublicId, idEle]); // Dependencies include loaded state and props

  const handleClick =()=>{
    setval(true)
    console.log(loaded)
  }

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <Button
        id={idEle}
        className="bg-black text-white border-2 border-white"
        type="button"
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };

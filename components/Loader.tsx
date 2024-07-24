import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="loader">
      <Image
        className="animate-spin"
        alt="loader"
        width={32}
        height={32}
        src={"/assests/ions/loader.svg"}
      />
      Loading...
    </div>
  );
};

export default Loader;

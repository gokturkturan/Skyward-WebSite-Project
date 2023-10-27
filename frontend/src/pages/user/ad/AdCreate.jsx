import React from "react";
import Sidebar from "../../../components/Sidebar";

const AdCreate = () => {
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Ad Create</h1>
      <Sidebar page="/ad/create" />
    </div>
  );
};

export default AdCreate;

import React, { useState } from "react";

import { FileUpload } from "react-ipfs-uploader";

export function song() {
  const [fileUrl, setFileUrl] = useState("");

  return (
    <div>
      <FileUpload setUrl={setFileUrl} />
      FileUrl :{" "}
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        {fileUrl}
      </a>
    </div>
  );
}

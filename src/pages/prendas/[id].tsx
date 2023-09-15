import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import FsLightbox from "fslightbox-react";

interface Props {}

const prenda: React.FC<Props> = ({}) => {
  //get data
  const { id } = useRouter().query;
  //error handling
  if (!id || id instanceof Array) {
    return <div>NO SUCH GARMENT !!!</div>;
  }
  const { data } = api.garments.getOne.useQuery({ id: id });

  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);
  const [picturesUrls, setPicturesUrls] = useState<string[]>([]);

  useEffect(() => {
    let tempArray: string[] = [];
    data?.pictures.forEach((picture) => {
      tempArray.push(picture.url);
    });
    setPicturesUrls(tempArray);
  }, [data]);

  return (
    <div className="border-2 border-orange px-32">
      <button onClick={() => setToggler(!toggler)}>Open the lightbox.</button>
      <FsLightbox toggler={toggler} sources={picturesUrls} />
    </div>
  );
};

export default prenda;

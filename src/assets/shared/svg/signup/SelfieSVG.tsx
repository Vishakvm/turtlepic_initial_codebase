import React from 'react';
import Selfie from 'src/assets/shared/images/Selfie.png';

export default function SelfieSVG(): React.ReactElement {
  return <img src={String(Selfie)} alt="selfie" />;
}

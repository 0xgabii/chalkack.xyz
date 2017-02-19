import React from 'react';

const SlideImage = props =>
  <div className={props.class}>
    <ul>
      {props.images.map((data, i) => <li key={i}><img key={i} src={data} alt="intro_image" /></li>)}
    </ul>
  </div>;
export default SlideImage;

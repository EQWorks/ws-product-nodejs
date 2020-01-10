import React, { useState } from "react";  
import ReactDOM from "react-dom"; 

export default function Button(props) {
  return <button onClick={props.onClick} value={props.value}>{props.children}</button>;
}
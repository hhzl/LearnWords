import inputTmp from "./Input.html";
import "./Input.scss";

const Input = (props) => {
  props = props || {};

  return inputTmp
    .replace(/{{id}}/g, `"${props.id}"` || "")
    .replace(/{{label}}/g, props.label || "")
    .replace(/{{formClass}}/g, props.formClass || "")
    .replace(/{{placeholder}}/g, `"${props.placeholder}"` || "")
    .replace(/{{dataToggle}}/g, `"${props.dataToggle}"` || "")
    .replace(/{{dataLang}}/g, `"${props.dataLang}"` || "");
};

export default Input;

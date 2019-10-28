// comment the following lines and the issue will be fixed
import "./style.scss";
// import "./style.less";

const mainNode = document.querySelector("#main-app");
// intentional ts error
mainNode.textContent = "This is main app";
if (mainNode) {
}

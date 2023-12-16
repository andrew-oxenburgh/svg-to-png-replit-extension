import { useEffect, useState, useRef, Fragment } from "react";
// import svg from './sample.svg'
// import { svg2png, initialize } from "svg2png-wasm";

import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
import { fs } from "@replit/extensions";
import { createUseStyles } from "react-jss";
// import bufferFrom from "buffer-from";

const useStyles = createUseStyles({
  h1: {
    color: "green",
    margin: {
      top: 5,
      right: 0,
      bottom: 5,
      left: 0,
    },
    "& span": {
      fontWeight: "bold",
    },
  },
  canvas: {
    // width: "10em",
    height: "10em",
    width: "10em",
    border: "1px solid black",
    // background: 'blue',
    // color: 'red',
  },
  div: {
    // width: "10em",
    height: "10em",
    border: "1px solid red",
  },
});


function _base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const saveTo = async (filename: string, img: string) => {
  // var data = img.split(',')[1]

  console.log('saving this = ' + img.substring(0, 50))
  await fs.writeFile(filename, _base64ToArrayBuffer(img));
};

function Component() {
  const [srcImg, setSrcImg] = useState<string>("");
  const [svg, setSvg] = useState<string>("");
const [success, setSuccess] = useState<string>("");
  const canvas = useRef();
  const img = useRef();

  const classes = useStyles();
  const filename = "./sample.svg";

  const onRead = async () => {
    try {
      // console.log("clicked");
      // const filename = ".";
      // const res: { error: string } | { content: string } =
      //   await fs.readFile(filename);
      // if (res?.error) {
      //   setSvg("Error: " + res.error);
      //   return;
      // }

      // const svgText = encodeURI(res?.content);

      const txt = await fs.readFile(filename);
      if (txt?.error) {
        setSuccess(txt.error);
        return;
      }
      const chickenEncoded = dataPrefix + txt.content.replaceAll(/\s+/g, " ");

      console.log("CE = " + chickenEncoded);
      const ctxt = canvas.current.getContext("2d");

      var myImg = new Image();
      myImg.src = chickenEncoded;
      // myImg.onload = function () {
      //   console.log("loaded...");
      //   ctxt.drawImage(myImg, 0, 0);
      // };

      myImg.onload = () => {
        alert("jjjjjjjj");
        ctxt.drawImage(myImg, 0, 0);
      };
      // myImg.src = chickenEncoded;
      myImg.width = 20;
      myImg.height = 20;
      // myImg.onload = function () {
      // ctxt.drawImage(myImg, 0, 0, 100, 100);
      console.log("onRead");

      // ctxt.drawImage(myImg, 0, 0);
      // setSvg(myImg.src);
      // };
      // canvas.current.src = "/sample.svg ";
      // ctxt.drawImage(res.content, 0, 0, 100, 100);
    } catch (e) {
      setSuccess(e + "");
    }
  };

  const onSvg = async () => {
    // const txt = await fs.readFile(filename);
    // if (txt?.error) {
    //   setSuccess(txt.error);
    //   return;
    // }
    // const data = txt.content;
    const txt = await fs.readFile('sample.svg');
    console.log(JSON.stringify(txt, null, 2))
    if (txt?.error) {
      setSuccess(txt.error);
      return;
    }
    const chickenEncoded = txt.content;
    // const chickenEncoded = dataPrefix + txt.content.replaceAll(/\s+/g, " ");

    console.log("CE = " + chickenEncoded);  
    const img = new Image();
    img.src = chickenEncoded;
    img.width = 100;
    img.height = 100;
    canvas.current.getContext("2d").drawImage(img, 0, 0, 100, 100);
    // saveTo("sample.png", chickenEncoded);
  };

  const onConvert = async () => {
    setSuccess("converting");
    try {
      let data = canvas?.current.toDataURL("image/png");
      // data = data.substring("data:image/png;base64,".length)
      // data = atob(data.substring(22))
      // data = _base64ToArrayBuffer(data.substring(22))
      // data = data.substring("data:image/png;base64,".length)
      // data = data.replace(/^data:image\/\w+;base64,/, "");
      // data =    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

      canvas.current.getContext('2d').drawImage(img.current, 0, 0, 100, 100)
      
      console.log("data = " + data);
      setSuccess(data.length);
      // await saveTo("new.png", data);
      console.log("converted");
    } catch (e) {
      setSuccess(e + "");
    }
  };

  return (
    <>
      <h1 className={classes.h1}>Replit Extension</h1>
      <button onClick={onSvg}>read file</button>
      <input type="text" />
      <div className={classes.div} dangerouslySetInnerHTML={{ __html: svg }} />
      <canvas
        src={chickenEncoded}
        ref={canvas}
        className={classes.canvas}
      ></canvas>
      <img alt="" ref={img} src={srcImg} />
      <button onClick={onConvert}>convert file</button>
      <div>{success}</div>
      <div>{svg}</div>
      <img src={thing} />
      {/* <div>{chickenEncoded}</div>  */}
    </>
  );
}

render(<Component />, document.getElementById("root") as Element);

export default Component;

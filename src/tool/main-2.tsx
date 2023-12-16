import { useEffect, useState, useRef, Fragment } from "react";
// import svg from './sample.svg'
// import { svg2png, initialize } from "svg2png-wasm";
import * as utils from "./utils";
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
  postView:{
     width: '100',
    border: '1px solid #ccc',
  },
  preView:{
     width: '100',
    border: '1px solid #ccc',
  },
canvas: {
    // width: "10em",
    // height: "10em",
    // width: "10em",
    // border: "1px solid black",
    // background: 'blue',
    // color: 'red',
  },
  div: {
    // width: "10em",
    height: "10em",
    border: "1px solid red",
  },
});

function Component() {
  const [status, setStatus]: [string[], any] = useState(["started"]);
  const [svg, setSvg] = useState("");

  const canvas = useRef();
  const img = useRef();
  const addStatus = (msg: string) => {
    console.log(msg);
    setStatus((status) => [...status, msg]);
  };
  const classes = useStyles();

  const onRead = async () => {
    const { error, content } = await fs.readFile("sample.svg");
    if (error) {
      addStatus(error);
      return;
    }
    const enc = utils.svgEncode(content);
    addStatus(enc.substring(0, 1000));
    setSvg(enc);
  };

  const onCanvas = async () => {
    canvas.current.getContext("2d").drawImage(img.current, 0, 0);
  };

  const onSave = async () => {
    const data = canvas.current.toDataURL("image/png)");
    utils.saveTo("test.png", data);
  };

  return (
    <>
      <h1 className={classes.h1}>Replit Extension</h1>
      <button onClick={onRead}>read file</button>
      <button onClick={onCanvas}>canvas</button>
      <button onClick={onSave}>save</button>

      <img src={svg} ref={img} className={classes.preView} />
      <canvas ref={canvas} width="1000" height="1000" className={classes.canvas} />
    <img className={classes.postView} src="./test.png"/>
      {status.map((s, index) => (
        <p key={index}>{s}</p>
      ))}

      {/* <div className={classes.div} dangerouslySetInnerHTML={{ __html: svg }} />
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
      <div>{chickenEncoded}</div>  */}
    </>
  );
}

render(<Component />, document.getElementById("root") as Element);

export default Component;

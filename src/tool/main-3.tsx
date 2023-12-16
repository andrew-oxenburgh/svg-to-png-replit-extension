import { useEffect, useState, useRef, Fragment } from "react";
import * as utils from "./utils";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
import { fs } from "@replit/extensions";
import { createUseStyles } from "react-jss";

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
  preView: {
    width: "10em",
    border: "1px solid red",
    margin: "1em",
  },
  canvas: {
    width: "10em",
    border: "1px solid blue",
  },
  postView: {
    width: "10em",
    border: "1px solid orange",
  },
  div: {
    height: "10em",
    border: "1px solid red",
  },
});

function Component() {
  const [status, setStatus] = useState<string[]>(["started"]);
 
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

    img.current.onload = () => {
      const cvs = canvas.current;
      cvs.getContext("2d").drawImage(img.current, 0, 0);
      const data = cvs.toDataURL("image/png)");
      utils.saveTo("test.png", data);
      setStatus([]);
    };
    img.current.src = enc;

    addStatus(enc.substring(0, 1000));
  };

  return (
    <>
      <h1 className={classes.h1}>Replit Extension</h1>
      <input type="text" />
      <button onClick={onRead}>read file</button>
      <br />
      <img src={utils.dataUrlBlank} ref={img} className={classes.preView} />
      <canvas ref={canvas} className={classes.canvas} />
      <img className={classes.postView} src="./test.png" />
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

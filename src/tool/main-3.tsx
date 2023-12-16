import { useEffect, useState, useRef, Fragment } from "react";
import * as utils from "./utils";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
import { fs } from "@replit/extensions";

import { Header, Container, Image, Input, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./override.css";
function Component() {
  const [status, setStatus] = useState<string[]>(["started"]);

  const addStatus = (msg: string) => {
    console.log(msg);
    setStatus((status) => [...status, msg]);
  };

  const onRead = async () => {
    addStatus("onRead");
    const imgEle = document.querySelector("#img");
    const canvasEle = document.querySelector("#canvas");
    addStatus(imgEle + "");
    if (!imgEle || !canvasEle) {
      addStatus("error");
      return;
    }
    addStatus("set up correctly");
    imgEle.onload = async () => {
      addStatus("loaded");
      await canvasEle.getContext("2d").drawImage(imgEle, 0, 0);
      const data = canvasEle.toDataURL("image/png)");
      utils.saveTo("test.png", data);
    };

    const { error, content } = await fs.readFile("sample.svg");
    if (error) {
      addStatus(error);
      return;
    }
    const enc = utils.svgEncode(content);

    imgEle.src = enc;

    addStatus(enc.substring(0, 1000));
  };

  return (
    <Container>
      <Header>Replit Extension</Header>
      <Input type="text" />
      <Button onClick={onRead}>read file</Button>
      <Image id="img" src={utils.dataUrlBlank} />
      <canvas id="canvas"/>
      <Image src="./test.png" />
      {status.map((s, index) => (
        <p key={index}>{s}</p>
      ))}
    </Container>
  );
}

render(<Component />, document.getElementById("root") as Element);

export default Component;

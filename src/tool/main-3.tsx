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
  const [fileName, setFileName] = useState<string>("examples/sample.svg");
  const [fileFound, setFileFound] = useState<boolean>(true);

  useEffect(() => {
    const run = async () => {
      if (!fileFound) {
        return;
      }
      const imgEle = document.querySelector("#img") as HTMLImageElement;
      const { error, content } = await fs.readFile(fileName);
      if (error) {
        addStatus(error);
        return;
      }
      const enc = utils.svgEncode(content);

      imgEle.src = enc;
    };
    run();
  }, [fileFound]);
  const addStatus = (msg: string) => {
    console.log(msg);
    setStatus((status) => [...status, msg]);
  };

  const onRead = async () => {
    addStatus("onRead");
    // can't use ref's with semantic-ui-react
    const imgEle = document.querySelector("#img") as HTMLImageElement;
    const canvasEle = document.querySelector("#canvas") as HTMLCanvasElement;
    addStatus("set up correctly");
    imgEle.onload = async () => {
      addStatus("loaded");
      canvasEle
        .getContext("2d")
        ?.drawImage(imgEle, 0, 0, 200, 200, 0, 0, 200, 200);
      const data = canvasEle.toDataURL("image/png)");
      utils.saveTo("test.png", data);
      addStatus('saved')
    };

    const { error, content } = await fs.readFile(fileName);
    if (error) {
      addStatus(error);
      return;
    }
    const enc = utils.svgEncode(content);

    imgEle.src = enc;

    addStatus(enc);
  };

  const onFileNameChange = async (e: any) => {
    const newFileName = e.target.value;
    addStatus(newFileName);
    setFileName(newFileName);
    const { error } = await fs.readFile(newFileName);
    addStatus(">>>>>>" + error);
    const found =! (error && error.length > 0);
    setFileFound(found);
  };

  const disabled = fileFound ? "" : "disabled";
  // const disabled = "";
  return (
    <Container>
      <Header>Replit Extension</Header>
      <Input type="text" onChange={onFileNameChange} value={fileName} />
      <Button onClick={onRead} disabled={disabled}>
        read file
      </Button>
      <p>{fileName}</p>
      <Image id="img" />
      <canvas id="canvas" width="200" height="200" />
      <Image src="./test.png" size="small" centered />
      {status.map((s, index) => (
        <p key={index}>{s}</p>
      ))}
    </Container>
  );
}

render(<Component />, document.getElementById("root") as Element);

export default Component;

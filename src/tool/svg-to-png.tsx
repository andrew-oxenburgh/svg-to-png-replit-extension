import { useEffect, useState, useRef, Fragment } from "react";
import * as utils from "./utils";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
import { fs } from "@replit/extensions";

import {
  Header,
  Container,
  Image,
  Input,
  Button,
  Form,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./override.css";

function Component() {
  const [status, setStatus] = useState<string[]>(["started"]);
  const [fileName, setFileName] = useState<string>("examples/1.svg");
  const [destFile, setDestFile] = useState<string>("icons/icon-200x200.png");
  const [fileFound, setFileFound] = useState<boolean>(true);
  const [side, setSide] = useState<number>(200);

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
      const ctx = canvasEle.getContext("2d");
      ctx.fillStyle = "orange";
      ctx.fillRect(0, 0, canvasEle.width, canvasEle.height);
      ctx.drawImage(imgEle, 0, 0, side, side);
      const data = canvasEle.toDataURL("image/png)");
      utils.saveTo(destFile, data);
      addStatus("saved");
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
    const found = !(error && error.length > 0);
    setFileFound(found);
  };

  const changeSide = (n: number) => {
    setSide(n);
    setDestFile(`icons/icon-${n}x${n}.png`);
  }

  const onChangeSide = (e: any) => {
    const sz = e.target.value;
    changeSide(parseInt(sz));
  };

  let buttonStatus = fileFound ? {primary: true} : {disabled: true};
  
  // const disabled = "";
  return (
    <Container>
      <Header size="large">svg-to-png</Header>
      <Header size="small">Create png icons from an svg</Header>
      <Form>
        <Form.Field>
          <label>Enter filename</label>
          <Input type="text" onChange={onFileNameChange} value={fileName} />
        </Form.Field>
        <Form.Field>
          <label>icon size</label>
          <Input type="number" onChange={onChangeSide} value={side} />
        </Form.Field>
        <p>saving to {destFile}</p>
        <Button onClick={onRead} {...buttonStatus}>
          Create Icon
        </Button>
      </Form>
      <Image id="img" size="small" centered />
      <canvas id="canvas" width={side} height={side} />
      {/* {status.map((s, index) => (
        <p key={index}>{s}</p>
      ))} */}
    </Container>
  );
}

render(<Component />, document.getElementById("root") as Element);

export default Component;

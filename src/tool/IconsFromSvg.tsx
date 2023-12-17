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
  Segment,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./override.css";

function Mono({ children }) {
  return <code className="mono">{children}</code>;
}

function Page({ children }) {
  return <Container className="page">{children}</Container>;
}

enum SavingState {
  saved,
  saving,
  error,
}

function IconsFromSvg() {
  const [srcFile, setSrcName] = useState<string>("examples/1.svg");
  const [destFile, setDestFile] = useState<string>("icons/icon-200x200.png");
  const [fileFound, setFileFound] = useState<boolean>(true);
  const [saving, setSaving] = useState<SavingState>(SavingState.saved);
  const [side, setSide] = useState<number>(200);

  useEffect(() => {
    const run = async () => {
      const imgEle = document.querySelector("#img") as HTMLImageElement;
      if (!fileFound) {
        imgEle.src = utils.dataUrlBlank;
        return;
      }
      const { error, content } = await fs.readFile(srcFile);
      if (error) {
        return;
      }
      const enc = utils.svgEncode(content);

      imgEle.src = enc;
    };
    run();
  }, [fileFound]);

  const onRead = async () => {
    setSaving(SavingState.saving);
    // can't use ref's with semantic-ui-react
    const imgEle = document.querySelector("#img") as HTMLImageElement;
    const canvasEle = document.querySelector("#canvas") as HTMLCanvasElement;
    imgEle.onload = async () => {
      const ctx = canvasEle.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasEle.width, canvasEle.height);
      ctx.drawImage(imgEle, 0, 0, side, side);
      const data = canvasEle.toDataURL("image/png)");
      utils.saveTo(destFile, data);
      setSaving(SavingState.saved);
    };

    const { error, content } = await fs.readFile(srcFile);
    if (error) {
      alert("error reading file");
      return;
    }
    const enc = utils.svgEncode(content);

    imgEle.src = enc;
  };

  const onFileNameChange = async (e: any) => {
    const newFileName = e.target.value;
    setSrcName(newFileName);
    const { error } = await fs.readFile(newFileName);
    const found = !(error && error.length > 0);
    setFileFound(found);
  };

  const changeSide = (n: number) => {
    setSide(n);
    setDestFile(`icons/icon-${n}x${n}.png`);
  };

  const onChangeSide = (e: any) => {
    const sz = e.target.value;
    changeSide(parseInt(sz));
  };

  let buttonStatus = fileFound ? { primary: true } : { disabled: true };
  return (
    <Page>
      <Header textAlign="center" size="huge">
        icons-from-svg
      </Header>
      <Segment attached>
        <p>
          Select an svg source file, and a size and it will generate that png
          for in the <Mono>icons</Mono> folder.
        </p>
        <p>It will overwrite anything already in there, so be warned.</p>
      </Segment>

      <Header center size="large"></Header>
      <Header size="small">Create png icons from an svg</Header>
      <Form>
        <Form.Field>
          <label>Enter source file</label>
          <Input type="text" onChange={onFileNameChange} value={srcFile} />
        </Form.Field>
        <Form.Field>
          <label>icon size</label>
          <Input type="number" onChange={onChangeSide} value={side} />
        </Form.Field>
        <p className={saving === SavingState.saving ? "saving" : "saved"}>
          saving to <Mono>{destFile}</Mono>
        </p>
        <Button onClick={onRead} {...buttonStatus}>
          Create Icon
        </Button>
      </Form>
      <Image id="img" size="small" centered />
      <canvas id="canvas" width={side} height={side} />
      <a target="_blank" href="https://icons8.com/icon/59770/create">Create</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
    </Page>
  );
}

// render(<IconsFromSvg />, document.getElementById("root") as Element);

export default IconsFromSvg;

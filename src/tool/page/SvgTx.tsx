import { useEffect, useState, useRef, Fragment } from "react";
import * as utils from "./utils";
import { render } from "react-dom";
import { useReplit } from "@replit/extensions-react";
import { fs } from "@replit/extensions";
import { Mono, Page } from "../components/Widgets";
import {
  Header,
  Container,
  Image,
  Input,
  Button,
  Form,
  Segment,
  Message,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./override.css";

enum SavingState {
  saved,
  saving,
  error,
}

interface Props {
  width: number;
  height: number;
  content: string;
  onTranslation: (tx: string) => void;
  save: boolean;
}

function CreateTranslation({ width, height, content, onTranslation, save }) {
  useEffect(() => {
    async function tx() {
      if (!save) return;
      console.log(`${width}x${height}, ${save}`);

      const imgEle = document.querySelector("#img") as HTMLImageElement;
      const canvasEle = document.querySelector("#canvas") as HTMLCanvasElement;
      imgEle.onload = async () => {
        console.log("loading");
        const ctx = canvasEle.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasEle.width, canvasEle.height);
        ctx.drawImage(imgEle, 0, 0, width, height);
        const data = canvasEle.toDataURL("image/png)");
        onTranslation(data);
      };
      imgEle.src = content;
    }
    tx();
  });
  return (
    <>
      <Image id="img" size="small" centered />
      <canvas id="canvas" width={width} height={height} />
    </>
  );
}

function SvgTx() {
  const [srcFile, setSrcName] = useState<string>("examples/1.svg");
  const [destFile, setDestFile] = useState<string>(utils.saveToFileName(utils.saveToDirectory, 200));
  const [content, setContent] = useState<string>('');
  const [fileFound, setFileFound] = useState<boolean>(true);
  const [saving, setSaving] = useState<SavingState>(SavingState.saved);
  const [side, setSide] = useState<number>(200);

  useEffect(() => {
    const run = async () => {
      const imgEle = document.querySelector("#img") as HTMLImageElement;
      if (!fileFound) {
        imgEle.src = utils.dataUrlBlank(200);
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
    const { error, content } = await fs.readFile(srcFile);
    if (error) {
      alert("error reading file");
      return;
    }
    setContent(utils.svgEncode(content));
    setSaving(SavingState.saving);
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
    setDestFile(utils.saveToFileName(utils.saveToDirectory, n));
  };

  const onChangeSide = (e: any) => {
    const sz = e.target.value;
    changeSide(parseInt(sz));
  };

  const onTranslation = async (tx: string) => {
    utils.saveTo(destFile, tx);
    setSaving(SavingState.saved);
    console.log("saved");
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
      <Header textAlign="center" size="large"></Header>
      <Header size="small">Create png icons from an svg</Header>
      <Form>
        <Form.Field>
          <label>Enter source file</label>
          <Form.Input type="text" onChange={onFileNameChange} value={srcFile} />
        </Form.Field>
        <Form.Field>
          <label>icon size</label>
          <Input type="number" onChange={onChangeSide} value={side} />
        </Form.Field>
        <Button onClick={onRead} {...buttonStatus}>
          Create Icon
        </Button>
      </Form>
      <CreateTranslation
        width={side}
        height={side}
        content={content}
        onTranslation={onTranslation}
        save={saving === SavingState.saving}
      />
      <a target="_blank" href="https://icons8.com/icon/59770/create">
        Create
      </a>{" "}
      icon by{" "}
      <a target="_blank" href="https://icons8.com">
        Icons8
      </a>
    </Page>
  );
}

// render(<IconsFromSvg />, document.getElementById("root") as Element);

export default SvgTx;

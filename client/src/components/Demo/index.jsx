import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import Form from "../Form";

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");

  const demo =
    <>
      <Cta />
      <div className="contract-container">
        <Form/>
      </div>
      {/* <Desc /> */}
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;

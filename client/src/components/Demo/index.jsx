import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import Form from "../Form";

function Demo() {
	const { state } = useEth();

	const demo =
		<>
			<Cta />
			<div className="contract-container">
				<Form />
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

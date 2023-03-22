import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import VotesDisplay from "./components/VotesDisplay";
import Tally from "./components/Tally";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro />
          <hr />
          <Setup />
          <hr />
          <Demo />
          <hr />
          <VotesDisplay/>
          <hr />
          <Tally/>
          <hr />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
